import jwt from 'jsonwebtoken'

const generateJWT=(id)=>{
    return jwt.sign({id}, process.env.JWT,{
        expiresIn: "30d",

    })
}

export default generateJWT