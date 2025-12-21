import fs from 'fs'

import { validationResult } from 'express-validator'
import { sendBadRequest } from '../../utilities/response/index.js'

// import logger from '../../utilities/logger.js'

export const validateField = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // Invalid Filed

      if (req.files) {
        const keys = Object.keys(req.files)
        for (const key of keys) {
          await deleteFiles(req.files[key])
        }
      }
      return sendBadRequest(res, errors.array()[0].msg, errors.array())
    }
    next()
  } catch (e) {
    // logger.error('VALIDATE_FIELD')
    // logger.error(e)
    console.log("VALIDATE_FIELD")
  }
}


