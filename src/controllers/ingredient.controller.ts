import type { Request, Response } from 'express';
import { getAllIngredientsService, getRecipesByIngredientsService, createIngredientService } from '../services/ingredient.service';

/**
 * Retrieves a list of all available ingredients.
 * Supports optional search by name via 'name' query parameter.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getAllIngredients = async (req: Request, res: Response): Promise<void> => {
  const searchName = req.query.name as string;
  const ingredients = await getAllIngredientsService(searchName);
  res.json(ingredients);
};

/**
 * Retrieves recipes filtered by a specific list of ingredients.
 * Expects 'names' as a query parameter (comma-separated).
 * Supports pagination via 'page' and 'limit' parameters.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getRecipesByIngredients = async (req: Request, res: Response): Promise<void> => {
  const names = req.query.names as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!names) {
    res.status(400).json({ error: 'Please provide at least one ingredient name using the "names" query parameter' });
    return;
  }

  const ingredientNamesArray = names.split(',').map(name => name.trim());
  const result = await getRecipesByIngredientsService(ingredientNamesArray, page, limit);

  res.json(result);
};

/**
 * Creates a new ingredient.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const createIngredient = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  
  const newIngredient = await createIngredientService(name.trim());
  res.status(201).json(newIngredient);
};
