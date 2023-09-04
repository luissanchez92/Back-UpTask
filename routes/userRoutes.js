import express from 'express'
import {createUser, authUser, confirm, forgetPassword, verifyToken, newPassword, profile} from '../controllers/userControllers.js'
import checkAuth from '../middleware/checkAuth.js';
const userRouter= express.Router();


userRouter.post('/', createUser)
userRouter.post('/login', authUser)
userRouter.get('/confirm/:token', confirm )
userRouter.post('/forget-password', forgetPassword )
userRouter.get('/forget-password/:token', verifyToken)
userRouter.post('/forget-password/:token', newPassword)
userRouter.get('/profile', checkAuth, profile)


export default userRouter; 