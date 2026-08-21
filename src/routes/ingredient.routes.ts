import { Router } from 'express';
import { getAllIngredients, getRecipesByIngredients, createIngredient } from '../controllers/ingredient.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { createIngredientSchema } from '../validations/schemas';

const router = Router();

router.get('/', asyncHandler(getAllIngredients));
router.post('/', verifyToken, asyncHandler(async (req, res, next) => {
  createIngredientSchema.parse(req.body); // will throw ZodError if invalid, handled by errorHandler
  await createIngredient(req, res);
}));
router.get('/recipes', asyncHandler(getRecipesByIngredients));

export default router;
