import {
  listarProductos,
  buscarProductoPorId,
  registrarProducto,
  modificarProducto,
  modificarEstadoProducto,
  asignarCategoriasAProducto,
  listarCategoriasDeProducto,
  reemplazarCategoriasDeProducto,
  configurarVentaSinStock,
  buscarProductoPorCodigoBarra,
} from "../services/producto.service.js";

import { buscarProveedorPorId } from "../services/proveedor.service.js";
import { buscarMarcaPorId } from "../services/marca.service.js";
import { buscarCategoriaPorId } from "../services/categoria.service.js";


// ======================================================
// OBTENER TODOS LOS PRODUCTOS
// ======================================================

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


// ======================================================
// OBTENER UN PRODUCTO POR ID
// ======================================================

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


// ======================================================
// CREAR PRODUCTO
// ======================================================

export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      imagenUrl,
      unidadStock,
      stockActual,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId,
      marcaId,
      categorias,
    } = req.body;


    // --------------------------------------------------
    // Verificar proveedor
    // --------------------------------------------------

    const proveedor = await buscarProveedorPorId(
      Number(proveedorId)
    );

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }


    // --------------------------------------------------
    // Verificar marca
    // --------------------------------------------------

    const marca = await buscarMarcaPorId(
      Number(marcaId)
    );

    if (!marca) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }


    // --------------------------------------------------
    // Verificar categorías
    // --------------------------------------------------

    if (!Array.isArray(categorias) || categorias.length === 0) {
      return res.status(400).json({
        error: "El producto debe tener al menos una categoría",
      });
    }

    for (const categoriaId of categorias) {
      const categoria = await buscarCategoriaPorId(
        Number(categoriaId)
      );

      if (!categoria) {
        return res.status(404).json({
          error: `Categoría ${categoriaId} no encontrada`,
        });
      }
    }


    // --------------------------------------------------
    // Crear producto
    // --------------------------------------------------

    const nuevoProducto = await registrarProducto({
      nombre,
      descripcion,
      codigoBarra,
      presentacion,
      imagenUrl,
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


    // --------------------------------------------------
    // Asignar categorías al producto
    // --------------------------------------------------

    await asignarCategoriasAProducto(
      nuevoProducto.id,
      categorias
    );

    res.status(201).json(nuevoProducto);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el producto",
    });
  }
};


// ======================================================
// EDITAR PRODUCTO
// ======================================================

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
      imagenUrl,
      unidadStock,
      stockMinimo,
      costoCompra,
      precioSugerido,
      precioEfectivo,
      precioTarjeta,
      proveedorId,
      marcaId,
      categorias,
    } = req.body;


    // --------------------------------------------------
    // Verificar proveedor
    // --------------------------------------------------

    const proveedor = await buscarProveedorPorId(
      Number(proveedorId)
    );

    if (!proveedor) {
      return res.status(404).json({
        error: "Proveedor no encontrado",
      });
    }


    // --------------------------------------------------
    // Verificar marca
    // --------------------------------------------------

    const marca = await buscarMarcaPorId(
      Number(marcaId)
    );

    if (!marca) {
      return res.status(404).json({
        error: "Marca no encontrada",
      });
    }


    // --------------------------------------------------
    // Verificar categorías
    // --------------------------------------------------

    if (!Array.isArray(categorias) || categorias.length === 0) {
      return res.status(400).json({
        error: "El producto debe tener al menos una categoría",
      });
    }

    for (const categoriaId of categorias) {
      const categoria = await buscarCategoriaPorId(
        Number(categoriaId)
      );

      if (!categoria) {
        return res.status(404).json({
          error: `Categoría ${categoriaId} no encontrada`,
        });
      }
    }


    // --------------------------------------------------
    // Actualizar producto
    // stockActual NO se modifica desde acá
    // --------------------------------------------------

    const productoActualizado = await modificarProducto(
      id,
      {
        nombre,
        descripcion,
        codigoBarra,
        presentacion,
        imagenUrl,
        unidadStock,
        stockMinimo,
        costoCompra,
        precioSugerido,
        precioEfectivo,
        precioTarjeta,
        proveedorId: Number(proveedorId),
        marcaId: Number(marcaId),
      }
    );


    // --------------------------------------------------
    // Reemplazar categorías
    // --------------------------------------------------

    await reemplazarCategoriasDeProducto(
      id,
      categorias
    );


    res.json(productoActualizado);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar el producto",
    });
  }
};


// ======================================================
// DESACTIVAR PRODUCTO
// ======================================================

export const desactivarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const productoActualizado =
      await modificarEstadoProducto(id, false);

    res.json(productoActualizado);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al desactivar el producto",
    });
  }
};


// ======================================================
// REACTIVAR PRODUCTO
// ======================================================

export const reactivarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const productoActualizado =
      await modificarEstadoProducto(id, true);

    res.json(productoActualizado);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al reactivar el producto",
    });
  }
};


// ======================================================
// OBTENER CATEGORÍAS DE UN PRODUCTO
// ======================================================

export const obtenerCategoriasDelProducto = async (req, res) => {
  try {
    const productoId = Number(req.params.id);

    const producto = await buscarProductoPorId(productoId);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const categorias =
      await listarCategoriasDeProducto(productoId);

    res.json(categorias);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener las categorías del producto",
    });
  }
};
// ======================================================
// CONFIGURAR VENTA SIN STOCK
// ======================================================

export const configurarVentaSinStockProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const productoExistente = await buscarProductoPorId(id);

    if (!productoExistente) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const {
      ventaSinStock,
      diasDisponibilidad,
    } = req.body;

    if (typeof ventaSinStock !== "boolean") {
      return res.status(400).json({
        error: "ventaSinStock debe ser true o false",
      });
    }

    const productoActualizado =
      await configurarVentaSinStock(
        id,
        ventaSinStock,
        diasDisponibilidad
      );

    res.json(productoActualizado);

  } catch (error) {
    console.error(error);

    if (error.message === "DIAS_DISPONIBILIDAD_INVALIDOS") {
      return res.status(400).json({
        error:
          "Debe indicar una cantidad válida de días de disponibilidad",
      });
    }

    res.status(500).json({
      error: "Error al configurar la venta sin stock",
    });
  }
};
// ======================================================
// OBTENER PRODUCTO POR CÓDIGO DE BARRAS
// ======================================================

export const obtenerProductoPorCodigoBarra = async (req, res) => {
  try {
    const { codigoBarra } = req.params;

    const producto =
      await buscarProductoPorCodigoBarra(codigoBarra);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);

  } catch (error) {
    console.error(error);

    if (error.message === "CODIGO_BARRA_INVALIDO") {
      return res.status(400).json({
        error: "Código de barras inválido",
      });
    }

    res.status(500).json({
      error: "Error al buscar el producto por código de barras",
    });
  }
};