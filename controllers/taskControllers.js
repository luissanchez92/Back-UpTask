import Project from "../models/Project.js"
import Task from "../models/Task.js"

const addTask=async(req,res)=>{
    const {project}=req.body

    const existProject=  await Project.findById(project)

    if (!existProject){
        const error= new Error('Project not found')
        return res.status(404).json({error: error.message})
    }

    if (existProject.author.toString() !== req.user._id.toString()){
        const error= new Error('You can not add tasks')
        return res.status(404).json({error: error.message})
    }

    try{
        const newTaskAdd= await Task.create(req.body);
        return res.json(newTaskAdd)

    }catch(error){
        console.log(error)
    }

}

const getTask=async(req,res)=>{
    const{id}=req.params
 
    const task= await Task.findById(id).populate('project')

    if(!task){
        const error= new Error('task not found')
        return res.status(404).json({error: error.message})
    }

    if (task.project.author.toString() !== req.user._id.toString() ){
        const error= new Error('You can not get tasks')
        return res.status(403).json({error: error.message})
    }

    res.json(task)
}

const updateTask=async(req,res)=>{
    const {id}= req.params

    const task= await Task.findById(id).populate('project')

    if(!task){
        const error= new Error('task not found')
        return res.status(404).json({error: error.message})
    }
    if (task.project.author.toString() !== req.user._id.toString() ){
        const error= new Error('You can not get tasks')
        return res.status(403).json({error: error.message})
    }

    task.name= req.body.name || task.name;
    task.description= req.body.description || task.description;
    task.priority= req.body.priority || task.priority;
    task.dueDate= req.body.dueDate || task.dueDate

    try{
        const newTaskUpdate= await task.save();
        res.json(newTaskUpdate);

    }catch(error){
        console.log(error)
    }

}

const deleteTask=async(req,res)=>{
    const {id}= req.params

    const task= await Task.findById(id).populate('project')

    if(!task){
        const error= new Error('task not found')
        return res.status(404).json({error: error.message})
    }
    if (task.project.author.toString() !== req.user._id.toString() ){
        const error= new Error('You can not get tasks')
        return res.status(403).json({error: error.message})
    }
    try{
        await task.deleteOne()
        res.json({message: 'Deleted task'})

    }catch(error){
        console.log(error)
    }
}

const changeState=async(req,res)=>{
      
}

export{
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}