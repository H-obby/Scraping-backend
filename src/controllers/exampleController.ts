import { Request, Response } from 'express';

export const getItems = (req: Request, res: Response) => {
  // Example data
  
  res.status(200).json('I see trees of greeeeeeeeeeeeeen');
};

export const createItem = (req: Request, res: Response) => {
  const newItem = req.body;
  // Here you would typically save to a database
  
  res.status(201).json({ 
    message: 'Item created successfully', 
    item: newItem 
  });
};
