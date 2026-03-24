import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/index.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all public templates
app.get('/api/story-templates', async (req, res) => {
  try {
    const templates = await prisma.storyTemplate.findMany({
      where: { isPublic: { equals: true } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(templates);
  } catch (error) {
    console.error('Error fetching story templates:', error);
    res.status(500).json({ error: 'Failed to fetch story templates' });
  }
});

// Create a new template
app.post('/api/story-templates', async (req, res) => {
  try {
    const { title, description, prompt, category, isPublic, userId } = req.body;
    
    // In a real app, userId should come from auth token, but for now we'll allow passing it
    const newTemplate = await prisma.storyTemplate.create({
      data: {
        title,
        description,
        prompt,
        category,
        isPublic: isPublic ?? false,
        userId
      }
    });
    
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating story template:', error);
    res.status(500).json({ error: 'Failed to create story template' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
