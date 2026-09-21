import express from "express";
import {
  obtenerProveedores,
  crearProveedor, obtenerProveedorPorId, editarProveedor,desactivarProveedor, reactivarProveedor
} from "../controllers/proveedor.controller.js";

const router = express.Router();

// GET /proveedores
router.get("/", obtenerProveedores);

// POST /proveedores
router.post("/", crearProveedor);

// GET /proveedores/:id
router.get("/:id", obtenerProveedorPorId);
router.put("/:id", editarProveedor);

router.patch("/:id/desactivar", desactivarProveedor);
router.patch("/:id/reactivar", reactivarProveedor);

export default router;