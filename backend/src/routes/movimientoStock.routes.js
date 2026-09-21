import express from "express";

import {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  obtenerMovimientosPorProducto,
  crearEntradaStock,
  crearSalidaStock,
} from "../controllers/movimientoStock.controller.js";

const router = express.Router();

// Todos los movimientos
router.get("/", obtenerMovimientos);

// Movimientos de un producto
router.get("/producto/:productoId", obtenerMovimientosPorProducto);

// Movimiento por ID
router.get("/:id", obtenerMovimientoPorId);

// Entrada de stock
router.post("/entrada", crearEntradaStock);

// Salida de stock
router.post("/salida", crearSalidaStock);

export default router;