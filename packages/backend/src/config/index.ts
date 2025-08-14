import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN 
    ? (process.env.CORS_ORIGIN.includes(',') 
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : [process.env.CORS_ORIGIN.trim()])
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5175', 'https://decentralized-frontend.vercel.app'],
  
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '10000'),
  
  logLevel: process.env.LOG_LEVEL || 'combined',
} as const;

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production'; 