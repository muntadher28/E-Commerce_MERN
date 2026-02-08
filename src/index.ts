import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute"
import { seedInitialProducts } from "./services/productService";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json())

mongoose
  .connect(process.env.DATABASE_URL || '')
  .then(() => console.log("mongo connected!"))
  .catch((err)=> console.log("Failed connection",err));

// seed the products to databse
seedInitialProducts();

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

  app.listen(port,()=>{
    console.log(`Server is running at: http://localhost:${port}`)
  })