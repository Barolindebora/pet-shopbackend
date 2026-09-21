import { db } from "../prisma/db.js";


// Obtener toda la lista de reposición
export const obtenerListaReposicion = async () => {
  return await db.orm.public.ListaReposicion.all();
};


// Buscar una reposición por ID
export const obtenerReposicionPorId = async (id) => {
  return await db.orm.public.ListaReposicion
    .where({ id })
    .first();
};


// Buscar si un producto ya está pendiente de reposición
export const obtenerReposicionPorProducto = async (productoId) => {
  return await db.orm.public.ListaReposicion
    .where({ productoId })
    .first();
};


// Crear una reposición
export const crearReposicion = async (datosReposicion) => {
  return await db.orm.public.ListaReposicion.create(datosReposicion);
};


// Modificar la cantidad a reponer
export const actualizarCantidadReposicion = async (
  id,
  cantidadAReponer
) => {
  return await db.orm.public.ListaReposicion
    .where({ id })
    .update({
      cantidadAReponer,
    });
};


// Cambiar el proveedor de una reposición
export const actualizarProveedorReposicion = async (
  id,
  proveedorId
) => {
  return await db.orm.public.ListaReposicion
    .where({ id })
    .update({
      proveedorId,
    });
};


// Eliminar una reposición
export const eliminarReposicion = async (id) => {
  return await db.orm.public.ListaReposicion
    .where({ id })
    .delete();
};