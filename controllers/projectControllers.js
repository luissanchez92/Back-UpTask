import Project from '../models/Project.js'
import Task from '../models/Task.js'
import User from '../models/User.js'

const getProjects=async(req,res)=>{
    try{
        const projects= await Project.find({
            $or: [
            { collaborators: { $in: [req.user] } },
            { author: { $in: [req.user] } },
        ]})
        //.select('name tasks')
        res.json(projects)
        

    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Hubo un error en el servidor.' });
    }

}

const newProject=async(req,res)=>{
    const project= new Project(req.body)
    project.author= req.user._id

    try{
        const saveProject= await project.save()
        res.json(saveProject);

    }catch(error){
        console.log(error)

    }

}

const getOneProject=async(req,res)=>{
    try{
        const {id}= req.params

        //obtener proyectos con las tareas[]/la tarea con su complete y tambien los colaboradores
        const project= await Project.findById(id)
            .populate({path: 'tasks', populate: {path: 'complete', select: 'name email'}})
            .populate('collaborators', 'name email')
    
        if(!project){
            const error= new Error('Proyecto no existe')
            return res.status(404).json({message: error.message})
        }
    
        //para monstrar el proyecto. validar que sea autor o colaborador
        if(project.author.toString() !== req.user._id.toString() && !project.collaborators.some(collaborator=>collaborator._id.toString() === req.user._id.toString())){
            const error= new Error('No tienes permiso para acceder al proyecto')
            return res.status(401).json({message: error.message})
        }
    
        res.json(
            project
        )

    }catch(error){
        console.log(error)
        return res.status(404).json({message: error.message})
    }

}

const edithProject=async(req,res)=>{
    const {id}=req.params

    const project= await Project.findById(id)

    if(!project){
        const error= new Error('Project not found')
        return res.status(404).json({message: error.message})
    }

    if (project.author.toString() !== req.user._id.toString()){
        const error= new Error('You are not accredited')
        return res.status(401).json({message: error.message})
    }

    project.name= req.body.name || project.name
    project.description= req.body.description || project.description
    project.duaDate= req.body.duaDate || project.duaDate
    project.client= req.body.client || project.client

    try{
        const projectEdited= await project.save();
        res.json(projectEdited)

    }catch(error){
        console.log(error)
    }
}

const deleteProject=async(req,res)=>{
    try{
        const {id}=req.params

        const project= await Project.findById(id)
    
        if(!project){
            const error= new Error('Project not found')
            return res.status(404).json({message: error.message})
        }
    
        if (project.author.toString() !== req.user._id.toString()){
            const error= new Error('You are not accredited')
            return res.status(401).json({message: error.message})
        }

        await project.deleteOne()
        res.json({message: 'Deleted project'})

    }catch(error){
        console.log(error)
    }

}
const findCollaborator=async(req,res)=>{
    try{
        const {email}=req.body

        const user= await User.findOne({email}).select('-password -confirm -createdAt -updatedAt -__v -token')
        
        if (!user){
            const error= new Error('Usuario no encontrado')
            return res.status(404).json({message: error.message})
        }

        res.json(user)


    }catch(error){
        console.log(error)
    }

}

const addCollaborator=async(req,res)=>{
    const {email}= req.body
    const project=await Project.findById(req.params.id)

    if (!project){
        const error= new Error('Proyecto no encontrado')
        return res.status(404).json({message: error.message})
    }

    if (project.author.toString() !== req.user._id.toString()){
        const error= new Error('No puedes agregar colaboradores')
        return res.status(404).json({message: error.message})
    }

    const findUser= await User.findOne({email}).select('-password -confirm -createdAt -updatedAt -__v -token')

    if (!findUser){
        const error= new Error('Usuario no encontrado')
        return res.status(404).json({message: error.message})
    }

    //colaborador no sea el creador

    if (project.author.toString() ===findUser._id.toString()){
        const error= new Error('El autor del proyecto no puede ser colaborador')
        return res.status(404).json({message: error.message});
    }

    //validar que ya no este el colaborador agregado al project
    if (project.collaborators.includes(findUser._id)){
        const error= new Error('Colaborador agregado anteriormente')
        return res.status(404).json({message: error.message});

    }

    //agregar
    project.collaborators.push(findUser._id)
    await project.save()
    res.json({message: 'Colaborador agregado correctamente'})

}


const deleteOneCollaborator=async(req,res)=>{
    try{
        const {id}= req.body
       
        const project=await Project.findById(req.params.id)

        if (!project){
            const error= new Error('Proyecto no encontrado')
            return res.status(404).json({message: error.message})
        }

        if (project.author.toString() !== req.user._id.toString()){
            const error= new Error('No puedes eliminar un colaborador')
            return res.status(404).json({message: error.message})
        }

         //eliminar
        project.collaborators.pull(id)
        await project.save()
        res.json({message: 'Colaborador eliminado correctamente'})



    }catch(error){
        console.log(error)
    }

}


export{
    getProjects,
    newProject,
    getOneProject,
    edithProject,
    deleteProject,
    findCollaborator,
    addCollaborator,
    deleteOneCollaborator
}