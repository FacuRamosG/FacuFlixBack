import mongoose from 'mongoose'
import ModelOptions from './Model.options.js'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  }
}, ModelOptions)

userSchema.methods.setPassword = function (password) {
  this.password = password
  this.salt = 2561

  // this.password = crypto.pbkdf2Sync(
  //   password,
  //   this.salt,
  //   1000,
  //   64,
  //   'sha512'
  // ).toString('hex')
}

userSchema.methods.validPassword = function (password) {
  return this.password === password
}

const UserModel = mongoose.model('User', userSchema)

export default UserModel
