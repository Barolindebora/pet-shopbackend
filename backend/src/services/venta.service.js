import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  crearDetalleVenta,
  obtenerDetallesPorVenta,
} from "../repositories/venta.repository.js"

import { buscarProductoPorId } from "./producto.service.js"
import { registrarSalidaStock } from "./movimientoStock.service.js"

// =====================================================
// LISTAR VENTAS
// =====================================================

export const listarVentas = async () => {
  return await obtenerVentas()
}

// =====================================================
// BUSCAR VENTA POR ID
// =====================================================

export const buscarVentaPorId = async (id) => {
  return await obtenerVentaPorId(Number(id))
}

// =====================================================
// OBTENER DETALLES DE UNA VENTA
// =====================================================

export const listarDetallesDeVenta = async (ventaId) => {
  return await obtenerDetallesPorVenta(Number(ventaId))
}

// =====================================================
// REGISTRAR VENTA
// =====================================================

export const registrarVenta = async (datosVenta) => {
  const {
    canal,
    formaPago,
    productos,
  } = datosVenta

  // -----------------------------
  // VALIDACIONES GENERALES
  // -----------------------------

  if (!["LOCAL", "ONLINE"].includes(canal)) {
    throw new Error("CANAL_INVALIDO")
  }

  if (!["EFECTIVO", "TARJETA"].includes(formaPago)) {
    throw new Error("FORMA_PAGO_INVALIDA")
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error("VENTA_SIN_PRODUCTOS")
  }

  // -----------------------------
  // PREPARAMOS LOS DETALLES
  // -----------------------------

  const detallesPreparados = []
  let total = 0

  for (const item of productos) {
    const productoId = Number(item.productoId)
    const cantidad = Number(item.cantidad)

    if (!productoId) {
      throw new Error("PRODUCTO_INVALIDO")
    }

    if (!cantidad || cantidad <= 0) {
      throw new Error("CANTIDAD_INVALIDA")
    }

    const producto = await buscarProductoPorId(productoId)

    if (!producto) {
      throw new Error("PRODUCTO_NO_ENCONTRADO")
    }

    if (!producto.activo) {
      throw new Error("PRODUCTO_INACTIVO")
    }
    if (cantidad > Number(producto.stockActual)) {
  throw new Error("STOCK_INSUFICIENTE")
}

    // Elegimos automáticamente el precio
    // según la forma de pago de la venta.
    const precioUnitario =
      formaPago === "EFECTIVO"
        ? Number(producto.precioEfectivo)
        : Number(producto.precioTarjeta)

    const subtotal = precioUnitario * cantidad

    total += subtotal

    detallesPreparados.push({
      productoId,
      cantidad,
      precioUnitario,
      subtotal,
    })
  }

  // -----------------------------
  // CREAMOS LA VENTA
  // -----------------------------

  const venta = await crearVenta({
    canal,
    formaPago,
    total,
  })

  // -----------------------------
// CREAMOS SUS DETALLES
// Y REGISTRAMOS LA SALIDA DE STOCK
// -----------------------------

for (const detalle of detallesPreparados) {
  // Guardamos el detalle histórico de la venta
  await crearDetalleVenta({
    ventaId: venta.id,
    productoId: detalle.productoId,
    cantidad: detalle.cantidad,
    precioUnitario: detalle.precioUnitario,
    subtotal: detalle.subtotal,
  })

  // Registramos la salida física del producto.
  // registrarSalidaStock también:
  // - descuenta stock
  // - crea MovimientoStock SALIDA
  // - suma el producto a Reposición
  await registrarSalidaStock({
    productoId: detalle.productoId,
    cantidad: detalle.cantidad,
    observacion: `Venta #${venta.id}`,
  })
}

  // -----------------------------
  // RESPUESTA
  // -----------------------------

  const detalles = await obtenerDetallesPorVenta(venta.id)

  return {
    ...venta,
    detalles,
  }
}