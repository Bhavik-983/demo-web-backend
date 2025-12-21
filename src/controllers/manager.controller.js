import { errorHelper } from "../helper/errorHelper.js";
import { UserModel } from "../models/user.schema.js";
import constant from "../utilities/constant.js";
import messages from "../utilities/messages.js";
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";


export const listOfUsers = async (req, res) => {
    try {
        let user_data
        if (req.query.userId) {
            user_data = await UserModel.findOne({ _id: req.query.userId })
            if (user_data) return sendBadRequest(res, messages.userNotFound)
        } else {
            user_data = await UserModel.find({ role: constant.ROLE[2] });
        }
        return sendSuccess(res, user_data, messages.usersGetSuccessfully);
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "LIST_OF_USERS_BY_MANAGER"));
    }
}


export const updateUser = async (req, res) => {
    try {
        const data = req.body
        const user = await UserModel.findOne({ _id: req.params.userId })

        if (!user) return sendBadRequest(res, messages.userNotFound)
        if (data?.username) user.username = data.username
        if (data?.age) user.age = data.age

        await user.save()
        return sendSuccess(res, messages.userUpdatedSuccessfully)
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "UPDATE_USER_BY_MANAGER"))
    }
}