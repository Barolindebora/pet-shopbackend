import {
  listarVentas,
  buscarVentaPorId,
  listarDetallesDeVenta,
  registrarVenta,
} from "../services/venta.service.js"

// =====================================================
// OBTENER TODAS LAS VENTAS
// =====================================================

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await listarVentas()

    res.json(ventas)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Error al obtener las ventas",
    })
  }
}

// =====================================================
// OBTENER VENTA POR ID
// =====================================================

export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await buscarVentaPorId(req.params.id)

    if (!venta) {
      return res.status(404).json({
        error: "Venta no encontrada",
      })
    }

    res.json(venta)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Error al obtener la venta",
    })
  }
}

// =====================================================
// OBTENER DETALLES DE UNA VENTA
// =====================================================

export const obtenerDetallesVenta = async (req, res) => {
  try {
    const detalles = await listarDetallesDeVenta(
      req.params.id
    )

    res.json(detalles)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Error al obtener los detalles de la venta",
    })
  }
}

// =====================================================
// CREAR VENTA
// =====================================================

export const crearVenta = async (req, res) => {
  try {
    const venta = await registrarVenta(req.body)

    res.status(201).json(venta)
  } catch (error) {
    console.error(error)

    if (error.message === "CANAL_INVALIDO") {
      return res.status(400).json({
        error: "El canal de venta no es válido",
      })
    }

    if (error.message === "FORMA_PAGO_INVALIDA") {
      return res.status(400).json({
        error: "La forma de pago no es válida",
      })
    }

    if (error.message === "VENTA_SIN_PRODUCTOS") {
      return res.status(400).json({
        error: "La venta debe contener al menos un producto",
      })
    }

    if (error.message === "PRODUCTO_INVALIDO") {
      return res.status(400).json({
        error: "El producto no es válido",
      })
    }

    if (error.message === "CANTIDAD_INVALIDA") {
      return res.status(400).json({
        error: "La cantidad debe ser mayor que cero",
      })
    }

    if (error.message === "PRODUCTO_NO_ENCONTRADO") {
      return res.status(404).json({
        error: "Uno de los productos no existe",
      })
    }

    if (error.message === "PRODUCTO_INACTIVO") {
      return res.status(400).json({
        error: "Uno de los productos ya no está activo",
      })
    }
    if (error.message === "STOCK_INSUFICIENTE") {
  return res.status(400).json({
    error: "No hay stock suficiente para completar la venta",
  })
}

    res.status(500).json({
      error: "Error al registrar la venta",
    })
  }
}