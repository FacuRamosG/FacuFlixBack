import UserModel from '../models/User.model.js'
import jsonwebtoken from 'jsonwebtoken'
import responseHandler from '../handlers/response.handler.js'

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body

    const checkUser = await UserModel.findOne({ username })

    if (checkUser) return responseHandler.badresquest(res, 'this username alredy exist')

    const user = new UserModel()

    user.displayName = displayName
    user.username = username
    user.setPassword(password)

    await user.save()

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    )

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    })
  } catch {
    responseHandler.error(res)
  }
}

const signin = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await UserModel.findOne({ username }).select('username password salt id displayName')

    if (!user) return responseHandler.badresquest(res, 'User or password are wrong')

    if (!user.validPassword(password)) return responseHandler.badresquest(res, 'User or password are wrong')

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    )
    user.password = undefined
    user.salt = undefined

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    })
  } catch {
    responseHandler.error(res)
  }
}

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body
    const user = await UserModel.findById(req.user.id).select('password id salt')

    if (!user) return responseHandler.unauthorize(res)
    if (!user.validPassword(password)) return responseHandler.badresquest(res, 'Wrong password')

    user.setPassword(newPassword)

    await user.save()

    responseHandler.ok(res)
  } catch {
    responseHandler.error(res)
  }
}

const getInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)

    if (!user) return responseHandler.notfound(res)

    responseHandler.ok(res, user)
  } catch {
    responseHandler.error(res)
  }
}

export default {
  signup,
  signin,
  getInfo,
  updatePassword
}
