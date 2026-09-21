import {
  listarMarcas,
  registrarMarca,buscarMarcaPorId,  modificarMarca,modificarEstadoMarca
} from "../services/marca.service.js";

// Obtener todas las marcas
export const obtenerMarcas = async (req, res) => {
  try {
    const marcas = await listarMarcas();

    res.json(marcas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener las marcas",
    });
  }
};

// Crear una marca
export const crearMarca = async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevaMarca = await registrarMarca({
      nombre,
      activo: true,
    });

    res.status(201).json(nuevaMarca);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear la marca",
    });
  }
};
export const obtenerMarcaPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const marca = await buscarMarcaPorId(id);

    if (!marca) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    res.json(marca);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener la marca",
    });
  }
};
export const desactivarMarca = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const marcaExistente = await buscarMarcaPorId(id);

    if (!marcaExistente) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    const marcaActualizada = await modificarEstadoMarca(id, false);

    res.json(marcaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar la marca",
    });
  }
};

export const reactivarMarca = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const marcaExistente = await buscarMarcaPorId(id);

    if (!marcaExistente) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    const marcaActualizada = await modificarEstadoMarca(id, true);

    res.json(marcaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar la marca",
    });
  }
};
export const editarMarca = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const marcaExistente = await buscarMarcaPorId(id);

    if (!marcaExistente) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    const { nombre } = req.body;

    const marcaActualizada = await modificarMarca(id, {
      nombre,
    });

    res.json(marcaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar la marca",
    });
  }
};