import jwt from 'jsonwebtoken'
import dotenv from '../config/env.js'
import messages from '../utilities/messages.js'

export const generateAccessToken = (data) => {
      return jwt.sign(data, dotenv.AUTH_SECRET)
}



export const validateAccessToken = async (token) => {
  try {
    const tokenInfo = await jwt.verify(token, dotenv.AUTH_SECRET)
    return tokenInfo
  } catch (e) {
    return null
  }
}

export const returnTokenError = (e) => {
  if (String(e).includes('jwt expired')) {
    return 'Token Expired'
  } else if (String(e).includes('invalid token')) {
    return messages.invalidToken
  } else if (String(e).includes('jwt malformed')) {
    return messages.invalidToken
  } else if (String(e).includes('invalid signature')) {
    return messages.invalidToken
  } else {
    // logger.error('IS_ADMIN')
    // logger.error(e)
    return messages.somethingGoneWrong
  }
}
