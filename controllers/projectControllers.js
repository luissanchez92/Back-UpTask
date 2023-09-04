import Project from '../models/Project.js'
import Task from '../models/Task.js'

const getProjects=async(req,res)=>{
    const projects= await Project.find().where('author').equals(req.user)

    res.json(projects)

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
    const {id}= req.params
    const project= await Project.findById(id)

    if(!project){
        const error= new Error('Project not found')
        return res.status(404).json({message: error.message})
    }

    if (project.author.toString() !== req.user._id.toString()){
        const error= new Error('You are not accredited')
        return res.status(401).json({message: error.message})
    }

    const tasks= await Task.find().where('project').equals(project._id)

    res.json({
        project,
        tasks
    })
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

const addCollaborator=async(req,res)=>{

}

const deleteOneCollaborator=async(req,res)=>{

}


export{
    getProjects,
    newProject,
    getOneProject,
    edithProject,
    deleteProject,
    addCollaborator,
    deleteOneCollaborator
}