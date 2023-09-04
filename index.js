//const express=require('express')
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRouter.js';
import projectRouter from './routes/projectRoutes.js';

//accept Json
const app=express();
app.use(express.json())

//accept environment variables
dotenv.config()


connectDB()
//config cors
const whiteList=[process.env.FRONT_URL_I, process.env.FRONT_URL_L];

const corsOptions={
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            //consult api
            callback(null, true)
        }else{
            //not consult req
            callback(new Error('Error of Cors'))
        }
    }
}

app.use(cors(corsOptions))

//routing
app.use('/api/user', userRouter)
app.use('/api/project', projectRouter)
app.use('/api/task', taskRouter)

const PORT= process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})
