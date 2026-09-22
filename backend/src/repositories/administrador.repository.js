import { db } from "../prisma/db.js"

export const obtenerAdministradorPorUsuario = async (usuario) => {
  return await db.orm.public.Administrador
    .where({ usuario })
    .first()
}