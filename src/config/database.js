import mongoose from "mongoose";
import dotenv from "./env.js"
import { createAdmin } from "../controllers/admin.controller.js";
import { seedDatabase } from "../seed/seed.js";

mongoose.connect(dotenv.MONGO_URI).then(() => {
    console.log("Database connection successfully")
    createAdmin()
    seedDatabase()
}).catch((err) => {
    console.log(err)
})