import dotenv from 'dotenv';
dotenv.config();
interface AppConfig {
  DB: string;
  REQUEST_TIMEOUT: number;
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  SMTP_HOST?: string; // Optional property
  SMTP_USER?: string; // Optional property
  SMTP_PASS?: string; // Optional property
  SMTP_PORT: number;
  ORIGIN?: string; // Optional property
}

const config: AppConfig = {
  DB: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB}?retryWrites=true&w=majority`,
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '5000', 10),
  PORT: parseInt(process.env.PORT || '5000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'guujkyl98iyghjfytj',
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || 'guujkyl98iyghjfytjr32r',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  ORIGIN: process.env.ORIGIN,
};

export default config;
