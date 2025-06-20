import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/Auth.route";
import ChatRoutes from "./routes/Friend.route";
import path from "path";

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "/../../src/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth/v1", AuthRoutes);
app.use("/api/friend/v1", ChatRoutes);

export default app;
