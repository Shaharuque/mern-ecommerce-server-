// ES6 based import
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

//Routes import
import authRoutes from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

//Config dotenv
dotenv.config(); //As my env file is int the root folder so don't need to define the path otherwise we can difine the path using {path}

//Middlewares
app.use(cors());
app.use(express.json()); //req,res in json format previously body parser use hoto
app.use(morgan("dev"));

//All Routes
app.use("/api/v1/auth", authRoutes);

//Connect to DB
//Initial connection with DB
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/ecommerce?retryWrites=true&w=majority`
    ); //ecommerce=>MongoDB database name
    console.log("connected MongoDB");
  } catch (error) {
    console.log("DB Error", error);
    throw error;
  }
};
//DB connection interrupted holey massege dibey and abr conncetion establish korar try korbey
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

// rest api
app.get("/", (req, res) => {
  res.send("Welcome to ecommerce");
});

// listen to the server
app.listen(PORT, () => {
  // MongoDB connection
  connectDB();
  console.log("connected to backend server of ecommerce site");
});
