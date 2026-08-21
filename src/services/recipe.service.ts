import { prisma } from '../config/prisma';
import { removeAccents } from '../utils/string.util';

/**
 * Retrieves a paginated list of recipes based on search, cuisine, and ingredient filters.
 * Applies exact DB filtering for cuisineId and ingredients, then performs memory-based Regex filtering for search terms.
 *
 * @param {number} page - The current page number for pagination.
 * @param {number} limit - The number of items to return per page.
 * @param {string} search - The search keyword to look for in title, description, or ingredient names.
 * @param {number | undefined} cuisineId - Optional ID of the cuisine to filter by.
 * @param {string | undefined} ingredients - Optional comma-separated list of ingredient names to filter by.
 * @returns {Promise<Object>} An object containing the paginated data array and pagination metadata.
 */
export const getRecipesService = async (page: number, limit: number, search: string, cuisineId: number | undefined, ingredients: string | undefined) => {
  const whereClause: any = {};

  if (cuisineId) {
    whereClause.cuisineId = cuisineId;
  }

  if (ingredients) {
    const ingredientNames = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    whereClause.ingredients = {
      some: {
        ingredient: { name: { in: ingredientNames } }
      }
    };
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { ingredients: { some: { ingredient: { name: { contains: search } } } } }
    ];
  }

  const skip = (page - 1) * limit;

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where: whereClause,
      include: {
        image: true,
        cuisine: true,
        ingredients: {
          include: { ingredient: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.recipe.count({ where: whereClause })
  ]);

  return {
    data: recipes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Retrieves a single recipe by its ID including its detailed relationships.
 *
 * @param {number} id - The ID of the recipe to fetch.
 * @returns {Promise<Object | null>} The recipe object with its cuisine, image, ingredients, and instructions, or null if not found.
 */
export const getRecipeByIdService = async (id: number) => {
  return await prisma.recipe.findUnique({
    where: { id },
    include: {
      image: true,
      cuisine: true,
      ingredients: {
        include: { ingredient: true }
      },
      instructions: {
        orderBy: { stepNumber: 'asc' }
      }
    }
  });
};

/**
 * Creates a new recipe along with its ingredients and instructions in the database.
 *
 * @param {string} title - The title of the recipe.
 * @param {string} description - A brief description of the recipe.
 * @param {number} cuisineId - The ID of the cuisine this recipe belongs to.
 * @param {number | null} imageId - The ID of the uploaded image record, or null if no image.
 * @param {Array<{ingredientId?: number, name?: string, quantity: string}>} ingredientsData - Array of objects mapping ingredient IDs or names to their quantities.
 * @param {Array<{stepNumber: number, description: string}>} instructionsData - Array of objects representing cooking steps in order.
 * @returns {Promise<Object>} The newly created recipe object including its relationships.
 */
export const createRecipeService = async (
  title: string, 
  description: string, 
  cuisineId: number, 
  imageId: number | null, 
  ingredientsData: { ingredientId?: number, name?: string, quantity: string }[], 
  instructionsData: { stepNumber: number, description: string }[]
) => {
  return await prisma.recipe.create({
    data: {
      title,
      description,
      cuisineId,
      imageId,
      ingredients: {
        create: ingredientsData.map(i => {
          if (i.ingredientId) {
            return {
              quantity: i.quantity,
              ingredient: {
                connect: { id: i.ingredientId }
              }
            };
          } else if (i.name) {
            return {
              quantity: i.quantity,
              ingredient: {
                connectOrCreate: {
                  where: { name: i.name },
                  create: { name: i.name }
                }
              }
            };
          } else {
            throw new Error('Each ingredient must have either an ingredientId or a name');
          }
        })
      },
      instructions: {
        create: instructionsData.map(i => ({
          stepNumber: i.stepNumber,
          description: i.description
        }))
      }
    },
    include: {
      image: true,
      cuisine: true,
      ingredients: { include: { ingredient: true } },
      instructions: true
    }
  });
};
