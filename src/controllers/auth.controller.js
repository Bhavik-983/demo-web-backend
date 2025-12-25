import { generateAccessToken } from "../helper/accessTokenHelper.js";
import { errorHelper } from "../helper/errorHelper.js";
import { UserModel } from "../models/user.schema.js";
import messages from "../utilities/messages.js";
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";
import bcrypt from 'bcrypt';

export const Login = async (req, res) => {
    try {
        const data = req.body
        const user = await UserModel.findOne({ email: data.email })
        if (!user) return sendBadRequest(res, messages.userNotFound)


        const is_valid_password = await bcrypt.compare(data.password, user.password)
        if (!is_valid_password) return sendBadRequest(res, messages.invalidPassword)


        const access_token = generateAccessToken({ _id: user._id })

        return sendSuccess(res, { access_token, role: user.role }, messages.loginSuccessfully)


    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "LOGIN"))
    }

};


export const getProfile = async (req, res) => {
    try {
        return sendSuccess(res, req.user, messages.profileGetSuccessfully)
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "GET_PROFILE"))
    }
}


export const updateProfile = async (req, res) => {
    try {
        const data = req.body

        if(data.username) req.user.username = data.username
        if(data.email) {
            const is_user = await UserModel.findOne({email:data.email})
            if(is_user) return sendBadRequest(res,messages.userAlreadyExist)
            req.user.email = data.email
        }
        if(data.age) req.user.age = data.age
        await req.user.save()
        return sendSuccess(res,messages.profileUpdated)
       
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "UPDATE_PROFILE"))
    }
}


