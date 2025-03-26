require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { spawn } = require('child_process');

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

const startServer = () => {
    const server = express();
    const purchaseRouter = require("./router/purchaseRouter");
    require('./database/connection/connection');

    server.use(express.json({ limit: '10mb' })); 
    server.use(express.urlencoded({ limit: '10mb', extended: true }));

    server.use(cors({
        origin: function (origin, callback) {
            if (!origin || process.env.ALLOWED_ORIGINS === "*") {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed from this origin"));
            }
        },
        methods: "GET, POST, PUT, DELETE, OPTIONS",
        allowedHeaders: "Content-Type, Authorization"
    }));

    server.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    res.sendStatus(200);
    });

    server.use(helmet()); 
    server.use(purchaseRouter);

    // Catch unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Promise Rejection:", reason);
    });

    // Catch uncaught exceptions
    process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
        console.log("Restarting server in 6 seconds...");
        setTimeout(() => {
            restartServer();
        }, 6000);
    });

    // General error handling middleware
    server.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    });

    const PORT = 7005;

    server.get('/', (req, res) => {
        res.status(200).json("Sit NexHub server started - Purchase v2");
    });

    server.listen(PORT, () => {
        console.log(`NexHub Sit server Purchase started at port : ${PORT}`);
    });
};

// Function to restart the server
const restartServer = () => {
    console.log("Restarting server...");
    spawn(process.argv[0], process.argv.slice(1), {
        stdio: 'inherit',
        detached: true
    });
    process.exit(1);
};

// Start the server initially
startServer();
