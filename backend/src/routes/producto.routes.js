import express from "express";

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  desactivarProducto,
  reactivarProducto,
  obtenerCategoriasDelProducto,
  configurarVentaSinStockProducto,
  obtenerProductoPorCodigoBarra,
} from "../controllers/producto.controller.js";

const router = express.Router();

router.get("/", obtenerProductos);

// Categorías de un producto
router.get("/:id/categorias", obtenerCategoriasDelProducto);
router.patch(
  "/:id/venta-sin-stock",
  configurarVentaSinStockProducto
);
// Producto por ID
router.get(
  "/codigo-barra/:codigoBarra",
  obtenerProductoPorCodigoBarra
);
router.get("/:id", obtenerProductoPorId);

router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/reactivar", reactivarProducto);

export default router;