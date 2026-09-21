import {
  obtenerListaReposicion,
  obtenerReposicionPorId,
  obtenerReposicionPorProducto,
  crearReposicion,
  actualizarCantidadReposicion,
  actualizarProveedorReposicion,
  eliminarReposicion,
} from "../repositories/listaReposicion.repository.js";


// Listar todas las reposiciones pendientes
export const listarReposiciones = async () => {
  return await obtenerListaReposicion();
};


// Buscar una reposición por ID
export const buscarReposicionPorId = async (id) => {
  return await obtenerReposicionPorId(id);
};


// Buscar si un producto ya está en la lista
export const buscarReposicionPorProducto = async (productoId) => {
  return await obtenerReposicionPorProducto(productoId);
};


// Agregar producto a la lista de reposición
export const registrarReposicion = async (datos) => {
  const {
    productoId,
    proveedorId,
    cantidadAReponer,
  } = datos;

  // Verificar si el producto ya está pendiente
  const reposicionExistente =
    await obtenerReposicionPorProducto(Number(productoId));

  if (reposicionExistente) {
    return reposicionExistente;
  }

  return await crearReposicion({
    productoId: Number(productoId),
    proveedorId: Number(proveedorId),
    cantidadAReponer:
      cantidadAReponer !== undefined && cantidadAReponer !== null
        ? String(cantidadAReponer)
        : null,
  });
};


// Modificar cantidad a reponer
export const modificarCantidadReposicion = async (
  id,
  cantidadAReponer
) => {
  const reposicion = await obtenerReposicionPorId(id);

  if (!reposicion) {
    throw new Error("REPOSICION_NO_ENCONTRADA");
  }

  const cantidad = Number(cantidadAReponer);

  if (cantidad <= 0) {
    throw new Error("CANTIDAD_INVALIDA");
  }

  return await actualizarCantidadReposicion(
    id,
    String(cantidadAReponer)
  );
};


// Cambiar proveedor de la reposición
export const modificarProveedorReposicion = async (
  id,
  proveedorId
) => {
  const reposicion = await obtenerReposicionPorId(id);

  if (!reposicion) {
    throw new Error("REPOSICION_NO_ENCONTRADA");
  }

  return await actualizarProveedorReposicion(
    id,
    Number(proveedorId)
  );
};


// Quitar producto de la lista
export const quitarReposicion = async (id) => {
  const reposicion = await obtenerReposicionPorId(id);

  if (!reposicion) {
    throw new Error("REPOSICION_NO_ENCONTRADA");
  }

  return await eliminarReposicion(id);
};
// Sumar una venta a la lista de reposición
export const sumarVentaAReposicion = async (
  productoId,
  proveedorId,
  cantidadVendida
) => {
  const reposicionExistente =
    await obtenerReposicionPorProducto(Number(productoId));

  const cantidad = Number(cantidadVendida);

  if (reposicionExistente) {
    // El producto ya está en la lista:
    // sumamos la nueva venta a la cantidad pendiente
    const cantidadActual =
      Number(reposicionExistente.cantidadAReponer ?? 0);

    const nuevaCantidad = cantidadActual + cantidad;

    return await actualizarCantidadReposicion(
      reposicionExistente.id,
      String(nuevaCantidad)
    );
  }

  // El producto todavía no está en la lista:
  // lo agregamos con la cantidad que acaba de venderse
  return await crearReposicion({
    productoId: Number(productoId),
    proveedorId: Number(proveedorId),
    cantidadAReponer: String(cantidad),
  });
};