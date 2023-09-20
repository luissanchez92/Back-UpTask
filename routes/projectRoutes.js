import { getProjects, newProject, getOneProject, edithProject, deleteProject, findCollaborator, addCollaborator, deleteOneCollaborator} from '../controllers/projectControllers.js'
import checkAuth from '../middleware/checkAuth.js'
import express from 'express'

const projectRouter= express.Router()

projectRouter.get('/', checkAuth, getProjects)
projectRouter.post('/', checkAuth, newProject)
projectRouter.get('/:id', checkAuth, getOneProject)
projectRouter.put('/:id', checkAuth, edithProject)
projectRouter.delete('/:id', checkAuth, deleteProject)
projectRouter.post('/collaborator', checkAuth, findCollaborator)
projectRouter.post('/collaborator/:id', checkAuth, addCollaborator)
projectRouter.post('/collaborator/delete/:id', checkAuth, deleteOneCollaborator)

export default projectRouter;