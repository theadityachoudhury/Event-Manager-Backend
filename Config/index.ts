import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration interface for application settings.
 */
interface AppConfig {
  DB: string;
  REQUEST_TIMEOUT: number;
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  SMTP_HOST?: string; // Optional property for SMTP host
  SMTP_USER?: string; // Optional property for SMTP username
  SMTP_PASS?: string; // Optional property for SMTP password
  SMTP_PORT: number;
  ORIGIN?: string; // Optional property for API origin
  accessKeyId?: any; // Optional property for AWS access key ID
  secretAccessKey?: any; // Optional property for AWS secret access key
  RZRPAY_ID: string;
  RZRPAY_SECRET: string;
}

/**
 * Application configuration object with default values loaded from environment variables.
 */
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
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  RZRPAY_ID: process.env.RZRPAY_ID || "",
  RZRPAY_SECRET: process.env.RZRPAY_SECRET || ""
};

export default config;
