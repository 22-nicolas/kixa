import express from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import cartRoutes from "./routes/cart.js";
import countriesRoutes from "./routes/countries.js";
import { sessionsCleanup } from './sql/users.js';
import { checkPool, isDbConnectionError, testConnection } from './sql/db.js';
import currencyRoutes from './routes/currency.js';
import checkoutRoutes from './routes/checkout-session-routes/checkout.js';
import webhookRouter from './routes/checkout-session-routes/stripeWebhook.js';
import shippingRoutes from './routes/shipping.js';

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

// DB Health check route
app.get("/api/health", async (req, res) => {
    const isConnected = await testConnection();
    if (isConnected) {
        return res.status(200).json({ status: "ok", database: "connected" });
    }
    return res.status(503).json({
        status: "degraded",
        database: "disconnected",
        error: "DATABASE_UNAVAILABLE",
        message: "Database is currently offline or waking up"
    });
});

// Non-fatal initial connection attempt (wakes up DB if sleeping, but server starts regardless)
const initialDbStatus = await checkPool(2, 1000);
if (initialDbStatus) {
    console.log("Database connected successfully.");
} else {
    console.warn("⚠️ Warning: Initial database connection failed. Server will start, but database-dependent features will be unavailable until the database wakes up.");
}

// mount routers
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutLimiter, checkoutRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/shipping", shippingRoutes);

const safeSessionsCleanup = async () => {
    try {
        await sessionsCleanup();
    } catch (err) {
        console.warn("Sessions cleanup skipped (database offline):", err.message);
    }
};

safeSessionsCleanup();
setInterval(safeSessionsCleanup, SESSIONS_CLEANUP_INTERVAL);

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  if (isDbConnectionError(err)) {
    return res.status(503).json({
      error: "DATABASE_UNAVAILABLE",
      message: "Database is currently offline or waking up. Please try again shortly."
    });
  }
  res.status(500).json({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});