import express from "express";

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  desactivarProducto,
  reactivarProducto,
} from "../controllers/producto.controller.js";

const router = express.Router();

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/reactivar", reactivarProducto);

export default router;