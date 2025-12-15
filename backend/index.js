import {getProductData, getProductById, createProductData, deleteProductData} from './sql.js';
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt';
import { validateUserData } from './users.js';

dotenv.config({ path: "backend/.env" });

const cache = new NodeCache({
  stdTTL: 120,
  checkperiod: 20
});

const app = express();
app.use(cors());
app.use(express.json());

//user/login
app.get("/api/register/required_fields", async (req, res) => {
  const required_fields = process.env.LOGIN_REQUIRED_FIELDS
  res.send(required_fields);
});

//product data
app.get("/api/products", async (req, res) => {
  const porductData = await getProductData();
  res.send(porductData);
});

app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const porductData = await getProductById(id);
  res.send(porductData);
});

app.post("/api/products", async (req, res) => {
  const product = req.body
  //console.log(product)
  const porductData = await createProductData(product);
  res.status(201).send(porductData);
});

app.get("/api/products/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteProductData(id);
  res.status(200).send();
});

//country api
app.get("/api/country/:country", async (req, res, next) => {
  const country = req.params.country;
  const cacheKey = `country/:${country}`;

  //check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    res.send(cached);
    return;
  }

  const response = await fetch("https://aaapis.com/api/v1/info/country/", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.COUNTRY_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country: country
    })
  });
  const countryData = await response.json();

  //store in cache
  cache.set(cacheKey, countryData, 60);

  res.send(countryData);
});

app.post("/api/users/register", async (req, res) => {
  const userData = req.body;
  const {password} = userData;
  const validateResult = await validateUserData(userData);
  if (validateResult) {
    res.status(400).send(validateResult);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  //TODO: store in db
  res.status(201).send();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});