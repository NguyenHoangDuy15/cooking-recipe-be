import { Router } from 'express';
import { getAllIngredients, getRecipesByIngredients, createIngredient } from '../controllers/ingredient.controller';

const router = Router();

router.get('/', getAllIngredients);
router.post('/', createIngredient);
router.get('/recipes', getRecipesByIngredients);

export default router;
