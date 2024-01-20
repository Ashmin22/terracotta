import express from 'express';
import connectDb from './db_conn.js';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { google } from "googleapis";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


import axios from 'axios';
const mockReq = {};
const mockRes = { send: (data) => console.log(data) };

import jsonwebtoken from 'jsonwebtoken';

const app = express();


app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const secretKey = "secretKey";

app.use(express.json());

connectDb();

app.use('/api/users', usersRoutes);

app.use('/uploads', express.static('uploads'));



app.listen(4000, () => {
    console.log("server running successfully");
})
