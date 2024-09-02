import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoute);

mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to DB")
    app.listen(5000, () => {
        console.log('server running on port 5000...')
    });
    
}).catch((err) => {
    console.log('cannot connect to DB');
});