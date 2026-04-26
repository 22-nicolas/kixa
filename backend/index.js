import express from 'express'
import rateLimit from 'express-rate-limit'
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
import webhookRouter from './routes/checkout-session-routes/stripeWebhook.js';

const SESSIONS_CLEANUP_INTERVAL = 10*60*1000;

const checkoutLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 10,
    message: { error: "Too many checkout attempts, try again later" },
});

const globalLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});

dotenv.config({ path: "backend/.env" });

const app = express();
app.set('trust proxy', 1);

app.use("/api", webhookRouter);

app.use(cors({
    exposedHeaders: ['RateLimit-Reset']
}));
app.use(express.json());

app.use(globalLimiter);

await checkPool();

// mount routers
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutLimiter, checkoutRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/currency", currencyRoutes);

sessionsCleanup()
setInterval(sessionsCleanup, SESSIONS_CLEANUP_INTERVAL)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});