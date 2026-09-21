import {
  listarReposiciones,
  buscarReposicionPorId,
  registrarReposicion,
  modificarCantidadReposicion,
  modificarProveedorReposicion,
  quitarReposicion,
} from "../services/listaReposicion.service.js";

import { buscarProductoPorId } from "../services/producto.service.js";
import { buscarProveedorPorId } from "../services/proveedor.service.js";


// Obtener toda la lista de reposición
export const obtenerReposiciones = async (req, res) => {
  try {
    const reposiciones = await listarReposiciones();

    res.json(reposiciones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener la lista de reposición",
    });
  }
};


// Obtener una reposición por ID
export const obtenerReposicionPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const reposicion = await buscarReposicionPorId(id);

    if (!reposicion) {
      return res.status(404).json({
        error: "Reposición no encontrada",
      });
    }

    res.json(reposicion);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener la reposición",
    });
  }
};


// Crear una reposición manualmente
export const crearReposicion = async (req, res) => {
  try {
    const {
      productoId,
      proveedorId,
      cantidadAReponer,
    } = req.body;

    // Verificar producto
    const producto =
      await buscarProductoPorId(Number(productoId));

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    // Verificar proveedor
    const proveedor =
      await buscarProveedorPorId(Number(proveedorId));

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    const reposicion = await registrarReposicion({
      productoId,
      proveedorId,
      cantidadAReponer,
    });

    res.status(201).json(reposicion);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear la reposición",
    });
  }
};


// Modificar cantidad a reponer
export const editarCantidadReposicion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { cantidadAReponer } = req.body;

    const reposicion =
      await modificarCantidadReposicion(
        id,
        cantidadAReponer
      );

    res.json(reposicion);
  } catch (error) {
    console.error(error);

    if (error.message === "REPOSICION_NO_ENCONTRADA") {
      return res.status(404).json({
        error: "Reposición no encontrada",
      });
    }

    if (error.message === "CANTIDAD_INVALIDA") {
      return res.status(400).json({
        error: "La cantidad a reponer debe ser mayor que cero",
      });
    }

    res.status(500).json({
      error: "Error al modificar la cantidad a reponer",
    });
  }
};


// Cambiar proveedor de una reposición
export const editarProveedorReposicion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { proveedorId } = req.body;

    const proveedor =
      await buscarProveedorPorId(Number(proveedorId));

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    const reposicion =
      await modificarProveedorReposicion(
        id,
        proveedorId
      );

    res.json(reposicion);
  } catch (error) {
    console.error(error);

    if (error.message === "REPOSICION_NO_ENCONTRADA") {
      return res.status(404).json({
        error: "Reposición no encontrada",
      });
    }

    res.status(500).json({
      error: "Error al modificar el proveedor",
    });
  }
};


// Eliminar una reposición
export const eliminarReposicion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await quitarReposicion(id);

    res.json({
      mensaje: "Producto eliminado de la lista de reposición",
    });
  } catch (error) {
    console.error(error);

    if (error.message === "REPOSICION_NO_ENCONTRADA") {
      return res.status(404).json({
        error: "Reposición no encontrada",
      });
    }

    res.status(500).json({
      error: "Error al eliminar la reposición",
    });
  }
};