import { prisma } from '../config/prisma';

/**
 * Retrieves all available ingredients from the database, including their associated images.
 *
 * @returns {Promise<Array<Object>>} A list of all ingredients.
 */
export const getAllIngredientsService = async () => {
  return await prisma.ingredient.findMany({
    include: {
      image: true // Include associated image if any
    }
  });
};

/**
 * Retrieves a paginated list of recipes that contain ANY of the specified ingredients.
 *
 * @param {Array<string>} ingredientNames - An array of ingredient names to filter by.
 * @param {number} page - The current page number for pagination.
 * @param {number} limit - The number of items to return per page.
 * @returns {Promise<Object>} An object containing the paginated recipes and metadata.
 */
export const getRecipesByIngredientsService = async (ingredientNames: string[], page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            ingredient: {
              name: {
                in: ingredientNames
              }
            }
          }
        }
      },
      include: {
        image: true,
        cuisine: true,
        ingredients: { include: { ingredient: true } }
      },
      skip,
      take: limit,
    }),
    prisma.recipe.count({
      where: {
        ingredients: {
          some: {
            ingredient: {
              name: {
                in: ingredientNames
              }
            }
          }
        }
      }
    })
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
