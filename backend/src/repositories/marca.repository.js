import { db } from "../prisma/db.js";

export const obtenerMarcas = async () => {
  return await db.orm.public.Marca.all();
};

export const crearMarca = async (datosMarca) => {
  return await db.orm.public.Marca.create(datosMarca);
};
export const obtenerMarcaPorId = async (id) => {
  return await db.orm.public.Marca
    .where({ id })
    .first();
};
export const actualizarMarca = async (id, datosMarca) => {
  return await db.orm.public.Marca
    .where({ id })
    .update(datosMarca);
};
export const cambiarEstadoMarca = async (id, activo) => {
  return await db.orm.public.Marca
    .where({ id })
    .update({ activo });
};