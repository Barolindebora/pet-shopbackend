import {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  obtenerMovimientosPorProducto,
  crearMovimiento,
  actualizarStockProducto,
} from "../repositories/movimientoStock.repository.js";

import { buscarProductoPorId } from "./producto.service.js";

import { sumarVentaAReposicion } from "./listaReposicion.service.js";


// Listar todos los movimientos
export const listarMovimientos = async () => {
  return await obtenerMovimientos();
};


// Buscar movimiento por ID
export const buscarMovimientoPorId = async (id) => {
  return await obtenerMovimientoPorId(id);
};


// Listar movimientos de un producto
export const listarMovimientosPorProducto = async (productoId) => {
  return await obtenerMovimientosPorProducto(productoId);
};


// Registrar una entrada de stock
export const registrarEntradaStock = async (datos) => {
  const {
    productoId,
    cantidad,
    costoCompra,
    observacion,
    proveedorId,
  } = datos;

  const producto = await buscarProductoPorId(Number(productoId));

  if (!producto) {
    throw new Error("PRODUCTO_NO_ENCONTRADO");
  }

  const stockActual = Number(producto.stockActual);
  const cantidadEntrada = Number(cantidad);

  if (cantidadEntrada <= 0) {
    throw new Error("CANTIDAD_INVALIDA");
  }

  const nuevoStock = stockActual + cantidadEntrada;

  // Actualizar stock del producto
  await actualizarStockProducto(
    Number(productoId),
    String(nuevoStock)
  );

  // Registrar el movimiento de entrada
  return await crearMovimiento({
    tipo: "ENTRADA",
    cantidad: String(cantidadEntrada),
    costoCompra: costoCompra ?? null,
    observacion: observacion ?? null,
    productoId: Number(productoId),
    proveedorId: proveedorId ? Number(proveedorId) : null,
  });
};


// Registrar una salida de stock
export const registrarSalidaStock = async (datos) => {
  const {
    productoId,
    cantidad,
    observacion,
  } = datos;

  const producto = await buscarProductoPorId(Number(productoId));

  if (!producto) {
    throw new Error("PRODUCTO_NO_ENCONTRADO");
  }

  const stockActual = Number(producto.stockActual);
  const cantidadSalida = Number(cantidad);

  if (cantidadSalida <= 0) {
    throw new Error("CANTIDAD_INVALIDA");
  }

  if (cantidadSalida > stockActual) {
    throw new Error("STOCK_INSUFICIENTE");
  }

  const nuevoStock = stockActual - cantidadSalida;

  // Actualizar stock del producto
  await actualizarStockProducto(
    Number(productoId),
    String(nuevoStock)
  );

  // Registrar el movimiento de salida
  const movimiento = await crearMovimiento({
    tipo: "SALIDA",
    cantidad: String(cantidadSalida),
    costoCompra: null,
    observacion: observacion ?? null,
    productoId: Number(productoId),
    proveedorId: null,
  });

  // Sumar automáticamente lo vendido
  // a la lista de reposición
  await sumarVentaAReposicion(
    Number(productoId),
    Number(producto.proveedorId),
    cantidadSalida
  );

  return movimiento;
};