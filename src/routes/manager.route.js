import express from "express";
import { check, param } from "express-validator";
import { validateField } from "../middleware/field_validator/index.js";
import messages from "../utilities/messages.js";
import constant from "../utilities/constant.js";
import { isAuth, verifyPermission } from "../middleware/auth_validator/auth_validator.js";
import { listOfUsers, updateUser } from "../controllers/manager.controller.js";
const router = express.Router();


router.get("/user-list",
    isAuth, verifyPermission(constant.ROLE[1]),
    validateField,
    listOfUsers)


router.put('/update-user/:userId',isAuth, verifyPermission(constant.ROLE[1]) ,param("userId")
    .exists()
    .withMessage(messages.userIdIsRequired)
    .notEmpty()
    .withMessage(messages.userIdCannotBeEmpty)
    .isMongoId()
    .withMessage(messages.userIdIsInvalid),
    validateField, updateUser)



export default router;