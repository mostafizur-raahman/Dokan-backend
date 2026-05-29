import express from "express";
import router from "./modules/user/user.routes.js";
import cookieParser from "cookie-parser";
import connect from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import logger from "./config/logger.js";
import errorHandler from "./middleware/errorHandler.js";

// database connection
connect();
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//logger
app.use(morgan("combined", { stream: logger.stream }));

//rouitng middleware
app.use("/v1/users", router);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status: "fail",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler);

export default app;
