import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./api.router";

dotenv.config({
  path: path.resolve() + "/.env",
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", apiRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
