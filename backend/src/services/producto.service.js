import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto,
} from "../repositories/producto.repository.js";

// Listar todos los productos
export const listarProductos = async () => {
  return await obtenerProductos();
};

// Buscar un producto por ID
export const buscarProductoPorId = async (id) => {
  return await obtenerProductoPorId(id);
};

// Registrar un nuevo producto
export const registrarProducto = async (datosProducto) => {
  return await crearProducto(datosProducto);
};

// Modificar un producto
export const modificarProducto = async (id, datosProducto) => {
  return await actualizarProducto(id, datosProducto);
};

// Activar o desactivar un producto
export const modificarEstadoProducto = async (id, activo) => {
  return await cambiarEstadoProducto(id, activo);
};