import express from "express";

import cors from "cors";
import "dotenv/config";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./src/routes/index.js";
import connectDatabase from "./src/db/dbconfig.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 1111;

//mdw
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

//db connect
connectDatabase();
//api endpoints
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("API working properly");
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
