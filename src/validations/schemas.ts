import { z } from 'zod';

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  cuisineId: z.preprocess((val) => parseInt(val as string, 10), z.number().positive('Valid cuisineId is required')),
  // We don't validate imageId here as it's processed dynamically by controller/multer
});

export const createCuisineSchema = z.object({
  name: z.string().min(1, 'Name is required')
});

export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required')
});
