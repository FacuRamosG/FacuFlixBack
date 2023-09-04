import responseHandler from '../handlers/response.handler.js'
import ReviewModel from '../models/Review.model.js'

const create = async (req, res) => {
  try {
    const { movieId } = req.params

    const review = new ReviewModel({
      user: req.user.id,
      movieId,
      ...req.body
    })

    await review.save()
    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    })
  } catch {
    responseHandler.error(res)
  }
}

const remove = async (res, req) => {
  try {
    const { reviewId } = req.req.params

    await ReviewModel.findOneAndRemove({
      _id: reviewId,
      user: req.req.user.id
    })
    // if (!review) return responseHandler.notfound(res)

    // await review.remove()
    responseHandler.ok(res.res)
  } catch {
    responseHandler.error(res)
  }
}

const getReviewOfUser = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({
      user: req.user.id
    }).sort('-createdAt')

    responseHandler.ok(res, reviews)
  } catch {
    responseHandler.error(res)
  }
}

export default { create, remove, getReviewOfUser }
