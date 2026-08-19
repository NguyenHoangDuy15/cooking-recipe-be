import type { Request, Response } from 'express';
import { getAllIngredientsService, getRecipesByIngredientsService } from '../services/ingredient.service';

/**
 * Controller to handle fetching all ingredients.
 * Responds with a JSON array of all available ingredients.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await getAllIngredientsService();
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to handle fetching recipes that contain specified ingredients.
 * Expects `names` as a comma-separated query parameter (e.g. ?names=Tomato,Garlic).
 * Responds with paginated recipe data.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getRecipesByIngredients = async (req: Request, res: Response): Promise<void> => {
  try {
    const namesParam = req.query.names as string; // comma-separated names e.g., ?names=Tomato,Onion
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!namesParam) {
      res.status(400).json({ error: 'Query parameter "names" is required (comma-separated ingredient names)' });
      return;
    }

    const ingredientNames = namesParam.split(',').map(n => n.trim()).filter(Boolean);

    const result = await getRecipesByIngredientsService(ingredientNames, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
