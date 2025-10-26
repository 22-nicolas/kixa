import {getProductData, getProductById, createProductData, deleteProductData} from './scripts/utils/sql.js';
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({err})
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});