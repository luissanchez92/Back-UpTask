import express from 'express'
const taskRouter= express.Router();
import { addTask, getTask, updateTask, deleteTask, changeState} from '../controllers/taskControllers.js'
import checkAuth from '../middleware/checkAuth.js';

taskRouter.post('/', checkAuth, addTask);
taskRouter.get('/:id', checkAuth, getTask);
taskRouter.put('/:id',checkAuth, updateTask)
taskRouter.delete('/:id',checkAuth, deleteTask)
taskRouter.post('/state/:id',checkAuth, changeState)



export default taskRouter;