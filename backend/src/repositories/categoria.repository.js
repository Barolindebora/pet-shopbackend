import { db } from "../prisma/db.js";

// Obtener todas las categorías
export const obtenerCategorias = async () => {
  return await db.orm.public.Categoria.all();
};

// Obtener una categoría por ID
export const obtenerCategoriaPorId = async (id) => {
  return await db.orm.public.Categoria
    .where({ id })
    .first();
};

// Crear una categoría
export const crearCategoria = async (datosCategoria) => {
  return await db.orm.public.Categoria.create(datosCategoria);
};

// Actualizar una categoría
export const actualizarCategoria = async (id, datosCategoria) => {
  return await db.orm.public.Categoria
    .where({ id })
    .update(datosCategoria);
};

// Activar o desactivar una categoría
export const cambiarEstadoCategoria = async (id, activo) => {
  return await db.orm.public.Categoria
    .where({ id })
    .update({ activo });
};