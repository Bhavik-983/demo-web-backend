import mongoose from "mongoose";
import constant from "../utilities/constant.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        age: {
            type: Number
        },
        role: {
            type: String,
            enum: constant.ROLE,
        }
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model("users", userSchema);
