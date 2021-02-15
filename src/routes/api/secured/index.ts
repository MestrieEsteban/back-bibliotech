import { Router } from 'express'
import UserController from '@/controllers/UserController'

const api = Router()

//User
api.get('/user/:uuid', UserController.getUser)
api.put('/user/:uuid', UserController.updateUser)
api.delete('/user/:uuid', UserController.deleteUser)

export default api
