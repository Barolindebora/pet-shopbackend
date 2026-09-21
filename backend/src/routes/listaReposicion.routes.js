import express from "express";

import {
  obtenerReposiciones,
  obtenerReposicionPorId,
  crearReposicion,
  editarCantidadReposicion,
  editarProveedorReposicion,
  eliminarReposicion,
} from "../controllers/listaReposicion.controller.js";

const router = express.Router();

// Ver toda la lista de reposición
router.get("/", obtenerReposiciones);

// Ver una reposición
router.get("/:id", obtenerReposicionPorId);

// Agregar manualmente un producto a la lista
router.post("/", crearReposicion);

// Cambiar cantidad que queremos pedir
router.patch("/:id/cantidad", editarCantidadReposicion);

// Cambiar proveedor para este pedido
router.patch("/:id/proveedor", editarProveedorReposicion);

// Quitar de la lista
router.delete("/:id", eliminarReposicion);

export default router;