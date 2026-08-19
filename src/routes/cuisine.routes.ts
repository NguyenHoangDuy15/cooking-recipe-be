import { Router } from 'express';
import { getAllCuisines, getRecipesByCuisineId, createCuisine } from '../controllers/cuisine.controller';

const router = Router();

router.get('/', getAllCuisines);
router.post('/', createCuisine);
router.get('/:id/recipes', getRecipesByCuisineId);

export default router;
