import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 8001,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-this",
    NODE_ENV: process.env.NODE_ENV || "development",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
};

export default config;
