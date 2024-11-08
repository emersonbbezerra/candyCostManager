import mongoose from 'mongoose';
import { HttpException } from '../../utils/HttpException';

export async function connect() {
  try {
    if (!process.env.DATABASE_URL)
      throw new HttpException(500, 'Missing DATABASE_URL');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Database connected');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpException(error.status || 500, 'Database connection error');
  }
}
