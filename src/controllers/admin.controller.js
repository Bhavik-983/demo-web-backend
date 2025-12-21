import { UserModel } from "../models/user.schema.js";
import bcrypt from 'bcrypt';
import constant from "../utilities/constant.js";
import dotenv from "../config/env.js"
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";
import { errorHelper } from "../helper/errorHelper.js";
import messages from "../utilities/messages.js";

/**
 * @description Create a new admin user
 * @route POST /api/admin/create
 * @access Private (Super Admin only)
 * @param {Object} res - Express response object
 * @returns {Object} Response with created admin data or error message
 */

export const createAdmin = async () => {
    try {
        const admin = await UserModel.findOne({ email: dotenv.ADMIN_EMAIL, role: constant.ROLE[0] })
        if (admin) return
        await new UserModel({
            email: dotenv.ADMIN_EMAIL,
            password: await bcrypt.hash(dotenv?.ADMIN_PASSWORD, 10),
            role: constant.ROLE[0]
        }).save()
        console.log("ADMIN_CREATED_SUCCESSFULLY");
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}


export const createUser = async (req, res) => {
    try {
        const data = req.body
        const user = await UserModel.findOne({ email: data.email })
        if (user) return sendBadRequest(res, messages.userAlreadyExist)

        await new UserModel({
            username: data?.username,
            email: data?.email,
            password: await bcrypt.hash(data?.password, 10),
            role: data?.role,
            age: data?.age
        }).save()

        return sendSuccess(res, messages.userCreatedSuccessfully)
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "CREATE_USER"))
    }
}


export const listOfUser = async (req, res) => {
    try {
        const data = req.query
        let user_data
        if (req.query.userId) {
            user_data = await UserModel.findOne({ _id: req.query.userId })
            if (user_data) return sendBadRequest(res, messages.userNotFound)
        } else {
            user_data = await UserModel.find({ role: data.role }).sort({ createdAt: -1 })
        }

        return sendSuccess(res, user_data, messages.usersGetSuccessfully)

    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "GET_USER_LIST"))
    }

}



export const updateUser = async (req, res) => {
    try {
        const data = req.body
        const user = await UserModel.findOne({ _id: req.params.userId })

        if (!user) return sendBadRequest(res, messages.userNotFound)

        if (data?.username) user.username = data.username
        if (data?.password) {
            // Password validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(data.password)) {
                return sendBadRequest(res, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character");
            }

            user.password = await bcrypt.hash(data.password, 10);
        }
        if (data?.email) {
            const is_user = await UserModel.findOne({ email: data.email })
            if (is_user) return sendBadRequest(res, messages.userAlreadyExist)
            user.email = data.email
        }
        if (data?.role) user.role = data.role
        if (data?.age) user.age = data.age

        await user.save()
        return sendSuccess(res, messages.userUpdatedSuccessfully)
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "UPDATE_USER"))
    }
}


export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.userId, role: { $ne: constant.ROLE[0] } })
        if (!user) return sendBadRequest(res, messages.userNotFound)
        await UserModel.deleteOne({ _id: req.params.userId })
        return sendSuccess(res, messages.userDeletedSuccessfully)
    } catch (e) {
        return sendBadRequest(res, errorHelper(e, "DELETE_USER"))
    }
}