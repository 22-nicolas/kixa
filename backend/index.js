import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import NodeCache from 'node-cache';
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import countryRoutes from "./routes/country.js";
import { sessionsCleanup } from './sql/users.js';
import { checkPool } from './sql/db.js';

const SESSIONS_CLEANUP_INTERVAL = 10*60*1000;

dotenv.config({ path: "backend/.env" });

const cache = new NodeCache({
  stdTTL: 120,
  checkperiod: 20
});

const app = express();
app.use(cors());
app.use(express.json());


// mount routers
const err = await checkPool();
if (err) {
  console.error('Pool error:', err.message);
  console.warn('Continuing without user and product routes');

} else {
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);

  sessionsCleanup()
  setInterval(sessionsCleanup, SESSIONS_CLEANUP_INTERVAL)
}

app.use("/api/country", countryRoutes(cache));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});