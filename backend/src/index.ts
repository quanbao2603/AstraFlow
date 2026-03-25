import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// const connectionString = process.env.DATABASE_URL!;
// const pool = new Pool({ 
//   connectionString,
//   ssl: connectionString.includes('sslmode=require') ? true : undefined
// });
import { join } from 'path';

const adapter = new PrismaBetterSqlite3({ url: join(process.cwd(), 'dev.db') });
const prisma = new PrismaClient({ adapter: adapter as any });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock User Registration (for testing)
app.post('/api/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const newUser = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    console.dir(error, { depth: null });
    res.status(500).json({ error: 'Failed to create user' });
  }
});

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

// Create a new story
app.post('/api/stories', async (req, res) => {
  try {
    const { title, content, templateId, userId } = req.body;
    
    const newStory = await prisma.story.create({
      data: {
        title,
        content,
        templateId,
        authorId: userId
      }
    });
    
    res.status(201).json(newStory);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Get story by ID
app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const story = await prisma.story.findUnique({
      where: { id },
      include: { template: true }
    });
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Get user's stories
app.get('/api/stories/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await prisma.story.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: { template: true }
    });
    
    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ error: 'Failed to fetch user stories' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
