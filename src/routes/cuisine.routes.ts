import { Router } from 'express';
import { getAllCuisines, getRecipesByCuisineName } from '../controllers/cuisine.controller';

const router = Router();

router.get('/', getAllCuisines);
router.get('/:name/recipes', getRecipesByCuisineName);

export default router;
