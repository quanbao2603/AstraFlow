import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const createStory = async (req: Request, res: Response) => {
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
};

export const getStoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const story = await prisma.story.findUnique({
      where: { id: String(id) },
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
};

export const getUserStories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const stories = await prisma.story.findMany({
      where: { authorId: String(userId) },
      orderBy: { createdAt: 'desc' },
      include: { template: true }
    });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ error: 'Failed to fetch user stories' });
  }
};
