import { Router } from 'express';
import { getAllIngredients, getRecipesByIngredients } from '../controllers/ingredient.controller';

const router = Router();

router.get('/', getAllIngredients);
router.get('/recipes', getRecipesByIngredients);

export default router;
