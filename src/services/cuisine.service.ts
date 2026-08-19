import { prisma } from '../config/prisma';

/**
 * Retrieves all cuisines from the database, including their associated images.
 *
 * @returns {Promise<Array<Object>>} A list of all cuisines.
 */
export const getAllCuisinesService = async () => {
  return await prisma.cuisine.findMany({
    include: {
      image: true // Include associated image if any
    }
  });
};

/**
 * Retrieves a paginated list of recipes belonging to a specific cuisine by its ID.
 *
 * @param {number} id - The unique ID of the cuisine.
 * @param {number} page - The current page number for pagination.
 * @param {number} limit - The number of items to return per page.
 * @returns {Promise<Object | null>} An object containing the paginated recipes and metadata, or null if cuisine is not found.
 */
export const getRecipesByCuisineIdService = async (id: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  // First find the cuisine ID based on the provided ID
  const cuisine = await prisma.cuisine.findUnique({
    where: { id }
  });

  if (!cuisine) {
    return null;
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where: { cuisineId: cuisine.id },
      include: {
        image: true,
        cuisine: true,
        ingredients: { include: { ingredient: true } }
      },
      skip,
      take: limit,
    }),
    prisma.recipe.count({ where: { cuisineId: cuisine.id } })
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
