import  jwt  from 'jsonwebtoken';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {authRoutes} from './routes/index';
import { errorHandler } from '@amdevcorp/ticketing-common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const MONGO_URL = "mongodb://tickets-mongo-srv:27017/users";

const app = express();
app.set('trust proxy', true); //Make sure express is behind ingress-nginx and thus allows the flow
app.use(json());
app.use( cookieSession({ signed: false, httpOnly: true, }) );


app.get('/api/users/currentUser' ,( req , res ) => {
    if( !req.session?.jwt ){
        res.status(200).json({currentUser : null});
    }
    try{
        const decodedToken = jwt.verify( req.session?.jwt , process.env.JWT_KEY!  )
        res.status(200).json({currentUser : decodedToken});
    }catch{
        res.status(200).json({currentUser : null});
    }  
});
app.use('/api/users/auth' ,authRoutes);

app.use(errorHandler);

const bootStrap = async() => {

    if(!process.env.JWT_KEY){
        throw new Error("ENV Variables not confifugred!!");   
    }
    try{
        await mongoose.connect( MONGO_URL , {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log("Connected to db");
        app.listen( 3000 , ()=> console.log('App listening on 3000!!!!'));
    }
    catch(err){
        console.log("Error connecting to mongo", err);
    }
}

bootStrap();