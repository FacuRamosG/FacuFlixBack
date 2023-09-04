import express from 'express'
import { body } from 'express-validator'
import tokenMiddleware from '../middlewares/token.middleware.js'
import requestHandler from '../handlers/request.handler.js'
import reviewController from '../controllers/review.controller.js'

const router = express.Router({ mergeParams: true })

router.get(
  '/',
  tokenMiddleware.auth,
  reviewController.getReviewOfUser
)

router.post(
  '/',
  tokenMiddleware.auth,
  body('mediaId')
    .exists().withMessage('mediaId is required')
    .isLength({ min: 1 })
    .withMessage('mediaId is required'),
  body('content')
    .exists().withMessage('content is required')
    .isLength({ min: 3 })
    .withMessage('The review have less of 3 letters'),
  body('mediaType')
    .exists().withMessage('mediaType is required')
    .custom(type => ['movie', 'tv'].includes(type)).withMessage('mediaType invalid'),
  body('mediaTitle')
    .exists().withMessage('mediaTitle is required'),
  body('mediaPoster')
    .exists().withMessage('mediaPoster is required'),
  requestHandler.validate,
  reviewController.create

)

router.delete(
  '/:reviewId',
  tokenMiddleware.auth,
  reviewController.remove
)

export default router
