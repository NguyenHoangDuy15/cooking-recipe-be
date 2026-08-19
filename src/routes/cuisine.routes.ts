import { Router } from 'express';
import { getAllCuisines, getRecipesByCuisineId } from '../controllers/cuisine.controller';

const router = Router();

router.get('/', getAllCuisines);
router.get('/:id/recipes', getRecipesByCuisineId);

export default router;
