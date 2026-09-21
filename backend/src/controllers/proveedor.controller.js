import {
  listarProveedores,
  registrarProveedor,buscarProveedorPorId, modificarProveedor, modificarEstadoProveedor
} from "../services/proveedor.service.js";

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await listarProveedores();

    res.json(proveedores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los proveedores",
    });
  }
};

// Crear un proveedor
export const crearProveedor = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;

    const nuevoProveedor = await registrarProveedor({
      nombre,
      telefono,
      email,
      activo: true,
    });

    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el proveedor",
    });
  }
};
export const obtenerProveedorPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const proveedor = await buscarProveedorPorId(id);

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    res.json(proveedor);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener el proveedor",
    });
  }
};
export const editarProveedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const proveedorExistente = await buscarProveedorPorId(id);

    if (!proveedorExistente) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    const { nombre, telefono, email } = req.body;

    const proveedorActualizado = await modificarProveedor(id, {
      nombre,
      telefono,
      email,
    });

    res.json(proveedorActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar el proveedor",
    });
  }
};
export const desactivarProveedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const proveedorExistente = await buscarProveedorPorId(id);

    if (!proveedorExistente) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    const proveedorActualizado = await modificarEstadoProveedor(id, false);

    res.json(proveedorActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar el proveedor",
    });
  }
};

export const reactivarProveedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const proveedorExistente = await buscarProveedorPorId(id);

    if (!proveedorExistente) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    const proveedorActualizado = await modificarEstadoProveedor(id, true);

    res.json(proveedorActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar el proveedor",
    });
  }
};
