// db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.DATABASE_URL;

const connectToMongo = () => {
    mongoose.set('strictQuery', false);
    try {
        mongoose.connect(mongoURI);
        console.log("Database connected")
    } catch (error) {
            console.log("Mongoose not connect",error);
    }
};

export default connectToMongo;
