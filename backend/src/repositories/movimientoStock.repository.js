import { db } from "../prisma/db.js";

// Obtener todos los movimientos
export const obtenerMovimientos = async () => {
  return await db.orm.public.MovimientoStock.all();
};

// Obtener un movimiento por ID
export const obtenerMovimientoPorId = async (id) => {
  return await db.orm.public.MovimientoStock
    .where({ id })
    .first();
};

// Obtener movimientos de un producto
export const obtenerMovimientosPorProducto = async (productoId) => {
  return await db.orm.public.MovimientoStock
    .where({ productoId })
    .all();
};

// Crear un movimiento
export const crearMovimiento = async (datosMovimiento) => {
  return await db.orm.public.MovimientoStock.create(datosMovimiento);
};

// Actualizar el stock de un producto
export const actualizarStockProducto = async (
  productoId,
  nuevoStock
) => {
  return await db.orm.public.Producto
    .where({ id: productoId })
    .update({
      stockActual: nuevoStock,
    });
};