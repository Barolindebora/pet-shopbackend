import express from "express";

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  desactivarProducto,
  reactivarProducto,
  obtenerCategoriasDelProducto,
} from "../controllers/producto.controller.js";

const router = express.Router();

router.get("/", obtenerProductos);

// Categorías de un producto
router.get("/:id/categorias", obtenerCategoriasDelProducto);

// Producto por ID
router.get("/:id", obtenerProductoPorId);

router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/reactivar", reactivarProducto);

export default router;