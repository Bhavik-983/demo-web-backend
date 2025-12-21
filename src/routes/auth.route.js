import express from "express";
import { check } from "express-validator";
import { validateField } from "../middleware/field_validator/index.js";
import messages from "../utilities/messages.js";
import { getProfile, Login, updateProfile } from "../controllers/auth.controller.js";
import { isAuth } from "../middleware/auth_validator/auth_validator.js";
const router = express.Router();

router.post("/login",
    [
        check("email")
            .exists()
            .withMessage(messages.emailIsRequired)
            .trim()
            .notEmpty()
            .withMessage(messages.emailCannotBeEmpty)
        ,
        check("password")
            .exists()
            .withMessage(messages.passwordIsRequired)
            .trim()
            .notEmpty()
            .withMessage(messages.passwordCannotBeEmpty)
        ,
    ]
    , validateField, Login);


router.get('/profile', isAuth, getProfile)

router.put('/update-profile',isAuth,updateProfile)


export default router;