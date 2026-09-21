

import {
  obtenerProveedores,
  crearProveedor, obtenerProveedorPorId, actualizarProveedor,cambiarEstadoProveedor
} from "../repositories/proveedor.repository.js";


export const listarProveedores = async () => {
  return await obtenerProveedores();
};

export const registrarProveedor = async (datosProveedor) => {
  return await crearProveedor(datosProveedor);
};
export const buscarProveedorPorId = async (id) => {
  return await obtenerProveedorPorId(id);
};
export const modificarProveedor = async (id, datosProveedor) => {
  return await actualizarProveedor(id, datosProveedor);
};
export const modificarEstadoProveedor = async (id, activo) => {
  return await cambiarEstadoProveedor(id, activo);
};
