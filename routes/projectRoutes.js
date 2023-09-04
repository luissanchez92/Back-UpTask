import { getProjects, newProject, getOneProject, edithProject, deleteProject, addCollaborator, deleteOneCollaborator} from '../controllers/projectControllers.js'
import checkAuth from '../middleware/checkAuth.js'
import express from 'express'

const projectRouter= express.Router()

projectRouter.get('/', checkAuth, getProjects)
projectRouter.post('/', checkAuth, newProject)
projectRouter.get('/:id', checkAuth, getOneProject)
projectRouter.put('/:id', checkAuth, edithProject)
projectRouter.delete('/:id', checkAuth, deleteProject)
projectRouter.post('/add/collaborator/:id', checkAuth, addCollaborator)
projectRouter.post('/delete/collaborator/:id', checkAuth, deleteOneCollaborator)

export default projectRouter;