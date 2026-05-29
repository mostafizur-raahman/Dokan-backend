import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 8001,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key-change-this",
    NODE_ENV: process.env.NODE_ENV || "development",
};

// // Debug: Log which values are being used (remove in production)
// console.log("Config loaded:");
// console.log("- PORT:", config.PORT);
// console.log("- DATABASE_URL:", config.DATABASE_URL ? "✅ Set" : "❌ Missing");
// console.log("- JWT_SECRET:", config.JWT_SECRET ? "✅ Set" : "❌ Missing");

export default config;
