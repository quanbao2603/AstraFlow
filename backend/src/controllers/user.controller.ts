import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const createUser = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: 'Failed to create user' });
  }
};
