import User from '../models/User.js'
import generateID from '../helpers/generateID.js'
import generateJWT from '../helpers/generateJWT.js'
import {emailRegister, emailForgetPassword} from '../helpers/email.js'

const createUser= async (req, res)=>{
    const {email}=req.body
    const existUser=await User.findOne({email})
    if (existUser){
        const error= new Error('Email ya registrado')
        return res.status(400).json({message: error.message})
    }
    
    try{
        const user= new User(req.body)
        user.token= generateID()
        await user.save()
        emailRegister({
            email: user.email,
            name: user.name,
            token: user.token
        })

        res.json({message: 'Usuario creado correctamente. Para confirmar la cuenta, revisa tu correo.'})
    }catch(error){
        console.log(error)

    }
}

const confirm=async(req, res)=>{
    const {token}= req.params
    try{
        const userConfirm= await User.findOne({token})
        if (!userConfirm){
            const error= new Error('token invalido')
            return res.status(400).json({message: error.message})

        }
        userConfirm.confirm=true;
        userConfirm.token='';
        await userConfirm.save();
        res.json({message: 'Usuario confirmado correctamente'})
        
    }catch(error){
        console.log(error)
    }
}

const authUser= async(req, res)=>{
    const {email, password}=req.body
    try{
        const user= await User.findOne({email})
        if (!user){
            const error= new Error('El usuario no existe')
            return res.status(404).json({message: error.message})
        }

        if (!user.confirm){
            const error= new Error('El usuario nno ha confirnado la cuenta, revise su correo')
            return res.status(404).json({message: error.message})
        }

        if( await user.verifyPassword(password)){
            res.json({
                _id: user._id,
                name:user.name,
                email: user.email,
                token: generateJWT(user._id)
            })
        }else{
            const error= new Error('Password is incorrect')
            return res.status(403).json({message: error.message})
        }
        
    }catch(error){
        console.log(error)


    }
}



const forgetPassword=async(req, res)=>{
    const {email}=req.body
    try{
        const user= await User.findOne({email})
        if (!user){
            const error= new Error('El usuario no existe')
            return res.status(404).json({message: error.message})
        }
        user.token=generateID()
        await user.save()

        //send mail
        emailForgetPassword({
            email: user.email,
            name: user.name,
            token: user.token
        })

        res.json({message: 'Se ha enviado un correo con las instrucciones'})

    }catch(error){
        console.log(error)
    }
}

const verifyToken=async(req, res)=>{
    const {token}=req.params
    try{
        const validateToken= await User.findOne({token})
        if(validateToken){
            res.json({message:'Token válido'})
        }else{
            const error= new Error('Token invalido')
            return res.status(404).json({message: error.message})
        }

    }catch(error){
        console.log(error)
    }
}

const newPassword=async(req, res)=>{
    const {token}= req.params
    const {password}= req.body
    try{
        const user= await User.findOne({token})
        if(user){
            user.password= password;
            user.token=''
            await user.save()
            res.json({message: 'Clave modificada correctamente'})
            
        }else{
            const error= new Error('Invalid token')
            return res.status(404).json({message: error.message})
        }

    }catch(error){
        console.log(error)
    }
}

const profile=async(req,res)=>{
   
    const {user}=req
    res.json(user)
}


export{
    createUser,
    authUser,
    confirm,
    forgetPassword,
    verifyToken,
    newPassword,
    profile
}