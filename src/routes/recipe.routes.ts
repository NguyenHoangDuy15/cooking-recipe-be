import { Router } from 'express';
import { getRecipes, getRecipeById, createRecipe } from '../controllers/recipe.controller';
import { upload } from '../middlewares/upload';
import { verifyToken } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { createRecipeSchema } from '../validations/schemas';

const router = Router();

// GET /api/recipes - Fetch all recipes with optional pagination, search, and filtering
router.get('/', asyncHandler(getRecipes));

// GET /api/recipes/:id - Fetch a single recipe by its ID including detailed instructions and ingredients
router.get('/:id', asyncHandler(getRecipeById));

// POST /api/recipes - Create a new recipe. Accepts 'multipart/form-data' for image uploads
router.post('/', verifyToken, upload.single('image'), asyncHandler(async (req, res, next) => {
  createRecipeSchema.parse(req.body); // will throw ZodError if invalid, handled by errorHandler
  await createRecipe(req, res);
}));

export default router;
