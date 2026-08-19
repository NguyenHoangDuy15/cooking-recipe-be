import type { Request, Response } from 'express';
import { getAllCuisinesService, getRecipesByCuisineIdService } from '../services/cuisine.service';

/**
 * Controller to handle fetching all cuisines.
 * Responds with a JSON array of all cuisines.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getAllCuisines = async (req: Request, res: Response) => {
  try {
    const cuisines = await getAllCuisinesService();
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to handle fetching recipes by a specific cuisine ID.
 * Expects `id` in request parameters and optional `page` and `limit` in query string.
 * Responds with paginated recipe data or a 404 error if the cuisine is not found.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getRecipesByCuisineId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getRecipesByCuisineIdService(parseInt(id as string), page, limit);

    if (!result) {
      res.status(404).json({ error: 'Cuisine not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
