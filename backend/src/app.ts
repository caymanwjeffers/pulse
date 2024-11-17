// boiler plate for app file in basic node server
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve() + "/.env",
});

const app = express();
app.use(cors());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
