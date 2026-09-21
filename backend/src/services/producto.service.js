import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto, agregarCategoriaAProducto,
  obtenerCategoriasDeProducto
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
// Asignar varias categorías a un producto
export const asignarCategoriasAProducto = async (
  productoId,
  categorias
) => {
  const relaciones = [];

  for (const categoriaId of categorias) {
    const relacion = await agregarCategoriaAProducto(
      productoId,
      Number(categoriaId)
    );

    relaciones.push(relacion);
  }

  return relaciones;
};


// Obtener las categorías asignadas a un producto
export const listarCategoriasDeProducto = async (productoId) => {
  return await obtenerCategoriasDeProducto(productoId);
};