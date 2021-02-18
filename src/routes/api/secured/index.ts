import { Request, Response, Router } from 'express'
import UserController from '@/controllers/UserController'
import aws from '../secured/routes.aws'
import * as Sentry from '@sentry/node'
import multer from 'multer'
import AWS from 'aws-sdk'
import books from '@/core/models/Books'
import userBooks from '@/core/models/UserBooks'
import User from '@/core/models/User'
import database from '@/core/models/Database'
import { OK } from '@/core/constants/api'
import { successNoJson } from '@/core/helpers/response'
const multerS3 = require('multer-s3')

AWS.config.update({
  accessKeyId: process.env.accessKeyId as string,
  secretAccessKey: process.env.secretAccessKey as string,
  region: 'eu-west-3',
  signatureVersion: 'v4',
})
const s3 = new AWS.S3()
const api = Router()


//param Multer

const cloudStorage = multerS3({
  s3: s3,
  bucket: 'my-s3-efrei',
  acl: 'public-read',
  metadata: async (req, file, callback) => {
    callback(null, { fieldname: file.fieldname })
  },

  key: async (req, file, callback) => {
    const { uuid } = req.params
    const user = await User.findOne({
        where:{id:uuid}
})
    if (user) {
      const newFileName = `${uuid}/${file.originalname}`
      callback(null, newFileName)
    }
  },
})
const upload = multer({
  storage: cloudStorage,
})

api.post('/user/avatar/:uuid', upload.single('file'), async (req, res) => {
  const{uuid} = req.params
  const user = await User.findOne({
    where:{id:uuid}
})

if(user){
  console.log('req.file:', req.file)
   user.avatar = req.file.location
   try {
     await user.save()
     return res.status(OK.status).json(successNoJson('user', user))
   } catch (err) {
    Sentry.captureException(err)
    return res.send(err)
   }
}
else{
  return res.send('user not found')
}
})

//User
api.get('/user/:uuid', UserController.getUser)
api.put('/user/:uuid', UserController.updateUser)
api.delete('/user/:uuid', UserController.deleteUser)

export default api
