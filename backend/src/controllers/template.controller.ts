import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getTemplates = async (req: Request, res: Response) => {
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
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { title, description, prompt, category, isPublic, userId } = req.body;
    
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
};
