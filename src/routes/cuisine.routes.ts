import { Router } from 'express';
import { getAllCuisines, getRecipesByCuisineId, createCuisine } from '../controllers/cuisine.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { createCuisineSchema } from '../validations/schemas';

const router = Router();

router.get('/', asyncHandler(getAllCuisines));
router.post('/', verifyToken, asyncHandler(async (req, res, next) => {
  createCuisineSchema.parse(req.body); // will throw ZodError if invalid, handled by errorHandler
  await createCuisine(req, res);
}));
router.get('/:id/recipes', asyncHandler(getRecipesByCuisineId));

export default router;
