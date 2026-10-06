import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import formRouter from "./routes/form.routes.js";
console.log("user running")
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/forms", formRouter);
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working" });
});
export { app };
