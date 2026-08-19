import { prisma } from '../config/prisma';

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
  // 1. Build Prisma where clause for strict filters (cuisine, exact ingredients)
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

  // Fetch all recipes matching the strict filters to do precise memory-filtering for search
  // This avoids MySQL's accent-insensitive collation matching "gà" with "ga" (Jjigae) or "gậ" (ngậy)
  const allRecipes = await prisma.recipe.findMany({
    where: whereClause,
    include: {
      image: true,
      cuisine: true,
      ingredients: {
        include: { ingredient: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Helper to remove Vietnamese accents
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  // 2. JS Memory Filter for "search" keyword to ensure accurate substring matching
  let filteredRecipes = allRecipes;
  if (search) {
    const unaccentedSearch = removeAccents(search).toLowerCase();

    filteredRecipes = allRecipes.filter(recipe => {
      return removeAccents(recipe.title).toLowerCase().includes(unaccentedSearch) || 
             removeAccents(recipe.description).toLowerCase().includes(unaccentedSearch) || 
             recipe.ingredients.some(ri => removeAccents(ri.ingredient.name).toLowerCase().includes(unaccentedSearch));
    });
  }

  // 3. Paginate the filtered results
  const total = filteredRecipes.length;
  const skip = (page - 1) * limit;
  const paginatedRecipes = filteredRecipes.slice(skip, skip + limit);

  return {
    data: paginatedRecipes,
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
 * @param {Array<{ingredientId: number, quantity: string}>} ingredientsData - Array of objects mapping ingredient IDs to their quantities.
 * @param {Array<{stepNumber: number, description: string}>} instructionsData - Array of objects representing cooking steps in order.
 * @returns {Promise<Object>} The newly created recipe object including its relationships.
 */
export const createRecipeService = async (title: string, description: string, cuisineId: number, imageId: number | null, ingredientsData: { ingredientId: number, quantity: string }[], instructionsData: { stepNumber: number, description: string }[]) => {
  return await prisma.recipe.create({
    data: {
      title,
      description,
      cuisineId,
      imageId,
      ingredients: {
        create: ingredientsData.map(i => ({
          quantity: i.quantity,
          ingredient: {
            connect: { id: i.ingredientId }
          }
        }))
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
