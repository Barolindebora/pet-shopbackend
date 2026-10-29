import { useState } from "react"

function Ventas() {
  const [codigoBarra, setCodigoBarra] = useState("")
  const [carrito, setCarrito] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState("")
  const [formaPago, setFormaPago] = useState("EFECTIVO")
  const [procesandoVenta, setProcesandoVenta] = useState(false)
  const [canal, setCanal] = useState("LOCAL")

 const buscarProducto = async (event) => {
  event.preventDefault()

  const busqueda = codigoBarra.trim()

  if (!busqueda) {
    return
  }

  try {
    setBuscando(true)
    setError("")

    const token = localStorage.getItem("token")

    // Si empieza con # buscamos por ID.
    // Si no, buscamos por código de barras.
    let url

    if (busqueda.startsWith("#")) {
      const id = busqueda.substring(1)

      if (!id) {
        setError("Ingresá un ID de producto")
        return
      }

      url = `http://localhost:3000/productos/${id}`
    } else {
      url = `http://localhost:3000/productos/codigo-barra/${busqueda}`
    }

    const respuesta = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se encontró el producto"
      )
    }

    // AGREGAR AL CARRITO
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === datos.id
      )

      // Si ya está en el carrito, sumamos 1
      if (productoExistente) {
        const nuevaCantidad =
          productoExistente.cantidad + 1

        // No dejamos superar el stock
        if (nuevaCantidad > Number(datos.stockActual)) {
          setError(
            `No hay más stock disponible de ${datos.nombre}`
          )

          return carritoActual
        }

        return carritoActual.map((item) =>
          item.id === datos.id
            ? {
                ...item,
                cantidad: nuevaCantidad,
              }
            : item
        )
      }

      // No agregamos productos sin stock
      if (Number(datos.stockActual) <= 0) {
        setError(
          `${datos.nombre} no tiene stock disponible`
        )

        return carritoActual
      }

      // Si todavía no está en el carrito
      return [
        ...carritoActual,
        {
          ...datos,
          cantidad: 1,
        },
      ]
    })

    setCodigoBarra("")

  } catch (error) {
    console.error(error)
    setError(error.message)

  } finally {
    setBuscando(false)
  }
}
const quitarDelCarrito = (productoId) => {
  setCarrito((carritoActual) =>
    carritoActual.filter(
      (item) => item.id !== productoId
    )
  )
}
const calcularPrecio = (item) => {
  return formaPago === "EFECTIVO"
    ? Number(item.precioEfectivo)
    : Number(item.precioTarjeta)
}

