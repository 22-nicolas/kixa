import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import cartRoutes from "./routes/cart.js";
import countriesRoutes from "./routes/countries.js";
import { sessionsCleanup } from './sql/users.js';
import { checkPool } from './sql/db.js';
import currencyRoutes from './routes/currency.js';
import checkoutRoutes from './routes/checkout-session-routes/checkout.js';

const SESSIONS_CLEANUP_INTERVAL = 10*60*1000;

dotenv.config({ path: "backend/.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

// mount routers
const err = await checkPool();
if (err) {
  console.error('Pool error:', err.message);
  console.warn('Continuing without user and product routes');

} else {
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/checkout", checkoutRoutes);

  sessionsCleanup()
  setInterval(sessionsCleanup, SESSIONS_CLEANUP_INTERVAL)
}

app.use("/api/countries", countriesRoutes);
app.use("/api/currency", currencyRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});