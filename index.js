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
const whiteList=[process.env.FRONT_URL_I];

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

const serverExpress=app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})


//socket.Io
import { Server, Socket } from "socket.io";

const io= new Server(serverExpress, {
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONT_URL_I
    }
})

io.on('connection', (Socket)=>{
    console.log('connect a socket.io')
    // definir eventos
    Socket.on('open project',(project)=>{
        Socket.join(project)
    })

    Socket.on('newTask', (data)=>{
        const project=data.project

        if (typeof project==='string'){
            Socket.on(project).emit('addedTask', task)
        }else if(typeof project==='object'){
            Socket.on(project._id).emit('addedTask', task)
        }
    })


    Socket.on('deleteTask', (task)=>{
        const projectValue = task.project

        if (typeof projectValue === 'string') {
            Socket.to(projectValue).emit('taskDeleted', task)
        } else if (typeof projectValue === 'object') {
            Socket.to(projectValue._id).emit('taskDeleted', task)
        }
    })


})