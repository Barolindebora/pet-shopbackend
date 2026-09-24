import { db } from "../prisma/db.js";

// Obtener todos los productos
export const obtenerProductos = async () => {
  return await db.orm.public.Producto.all();
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (id) => {
  return await db.orm.public.Producto
    .where({ id })
    .first();
};

// Crear un producto
export const crearProducto = async (datosProducto) => {
  return await db.orm.public.Producto.create(datosProducto);
};

// Actualizar un producto
export const actualizarProducto = async (id, datosProducto) => {
  return await db.orm.public.Producto
    .where({ id })
    .update(datosProducto);
};

// Activar o desactivar un producto
export const cambiarEstadoProducto = async (id, activo) => {
  return await db.orm.public.Producto
    .where({ id })
    .update({ activo });
};
export const agregarCategoriaAProducto = async (
  productoId,
  categoriaId
) => {
  return await db.orm.public.ProductoCategoria.create({
    productoId,
    categoriaId,
  });
};
// Obtener las categorías de un producto
export const obtenerCategoriasDeProducto = async (productoId) => {
  return await db.orm.public.ProductoCategoria
    .where({ productoId })
    .all();
};
// Eliminar todas las categorías asignadas a un producto
export const eliminarCategoriasDeProducto = async (productoId) => {
  const categoriasActuales =
    await obtenerCategoriasDeProducto(productoId);

  for (const relacion of categoriasActuales) {
    await db.orm.public.ProductoCategoria
      .where({
        productoId: relacion.productoId,
        categoriaId: relacion.categoriaId,
      })
      .delete();
  }
};