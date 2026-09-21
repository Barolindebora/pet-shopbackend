import {
  listarCategorias,
  buscarCategoriaPorId,
  registrarCategoria,
  modificarCategoria,
  modificarEstadoCategoria,
} from "../services/categoria.service.js";

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await listarCategorias();

    res.json(categorias);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener las categorías",
    });
  }
};

// Obtener una categoría por ID
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const categoria = await buscarCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    res.json(categoria);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener la categoría",
    });
  }
};

// Crear una categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevaCategoria = await registrarCategoria({
      nombre,
      activo: true,
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear la categoría",
    });
  }
};

// Editar una categoría
export const editarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const categoriaExistente = await buscarCategoriaPorId(id);

    if (!categoriaExistente) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    const { nombre } = req.body;

    const categoriaActualizada = await modificarCategoria(id, {
      nombre,
    });

    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar la categoría",
    });
  }
};

// Desactivar una categoría
export const desactivarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const categoriaExistente = await buscarCategoriaPorId(id);

    if (!categoriaExistente) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    const categoriaActualizada = await modificarEstadoCategoria(id, false);

    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar la categoría",
    });
  }
};

// Reactivar una categoría
export const reactivarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const categoriaExistente = await buscarCategoriaPorId(id);

    if (!categoriaExistente) {
      return res.status(404).json({
        error: "Categoría no encontrada",
      });
    }

    const categoriaActualizada = await modificarEstadoCategoria(id, true);

    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar la categoría",
    });
  }
};