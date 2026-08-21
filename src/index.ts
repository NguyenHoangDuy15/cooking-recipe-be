import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import path from 'path';
import { fileURLToPath } from 'url';

import imageRoutes from './routes/image.routes';
import recipeRoutes from './routes/recipe.routes';
import cuisineRoutes from './routes/cuisine.routes';
import ingredientRoutes from './routes/ingredient.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, './docs/swagger.json'), 'utf8')
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for local upload mode
if (config.storageMode === 'local') {
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/cuisines', cuisineRoutes);
app.use('/api/ingredients', ingredientRoutes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cooking Recipe API',
    endpoints: {
      swaggerDocs: '/api-docs',
      healthCheck: '/health',
      getAllRecipes: '/api/recipes',
      getAllCuisines: '/api/cuisines',
      getAllIngredients: '/api/ingredients'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', storageMode: config.storageMode });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
