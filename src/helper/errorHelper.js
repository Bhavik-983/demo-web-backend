import messages from '../utilities/messages.js'
// import logger from '../utilities/logger.js'

export const errorHelper = (e, functionName) => {
  // logger.error(functionName)
  // logger.error(e)
  console.log(e)
  console.log(functionName)
  return messages.somethingGoneWrong
}


