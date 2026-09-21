import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
} from "../repositories/categoria.repository.js";

// Listar todas las categorías
export const listarCategorias = async () => {
  return await obtenerCategorias();
};

// Buscar una categoría por ID
export const buscarCategoriaPorId = async (id) => {
  return await obtenerCategoriaPorId(id);
};

// Registrar una nueva categoría
export const registrarCategoria = async (datosCategoria) => {
  return await crearCategoria(datosCategoria);
};

// Modificar una categoría
export const modificarCategoria = async (id, datosCategoria) => {
  return await actualizarCategoria(id, datosCategoria);
};

// Activar o desactivar una categoría
export const modificarEstadoCategoria = async (id, activo) => {
  return await cambiarEstadoCategoria(id, activo);
};