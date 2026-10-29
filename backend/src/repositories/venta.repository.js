import { db } from "../prisma/db.js"

// =====================================================
// VENTAS
// =====================================================

export const obtenerVentas = async () => {
  return await db.orm.public.Venta.all()
}

export const obtenerVentaPorId = async (id) => {
  return await db.orm.public.Venta
    .where({ id })
    .first()
}

export const crearVenta = async (datosVenta) => {
  return await db.orm.public.Venta.create(datosVenta)
}

// =====================================================
// DETALLES DE VENTA
// =====================================================

export const crearDetalleVenta = async (datosDetalle) => {
  return await db.orm.public.DetalleVenta.create(datosDetalle)
}

export const obtenerDetallesPorVenta = async (ventaId) => {
  return await db.orm.public.DetalleVenta
    .where({ ventaId })
    .all()
}