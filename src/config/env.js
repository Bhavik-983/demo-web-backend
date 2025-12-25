"use strict";

import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== "production") dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default {
  MONGO_URI: process.env.MONGO_URI,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_EMAIL : process.env.ADMIN_EMAIL,

  // jwt secret
  AUTH_SECRET: process.env.AUTH_SECRET,
  PORT: process.env.PORT,
};
