import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const db = async(): Promise<typeof mongoose.connection> => {
  try {
    if(!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined! Please check your environment variables.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Mongo Database Successfully.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export default db;
