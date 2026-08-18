import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { processAndSaveImage } from '../services/image.service';

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const search = (req.query.search as string || '').toLowerCase().trim();
    const cuisine = req.query.cuisine as string;
    const ingredients = req.query.ingredients as string; // comma separated names

    // 1. Build Prisma where clause for strict filters (cuisine, exact ingredients)
    const whereClause: any = {};

    if (cuisine) {
      whereClause.cuisine = { name: cuisine };
    }

    if (ingredients) {
      const ingredientNames = ingredients.split(',').map(i => i.trim()).filter(Boolean);
      whereClause.ingredients = {
        some: {
          ingredient: {
            name: { in: ingredientNames }
          }
        }
      };
    }

    // Fetch all recipes matching the strict filters to do precise memory-filtering for search
    // This avoids MySQL's accent-insensitive collation matching "gà" with "ga" (Jjigae) or "gậ" (ngậy)
    const allRecipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        image: true,
        cuisine: true,
        ingredients: {
          include: { ingredient: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. JS Memory Filter for "search" keyword to ensure accurate substring matching
    let filteredRecipes = allRecipes;
    if (search) {
      filteredRecipes = allRecipes.filter(recipe => {
        const titleMatch = recipe.title.toLowerCase().includes(search);
        const descMatch = recipe.description.toLowerCase().includes(search);
        // Also check if any ingredient contains the search term (e.g. searching "gà" matches "Thịt gà")
        const ingredientMatch = recipe.ingredients.some(ri => 
          ri.ingredient.name.toLowerCase().includes(search)
        );
        
        // Exact word boundary matching using Regex for Unicode (optional, but includes() is usually enough)
        // includes() will still match "ngày" for "gà", but it won't falsely match "ngậy" or "ga" anymore.
        // To be even stricter and match the standalone word "gà":
        const regex = new RegExp(`(^|[^\\p{L}])${search}([^\\p{L}]|$)`, 'iu');
        
        return regex.test(recipe.title) || 
               regex.test(recipe.description) || 
               recipe.ingredients.some(ri => regex.test(ri.ingredient.name));
      });
    }

    // 3. Paginate the filtered results
    const total = filteredRecipes.length;
    const skip = (page - 1) * limit;
    const paginatedRecipes = filteredRecipes.slice(skip, skip + limit);

    res.json({
      data: paginatedRecipes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        image: true,
        cuisine: true,
        ingredients: {
          include: { ingredient: true }
        },
        instructions: {
          orderBy: { stepNumber: 'asc' }
        }
      }
    });

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe by id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    // Process image if provided in multipart form data
    let imageId = null;
    if (req.file) {
      const imageRecord = await processAndSaveImage(req.file, req);
      imageId = imageRecord.id;
    } else if (req.body.imageId) {
      // Optional: they might have uploaded the image previously via /api/images/upload
      imageId = parseInt(req.body.imageId);
    }

    const { title, description, cuisineId } = req.body;
    
    // Arrays might come as JSON strings in formData
    let ingredientsData: { ingredientId: number, quantity: string }[] = [];
    let instructionsData: { stepNumber: number, description: string }[] = [];
    
    try {
      if (req.body.ingredients) {
        ingredientsData = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;
      }
      if (req.body.instructions) {
        instructionsData = typeof req.body.instructions === 'string' ? JSON.parse(req.body.instructions) : req.body.instructions;
      }
    } catch (parseError) {
      res.status(400).json({ error: 'Invalid JSON format for ingredients or instructions' });
      return;
    }

    if (!title || !description || !cuisineId) {
      res.status(400).json({ error: 'Title, description, and cuisineId are required' });
      return;
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        cuisineId: parseInt(cuisineId),
        imageId,
        ingredients: {
          create: ingredientsData.map(i => ({
            quantity: i.quantity,
            ingredient: {
              connect: { id: i.ingredientId }
            }
          }))
        },
        instructions: {
          create: instructionsData.map(i => ({
            stepNumber: i.stepNumber,
            description: i.description
          }))
        }
      },
      include: {
        image: true,
        cuisine: true,
        ingredients: { include: { ingredient: true } },
        instructions: true
      }
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
