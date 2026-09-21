import {
  obtenerMarcas,
  crearMarca,obtenerMarcaPorId, actualizarMarca, cambiarEstadoMarca
} from "../repositories/marca.repository.js";

export const listarMarcas = async () => {
  return await obtenerMarcas();
};

export const registrarMarca = async (datosMarca) => {
  return await crearMarca(datosMarca);
};
export const buscarMarcaPorId = async (id) => {
  return await obtenerMarcaPorId(id);
};
export const modificarMarca = async (id, datosMarca) => {
  return await actualizarMarca(id, datosMarca);
};
export const modificarEstadoMarca = async (id, activo) => {
  return await cambiarEstadoMarca(id, activo);
};