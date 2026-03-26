import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./route/route.js";
import connectDB from "./config/dbConnection.js";

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes with /user prefix
app.use("/user", routes);

app.get("/", (req, res) => {
  res.send("Hello Everyone");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});