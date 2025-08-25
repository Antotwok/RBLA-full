import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
const chatbotRoutes = require("./routes/chatbotRoutes");
app.use("/api/chatbot", chatbotRoutes);

app.listen(3000, () => console.log("Backend running on port 3000"));
