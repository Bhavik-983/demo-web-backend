import {
  sendBadRequest,
  sendBadRequestWith401Code,
  sendBadRequestWith403Code,
  sendBadRequestWith406Code,
  sendBadRequestWith500Code,
} from "../../utilities/response/index.js";
import messages from "../../utilities/messages.js";
import {
  returnTokenError,
  validateAccessToken,
} from "../../helper/accessTokenHelper.js";
import { UserModel } from "../../models/user.schema.js";

export const isAuth = async (req, res, next) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization;

    // if token find then verify
    if (!bearerToken)
      return sendBadRequestWith406Code(res, messages.authTokenRequired);
    const tokenInfo = await validateAccessToken(
      String(bearerToken).split(" ")[1]
    );

    if (!tokenInfo)
      return sendBadRequestWith401Code(res, messages.unauthorized);

    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo._id)
      return sendBadRequestWith406Code(res, messages.tokenFormatInvalid);

    const userDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
      {
        _id: 1,
        role: 1,
        username: 1,
        email:1,
        age:1,
        createdAt:1,
      }
    );
    
    if (!userDetails)
      return sendBadRequestWith406Code(res, messages.userNotFound);

    // Attach Admin Info
    req.user = userDetails;
    
    // next for using this method only
    next();
  } catch (e) {
    const error = await returnTokenError(e, "IS_AUTH");
    if (error !== messages.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error);
    } else {
      return sendBadRequest(res, error);
    }
  }
};

export function verifyPermission(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return sendBadRequestWith403Code(res,messages.accessDenied)
    }
    next();
  };
}



