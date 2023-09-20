import Project from "../models/Project.js"
import Task from "../models/Task.js"

const addTask=async(req,res)=>{
    const {project}=req.body

    const existProject=  await Project.findById(project)

    if (!existProject){
        const error= new Error('Proyecto no encontrado')
        return res.status(404).json({error: error.message})
    }

    if (existProject.author.toString() !== req.user._id.toString()){
        const error= new Error('Solo el autor puede crear tareas')
        return res.status(404).json({error: error.message})
    }

    try{
        //TODO ?
        const newTaskAdd= await Task.create(req.body);
        //add id de project
        existProject.tasks?.push(newTaskAdd._id)
        await existProject.save();
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

    try{
        const {id}= req.params

        const task= await Task.findById(id).populate('project')
    
        if(!task){
            const error= new Error('No existe la Tarea')
            return res.status(404).json({error: error.message})
        }
        if (task.project.author.toString() !== req.user._id.toString() ){
            const error= new Error('You can not get tasks')
            return res.status(403).json({error: error.message})
        }

        const project= await Project.findById(task.project)
        project.tasks.pull(task._id)
        
        //esperar que se cumplan las 2 promesas juntas
        await Promise.all([await project.save(), await task.deleteOne()])
        res.json({message: 'La tarea fue eliminada'})

    }catch(error){
        console.log(error)
    }
}

const changeState=async(req,res)=>{
    try{
        const {id}= req.params

        const task= await Task.findById(id).populate('project')
    
        if(!task){
            const error= new Error('No existe la Tarea')
            return res.status(404).json({error: error.message})
        }

        //permitir que el autor y un colaborador puedan cambiar el estado
        if(task.project.author.toString() !== req.user._id.toString() && !task.project.collaborators.some(collaborator=>collaborator._id.toString() === req.user._id.toString())){
            const error= new Error('Accion no valida')
            return res.status(401).json({message: error.message})
        }

        task.state = !task.state
        task.complete= req.user._id
        await task.save()

        const taskSave= await Task.findById(id)
            .populate('project')
            .populate('complete')
        res.json(taskSave)

    
    }catch(error){
        console.log(error)

    }
    
      
}

export{
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}