require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();
const supplierRouter = require("./router/supplierRouter");
require('./database/connection/connection')

server.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));
// Handle preflight requests
server.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

server.use(helmet()); 
server.use(express.json())
server.use(supplierRouter)

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection:", reason);
});

// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Optionally restart the server
});

// General error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const PORT = 7009

server.get('/',(req,res)=>{
    res.status(200).json("Sit NexHub server started - Supplier v2")
})

server.listen(PORT,()=>{
    console.log(`NexHub Sit server Supplier started at port : ${PORT}`);
})

