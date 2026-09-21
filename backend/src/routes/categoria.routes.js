import express from "express";
import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  editarCategoria,
  desactivarCategoria,
  reactivarCategoria,
} from "../controllers/categoria.controller.js";

const router = express.Router();

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.post("/", crearCategoria);
router.put("/:id", editarCategoria);
router.patch("/:id/desactivar", desactivarCategoria);
router.patch("/:id/reactivar", reactivarCategoria);

export default router;