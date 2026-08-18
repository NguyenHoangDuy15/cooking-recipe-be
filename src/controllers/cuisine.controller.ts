import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAllCuisines = async (req: Request, res: Response) => {
  try {
    const cuisines = await prisma.cuisine.findMany({
      include: {
        image: true
      }
    });
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecipesByCuisineName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cuisine = await prisma.cuisine.findUnique({
      where: { name: name as string }
    });

    if (!cuisine) {
      res.status(404).json({ error: 'Cuisine not found' });
      return;
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where: { cuisineId: cuisine.id },
        include: {
          image: true,
          cuisine: true,
          ingredients: { include: { ingredient: true } }
        },
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where: { cuisineId: cuisine.id } })
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
    console.error('Error fetching recipes by cuisine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
