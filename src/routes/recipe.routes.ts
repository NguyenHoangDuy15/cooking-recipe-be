import { Router } from 'express';
import { getRecipes, getRecipeById, createRecipe } from '../controllers/recipe.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', upload.single('image'), createRecipe);

export default router;
