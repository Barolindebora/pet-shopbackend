import {
  listarMovimientos,
  buscarMovimientoPorId,
  listarMovimientosPorProducto,
  registrarEntradaStock,
  registrarSalidaStock,
} from "../services/movimientoStock.service.js";


// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await listarMovimientos();

    res.json(movimientos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los movimientos",
    });
  }
};


// Obtener un movimiento por ID
export const obtenerMovimientoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const movimiento = await buscarMovimientoPorId(id);

    if (!movimiento) {
      return res.status(404).json({
        error: "Movimiento no encontrado",
      });
    }

    res.json(movimiento);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener el movimiento",
    });
  }
};


// Obtener movimientos de un producto
export const obtenerMovimientosPorProducto = async (req, res) => {
  try {
    const productoId = Number(req.params.productoId);

    const movimientos =
      await listarMovimientosPorProducto(productoId);

    res.json(movimientos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los movimientos del producto",
    });
  }
};


// Registrar entrada de stock
export const crearEntradaStock = async (req, res) => {
  try {
    const movimiento = await registrarEntradaStock(req.body);

    res.status(201).json(movimiento);
  } catch (error) {
    console.error(error);

    if (error.message === "PRODUCTO_NO_ENCONTRADO") {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    if (error.message === "CANTIDAD_INVALIDA") {
      return res.status(400).json({
        error: "La cantidad debe ser mayor que cero",
      });
    }

    res.status(500).json({
      error: "Error al registrar la entrada de stock",
    });
  }
};


// Registrar salida de stock
export const crearSalidaStock = async (req, res) => {
  try {
    const movimiento = await registrarSalidaStock(req.body);

    res.status(201).json(movimiento);
  } catch (error) {
    console.error(error);

    if (error.message === "PRODUCTO_NO_ENCONTRADO") {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    if (error.message === "CANTIDAD_INVALIDA") {
      return res.status(400).json({
        error: "La cantidad debe ser mayor que cero",
      });
    }

    if (error.message === "STOCK_INSUFICIENTE") {
      return res.status(400).json({
        error: "Stock insuficiente",
      });
    }

    res.status(500).json({
      error: "Error al registrar la salida de stock",
    });
  }
};