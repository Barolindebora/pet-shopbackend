import {
  listarProductos,
  buscarProductoPorId,
  registrarProducto,
  modificarProducto,
  modificarEstadoProducto,
} from "../services/producto.service.js";

import { buscarProveedorPorId } from "../services/proveedor.service.js";
import { buscarMarcaPorId } from "../services/marca.service.js";


// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await listarProductos();

    res.json(productos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los productos",
    });
  }
};


// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const producto = await buscarProductoPorId(id);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener el producto",
    });
  }
};


// Crear un producto
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      unidadStock,
      stockActual,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId,
      marcaId,
    } = req.body;

    // Comprobar que exista el proveedor
    const proveedor = await buscarProveedorPorId(Number(proveedorId));

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    // Comprobar que exista la marca
    const marca = await buscarMarcaPorId(Number(marcaId));

    if (!marca) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    const nuevoProducto = await registrarProducto({
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      unidadStock,
      stockActual,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId: Number(proveedorId),
      marcaId: Number(marcaId),
      activo: true,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el producto",
    });
  }
};


// Editar un producto
export const editarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const {
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      unidadStock,
      stockActual,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId,
      marcaId,
    } = req.body;

    // Comprobar proveedor
    const proveedor = await buscarProveedorPorId(Number(proveedorId));

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }

    // Comprobar marca
    const marca = await buscarMarcaPorId(Number(marcaId));

    if (!marca) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }

    const productoActualizado = await modificarProducto(id, {
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      unidadStock,
      stockActual,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId: Number(proveedorId),
      marcaId: Number(marcaId),
    });

    res.json(productoActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar el producto",
    });
  }
};


// Desactivar un producto
export const desactivarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const productoActualizado = await modificarEstadoProducto(id, false);

    res.json(productoActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar el producto",
    });
  }
};


// Reactivar un producto
export const reactivarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const productoActualizado = await modificarEstadoProducto(id, true);

    res.json(productoActualizado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar el producto",
    });
  }
};