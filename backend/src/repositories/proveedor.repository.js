import { db } from "../prisma/db.js";

export const obtenerProveedores = async () => {
  return await db.orm.public.Proveedor.all();
};
export const crearProveedor = async (datosProveedor) => {
  return await db.orm.public.Proveedor.create(datosProveedor);
};
export const obtenerProveedorPorId = async (id) => {
  return await db.orm.public.Proveedor
    .where({ id })
    .first();
};
export const actualizarProveedor = async (id, datosProveedor) => {
  return await db.orm.public.Proveedor
    .where({ id })
    .update(datosProveedor);
};
export const cambiarEstadoProveedor = async (id, activo) => {
  return await db.orm.public.Proveedor
    .where({ id })
    .update({ activo });
};