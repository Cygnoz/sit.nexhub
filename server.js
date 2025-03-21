require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();
const customerRouter = require("./router/customerRouter");
require('./database/connection/connection');


server.use(express.json({ limit: '10mb' })); 
server.use(express.urlencoded({ limit: '10mb', extended: true }));

server.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

server.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

server.use(helmet());
server.use(express.json())
server.use(customerRouter)

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

const PORT = 5002

server.get('/',(req,res)=>{
    res.status(200).json("Dev Bill BIZZ server started - Customer v1.6")
})

const app = server.listen(PORT, () => {
    console.log(`BillBIZZ server Customer started at port : ${PORT}`);
});

