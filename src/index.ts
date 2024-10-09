import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Login failed!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

app.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser  = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already exists!' });
    } else {
      const user = await prisma.user.create({ data: { email, password } });
      res.json({ success: true, message: 'Account created successfully!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating account' });
  }
});

app.listen(3000, () => {
  console.log('REST API server ready at: http://localhost:3000');
});