const totalVenta = carrito.reduce((total, item) => {
  const precio = calcularPrecio(item)

  return total + precio * item.cantidad
}, 0)
const finalizarVenta = async () => {
  if (carrito.length === 0) {
    setError("No hay productos en la venta")
    return
  }

  try {
    setProcesandoVenta(true)
    setError("")

    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      "http://localhost:3000/ventas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          canal,
          formaPago,
          productos: carrito.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
          })),
        }),
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo registrar la venta"
      )
    }

    alert(
      `Venta #${datos.id} registrada correctamente`
    )

    // Empezamos una venta nueva
    setCarrito([])
    setCodigoBarra("")
    setFormaPago("EFECTIVO")
    setCanal("LOCAL")

  } catch (error) {
    console.error(error)
    setError(error.message)

  } finally {
    setProcesandoVenta(false)
  }
}
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Ventas
      </h1>

      <p className="mt-1 text-gray-500">
        Registrar una nueva venta
      </p>

      {/* BUSCADOR POR CÓDIGO DE BARRAS */}

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Buscar producto
        </h2>

        <form
          onSubmit={buscarProducto}
          className="mt-4 flex gap-3"
        >
          <input
            type="text"
            value={codigoBarra}
            onChange={(event) =>
              setCodigoBarra(event.target.value)
            }
            placeholder="Escanear o escribir código de barras"
            autoFocus
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            disabled={buscando}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg
                       font-medium hover:bg-purple-700
                       disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Agregar"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* PRODUCTO ENCONTRADO */}

      {carrito.length > 0 && (
  <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">
        Venta actual
      </h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Producto
            </th>

            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Presentación
            </th>

            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Cantidad
            </th>

            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Stock
            </th>

            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Efectivo
            </th>

            <th className="text-left px-5 py-3 text-sm text-gray-600">
              Tarjeta
            </th>
            <th className="text-left px-5 py-3 text-sm text-gray-600">
  Acción
</th>
          </tr>
        </thead>

        <tbody>
          {carrito.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-200"
            >
              <td className="px-5 py-4 font-medium text-gray-800">
                {item.nombre}
              </td>

              <td className="px-5 py-4 text-gray-600">
                {item.presentacion || "-"}
              </td>

              <td className="px-5 py-4 font-semibold">
                {item.cantidad}
                {item.unidadStock === "KILOGRAMO"
                  ? " kg"
                  : " un."}
              </td>

              <td className="px-5 py-4">
                {item.stockActual}
                {item.unidadStock === "KILOGRAMO"
                  ? " kg"
                  : " un."}
              </td>

              <td className="px-5 py-4">
                $
                {Number(
                  item.precioEfectivo
                ).toLocaleString("es-AR")}
              </td>

              <td className="px-5 py-4">
                $
                {Number(
                  item.precioTarjeta
                ).toLocaleString("es-AR")}
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => quitarDelCarrito(item.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Quitar
                </button>
              </td>
            </tr>
            
          ))}
        </tbody>

      </table>
    <div className="border-t border-gray-200 p-6">

  <div className="flex items-end justify-between gap-8">

    {/* CANAL DE VENTA */}

    <div>
      <p className="text-sm text-gray-500 mb-2">
        Canal de venta
      </p>

      <div className="flex gap-2">

        <button
          type="button"
          onClick={() => setCanal("LOCAL")}
          className={`px-5 py-2.5 rounded-lg font-medium ${
            canal === "LOCAL"
              ? "bg-purple-700 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Local
        </button>

        <button
          type="button"
          onClick={() => setCanal("ONLINE")}
          className={`px-5 py-2.5 rounded-lg font-medium ${
            canal === "ONLINE"
              ? "bg-purple-700 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Online
        </button>

      </div>
    </div>


    {/* FORMA DE PAGO */}

    <div>
      <p className="text-sm text-gray-500 mb-2">
        Forma de pago
      </p>

      <div className="flex gap-2">

        <button
          type="button"
          onClick={() =>
            setFormaPago("EFECTIVO")
          }
          className={`px-5 py-2.5 rounded-lg font-medium ${
            formaPago === "EFECTIVO"
              ? "bg-purple-700 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Efectivo
        </button>

        <button
          type="button"
          onClick={() =>
            setFormaPago("TARJETA")
          }
          className={`px-5 py-2.5 rounded-lg font-medium ${
            formaPago === "TARJETA"
              ? "bg-purple-700 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Tarjeta
        </button>

      </div>
    </div>


    {/* TOTAL */}

    <div className="text-right">

      <p className="text-sm text-gray-500">
        Total
      </p>

      <p className="text-3xl font-bold text-gray-800">
        $
        {totalVenta.toLocaleString(
          "es-AR"
        )}
      </p>

    </div>

  </div>

</div>
    </div>
  </div>
)}
<button
  type="button"
  onClick={finalizarVenta}
  disabled={
    carrito.length === 0 ||
    procesandoVenta
  }
  className="mt-5 w-full bg-green-600 text-white py-3 rounded-lg
             font-semibold text-lg hover:bg-green-700
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {procesandoVenta
    ? "Registrando venta..."
    : "Finalizar venta"}
</button>
    </div>
  )
}

export default Ventas