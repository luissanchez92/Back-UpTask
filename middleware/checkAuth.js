import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const checkAuth= async(req, res, next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1]
            
            const decoded=jwt.verify(token, process.env.JWT);

            req.user= await User.findById(decoded.id).select('-password -createdAt -updatedAt -__v -token')
            return next()

        }catch(error){
            return res.status(404).json({message: 'there is a new Error'})

        }
    }
    if (!token){
        const error= new Error('invalidate token')
        return res.status(401).json({message: error.message})
    }
    next();

}

export default checkAuth