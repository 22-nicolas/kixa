import { Router } from "express";
import { getProductData, getProductById, createProductData, deleteProductData } from "../sql.js";

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

export default router;