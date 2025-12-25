import express from "express"; 
import "./config/database.js"
import dotenv from "./config/env.js"
import compression from "compression";
import router from "./routes/index.js";
import cors from "cors"



const app = express()
app.use(cors({origin:"*"}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(compression());

app.use("/api",router)



app.listen(dotenv.PORT, () => {
    console.log(`Server is running on port ${dotenv.PORT}`);
})