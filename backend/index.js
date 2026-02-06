import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import NodeCache from 'node-cache';
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import countryRoutes from "./routes/country.js";

dotenv.config({ path: "backend/.env" });

const cache = new NodeCache({
  stdTTL: 120,
  checkperiod: 20
});

const app = express();
app.use(cors());
app.use(express.json());

// mount routers
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/country", countryRoutes(cache));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});