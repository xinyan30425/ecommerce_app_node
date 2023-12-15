const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });







// routes

const user = require("./route/userRoute");
const product = require("./route/productRoute")


// for req.cookie to get token while autentication
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(errorMiddleware);
app.use(cors({
  credentials: true,
  origin: `https://cs5610-ecommerce-app-react.netlify.app`,
  optionsSuccessStatus: 204
}));

app.use("/api/v1", product);
app.use("/api/v1", user);
// app.use("/api/v1", order);




const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/backend/build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "backend", "build", "index.html"))
);


module.exports = app;
