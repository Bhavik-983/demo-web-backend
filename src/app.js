import express from "express"; 
import "./config/database.js"
import compression from "compression";
import router from "./routes/index.js";
import cors from "cors"



const app = express()
app.use(cors({origin:"*"}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(compression());

app.use("/api",router)



app.listen(8000, () => {
    console.log("Server is running on port 8000");
})