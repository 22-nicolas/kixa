import { Router } from "express";
import { getProductData, getProductById, createProductData, deleteProductData, getProductStock } from "../sql/products.js";

const router = Router();

router.get("/", async (req, res) => {
  const porductData = await getProductData();
  res.send(porductData);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const porductData = await getProductById(id);
  res.send(porductData);
});

router.post("/", async (req, res) => {
  const product = req.body
  //console.log(product)
  const porductData = await createProductData(product);
  res.status(201).send(porductData);
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await deleteProductData(id);
  res.status(200).send();
});

router.get("/stock/:id", async (req, res) => {
  const id = req.params.id;
  const stockData = await getProductStock(id);
  res.send(stockData);
});

export default router;