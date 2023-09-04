import express from 'express'
import { body } from 'express-validator'
import favoriteController from '../controllers/favorite.controller.js'
import userController from '../controllers/user.controller.js'
import requestHandler from '../handlers/request.handler.js'
import UserModel from '../models/User.model.js'
import tokenMiddleware from '../middlewares/token.middleware.js'

const router = express.Router()

router.post(
  '/signup',
  body('username')
    .exists().withMessage('username is required')
    .isLength({ min: 8 })
    .withMessage('username minimun 8 characteres')
    .custom(async value => {
      const user = await UserModel.findOne({ username: value })
      if (user) return Promise.reject(new Error('username alredy used'))
    }),
  body('password')
    .exists().withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password minimun 8 characters'),
  body('confirmPassword')
    .exists().withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password minimun 8 characters')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('The passwords not match')
      return true
    }),
  body('displayName').isLength({ min: 8 }).withMessage('DisplayName minimun 8 characters'),
  requestHandler.validate,
  userController.signup

)

router.post(
  '/signin',
  body('username')
    .exists().withMessage('username is required')
    .isLength({ min: 8 })
    .withMessage('username minimun 8 characters'),
  body('password')
    .exists().withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password minimun 8 characters'),
  requestHandler.validate,
  userController.signin

)

router.put(
  'update-password',
  tokenMiddleware.auth,
  body('password')
    .exists().withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password minimun 8 characters'),
  body('newPassword')
    .exists().withMessage('newPassword is required')
    .isLength({ min: 8 })
    .withMessage('newPassword minimun 8 characters'),
  body('ConfirnPassword')
    .exists().withMessage('ConfirnPassword is required')
    .isLength({ min: 8 })
    .withMessage('ConfirnPassword minimun 8 characters')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('The passwords not match')
      return true
    }),
  requestHandler.validate,
  userController.updatePassword

)

router.get(
  '/info',
  tokenMiddleware.auth,
  userController.getInfo
)

router.get(
  '/favorites',
  tokenMiddleware.auth,
  favoriteController.getFavoriteOfUser
)

router.post(
  '/favorites',
  tokenMiddleware.auth,
  body('mediaType')
    .exists().withMessage('mediaType is required')
    .custom(type => ['movie', 'tv'].includes(type))
    .withMessage('mediaType invalid'),
  body('mediaId')
    .exists().withMessage('mediaId is required')
    .isLength({ min: 1 })
    .withMessage('mediaId can not be empty'),
  body('mediaTitle')
    .exists().withMessage('mediaTitle is required'),
  body('mediaPoster')
    .exists().withMessage('mediaPoster is required'),
  body('mediaRate')
    .exists().withMessage('mediaRate is required'),
  requestHandler.validate,
  favoriteController.addFavorite

)

router.delete(
  '/favorites/:favoriteId',
  tokenMiddleware.auth,
  favoriteController.removeFavorite
)

export default router
