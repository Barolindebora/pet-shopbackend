
import express from "express"

import {
  obtenerVentas,
  obtenerVentaPorId,
  obtenerDetallesVenta,
  crearVenta,
} from "../controllers/venta.controller.js"

const router = express.Router()

// Todas las ventas
router.get("/", obtenerVentas)

// Detalles de una venta
// IMPORTANTE: esta ruta va antes de /:id
router.get("/:id/detalles", obtenerDetallesVenta)

// Una venta por ID
router.get("/:id", obtenerVentaPorId)

// Registrar una venta
router.post("/", crearVenta)

export default router