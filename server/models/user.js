import mongoose from 'mongoose'
// import _debug from 'debug'
import hash from '../utils/hash'
import salt from '../utils/salt'
import { bearer_expires } from '../config'

// const debug = _debug('koa:models:user')

const schema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  updated: {
    type: Number
  },
  created: {
    type: Number
  },
  token: {
    type: String,
    index: true,
    unique: true
  },
  expires: {
    type: Number
  },
  state: {
    type: Number,
    // 0: disabled, 1: enabled
    default: 1
  }
})

// document middleware
schema.pre('save', function (next) {
  if (!this.salt) {
    this.salt = salt()
  }

  if (!this.token) {
    this.token = this.salt
  }

  // hash password
  this.password = hash(this.password, this.salt)

  if (!this.created) {
    this.created = Date.now()
  }

  if (!this.updated) {
    this.updated = this.created
  }

  if (!this.expires) {
    this.expires = Date.now() + bearer_expires
  }

  next()
})

// query middleware
schema.pre('update', update)
schema.pre('findOneAndUpdate', update)
schema.pre('findByIdAndUpdate', update)

function update () {
  const $set = this.getUpdate()
  const { password } = $set

  if (password) {
    $set.salt = salt()
    $set.password = hash(password, $set.salt)
  }

  $set.updated = Date.now()

  this.update({}, { $set })
}

export default mongoose.model('User', schema)
