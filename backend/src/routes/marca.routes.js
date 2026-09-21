import express from "express";
import {
  obtenerMarcas,
  crearMarca,obtenerMarcaPorId,  editarMarca, desactivarMarca, reactivarMarca
} from "../controllers/marca.controller.js";

const router = express.Router();

router.get("/", obtenerMarcas);
router.get("/:id", obtenerMarcaPorId);
router.post("/", crearMarca);
router.put("/:id", editarMarca);
router.patch("/:id/desactivar", desactivarMarca);
router.patch("/:id/reactivar", reactivarMarca);

export default router;