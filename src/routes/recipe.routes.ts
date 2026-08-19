import { Router } from 'express';
import { getRecipes, getRecipeById, createRecipe } from '../controllers/recipe.controller';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/recipes - Fetch all recipes with optional pagination, search, and filtering
router.get('/', getRecipes);

// GET /api/recipes/:id - Fetch a single recipe by its ID including detailed instructions and ingredients
router.get('/:id', getRecipeById);

// POST /api/recipes - Create a new recipe. Accepts 'multipart/form-data' for image uploads
router.post('/', upload.single('image'), createRecipe);

export default router;
