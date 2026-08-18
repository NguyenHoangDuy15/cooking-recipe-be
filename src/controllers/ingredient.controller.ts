import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        image: true
      }
    });
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecipesByIngredients = async (req: Request, res: Response): Promise<void> => {
  try {
    const namesParam = req.query.names as string; // comma-separated names e.g., ?names=Tomato,Onion
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!namesParam) {
      res.status(400).json({ error: 'Query parameter "names" is required (comma-separated ingredient names)' });
      return;
    }

    const ingredientNames = namesParam.split(',').map(n => n.trim()).filter(Boolean);

    // Find recipes that contain ANY of these ingredients (or ALL? Usually ANY is easier or user implies ALL. Let's do ANY but rank, or just IN clause)
    // For simplicity, we'll find recipes that have at least one of the specified ingredients.
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where: {
          ingredients: {
            some: {
              ingredient: {
                name: {
                  in: ingredientNames
                }
              }
            }
          }
        },
        include: {
          image: true,
          cuisine: true,
          ingredients: { include: { ingredient: true } }
        },
        skip,
        take: limit,
      }),
      prisma.recipe.count({
        where: {
          ingredients: {
            some: {
              ingredient: {
                name: {
                  in: ingredientNames
                }
              }
            }
          }
        }
      })
    ]);

    res.json({
      data: recipes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
