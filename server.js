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

const PORT = 7009

server.get('/',(req,res)=>{
    res.status(200).json("Sit NexHub server started - Supplier v1")
})

server.listen(PORT,()=>{
    console.log(`Sit NexHub server Supplier started at port : ${PORT}`);
})

