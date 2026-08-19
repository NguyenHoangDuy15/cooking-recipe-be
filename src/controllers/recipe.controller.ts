import type { Request, Response } from 'express';
import { processAndSaveImage } from '../services/image.service';
import { getRecipesService, getRecipeByIdService, createRecipeService } from '../services/recipe.service';

/**
 * Controller to handle fetching a paginated list of recipes with optional filters.
 * Extracts query parameters (page, limit, search, cuisineId, ingredients) and calls the service.
 * Responds with the paginated recipe data and metadata.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string || '').toLowerCase().trim();
    const cuisineId = req.query.cuisineId ? parseInt(req.query.cuisineId as string) : undefined;
    const ingredients = req.query.ingredients as string; // comma separated names

    const result = await getRecipesService(page, limit, search, cuisineId, ingredients);
    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to handle fetching a single recipe by its ID.
 * Expects `id` in request parameters.
 * Responds with the detailed recipe data or a 404 error if not found.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeByIdService(parseInt(id as string));

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe by id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller to handle creating a new recipe.
 * Expects 'multipart/form-data' payload. Processes optional image upload, parses ingredients and instructions,
 * and calls the service to create the recipe in the database.
 * Responds with the newly created recipe record.
 * 
 * @param {Request} req - The Express request object containing form data and optionally an uploaded file.
 * @param {Response} res - The Express response object.
 */
export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    // Process image if provided in multipart form data
    let imageId = null;
    if (req.file) {
      const imageRecord = await processAndSaveImage(req.file, req);
      imageId = imageRecord.id;
    } else if (req.body.imageId) {
      // Optional: they might have uploaded the image previously via /api/images/upload
      imageId = parseInt(req.body.imageId);
    }

    const { title, description, cuisineId } = req.body;
    
    // Arrays might come as JSON strings in formData
    let ingredientsData: { ingredientId: number, quantity: string }[] = [];
    let instructionsData: { stepNumber: number, description: string }[] = [];
    
    try {
      if (req.body.ingredients) {
        ingredientsData = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;
      }
      if (req.body.instructions) {
        instructionsData = typeof req.body.instructions === 'string' ? JSON.parse(req.body.instructions) : req.body.instructions;
      }
    } catch (parseError) {
      res.status(400).json({ error: 'Invalid JSON format for ingredients or instructions' });
      return;
    }

    if (!title || !description || !cuisineId) {
      res.status(400).json({ error: 'Title, description, and cuisineId are required' });
      return;
    }

    const newRecipe = await createRecipeService(title, description, parseInt(cuisineId), imageId, ingredientsData, instructionsData);

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
