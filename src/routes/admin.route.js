import express from "express";
import { check, param, query } from "express-validator";
import { createUser, deleteUser, listOfUser, updateUser } from "../controllers/admin.controller.js";
import { validateField } from "../middleware/field_validator/index.js";
import messages from "../utilities/messages.js";
import constant from "../utilities/constant.js";
import { isAuth, verifyPermission } from "../middleware/auth_validator/auth_validator.js";
const router = express.Router();

router.post("/create-user", isAuth, verifyPermission(constant.ROLE[0]),
    [
        check("username")
            .exists()
            .withMessage(messages.usernameIsRequired)
            .trim()
            .notEmpty()
            .withMessage(messages.usernameCannotBeEmpty),
        check("email")
            .exists()
            .withMessage(messages.emailIsRequired)
            .trim()
            .notEmpty()
            .withMessage(messages.emailCannotBeEmpty)
            .isEmail()
            .withMessage(messages.emailIsInvalid)
            .normalizeEmail(),
        check("password")
            .exists()
            .withMessage(messages.passwordIsRequired)
            .trim()
            .notEmpty()
            .withMessage(messages.passwordCannotBeEmpty)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
            ).withMessage(messages.invalidPasswordFormat),
        check("role")
            .exists()
            .withMessage(messages.roleIsRequired)
            .notEmpty()
            .withMessage(messages.roleCanNotEmpty)
            .isIn(constant.ROLE)
            .withMessage(messages.roleIsInvalid)

    ]
    , validateField, createUser);


router.get("/user-list", isAuth, verifyPermission(constant.ROLE[0]),
    query("role")
        .exists()
        .withMessage(messages.roleIsRequired)
        .notEmpty()
        .withMessage(messages.roleCanNotEmpty)
        .isIn(constant.ROLE.filter(role => role !== constant.ROLE[0]))
        .withMessage(messages.roleIsInvalid),
    validateField,
    listOfUser)


router.put('/update-user/:userId', isAuth, verifyPermission(constant.ROLE[0]), param("userId")
    .exists()
    .withMessage(messages.userIdIsRequired)
    .notEmpty()
    .withMessage(messages.userIdCannotBeEmpty)
    .isMongoId()
    .withMessage(messages.userIdIsInvalid),
    validateField, updateUser)

router.delete(
    "/delete-user/:userId",
    isAuth, verifyPermission(constant.ROLE[0]),
    param("userId")
        .exists()
        .withMessage(messages.userIdIsRequired)
        .notEmpty()
        .withMessage(messages.userIdCannotBeEmpty)
        .isMongoId()
        .withMessage(messages.userIdIsInvalid),
    validateField,
    deleteUser
);

export default router;