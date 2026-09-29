import { useState } from "react"

function Stock() {
  const [codigoBarra, setCodigoBarra] = useState("")
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState("")
  const [buscando, setBuscando] = useState(false)
  const [mostrarEntrada, setMostrarEntrada] = useState(false)
  const [mostrarSalida, setMostrarSalida] = useState(false)
  const [cantidadSalida, setCantidadSalida] = useState("")
  const [cantidadEntrada, setCantidadEntrada] = useState("")
const [costoEntrada, setCostoEntrada] = useState("")
const [precioEfectivoEntrada, setPrecioEfectivoEntrada] = useState("")
const [precioTarjetaEntrada, setPrecioTarjetaEntrada] = useState("")

  const buscarProducto = async (event) => {
    event.preventDefault()

    if (!codigoBarra.trim()) {
      setError("Ingresá un código de barras")
      return
    }

    try {
      setBuscando(true)
      setError("")
      setProducto(null)

      const token = localStorage.getItem("token")

      const respuesta = await fetch(
        `http://localhost:3000/productos/codigo-barra/${encodeURIComponent(
          codigoBarra.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo buscar el producto"
        )
      }

      setProducto(datos)
      setCodigoBarra("")

    } catch (error) {
      console.error(error)
      setError(error.message)

    } finally {
      setBuscando(false)
    }
  }
  const registrarEntrada = async () => {
  if (!cantidadEntrada || Number(cantidadEntrada) <= 0) {
    alert("Ingresá una cantidad válida")
    return
  }

  try {
    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      "http://localhost:3000/movimientos/entrada",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: cantidadEntrada,
          costoCompra: costoEntrada,
          precioEfectivo: precioEfectivoEntrada,
          precioTarjeta: precioTarjetaEntrada,
          proveedorId: producto.proveedorId,
        }),
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo registrar la entrada"
      )
    }

    // Volvemos a consultar el producto para mostrar
    // el stock y los precios ya actualizados
    const respuestaProducto = await fetch(
      `http://localhost:3000/productos/${producto.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const productoActualizado = await respuestaProducto.json()

    if (!respuestaProducto.ok) {
      throw new Error(
        productoActualizado.error ||
          "La entrada se registró, pero no se pudo actualizar la pantalla"
      )
    }

    setProducto(productoActualizado)
    setMostrarEntrada(false)

    alert("Entrada registrada correctamente")

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
const registrarSalida = async () => {
  if (!cantidadSalida || Number(cantidadSalida) <= 0) {
    alert("Ingresá una cantidad válida")
    return
  }

  if (Number(cantidadSalida) > Number(producto.stockActual)) {
    alert("No hay stock suficiente")
    return
  }

  try {
    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      "http://localhost:3000/movimientos/salida",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productoId: producto.id,
          cantidad: cantidadSalida,
        }),
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo registrar la salida"
      )
    }

    // Consultamos nuevamente el producto
    // para mostrar el stock actualizado
    const respuestaProducto = await fetch(
      `http://localhost:3000/productos/${producto.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const productoActualizado =
      await respuestaProducto.json()

    if (!respuestaProducto.ok) {
      throw new Error(
        productoActualizado.error ||
          "La salida se registró, pero no se pudo actualizar la pantalla"
      )
    }

    setProducto(productoActualizado)
    setCantidadSalida("")
    setMostrarSalida(false)

    alert("Salida registrada correctamente")

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Stock
      </h1>

      <p className="mt-1 text-gray-500">
        Entradas, salidas y control de mercadería
      </p>

      {/* BUSCADOR */}

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
            placeholder="Escanear o ingresar código de barras"
            autoFocus
            className="flex-1 border border-gray-300 rounded-lg
                       px-4 py-2.5 outline-none
                       focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={buscando}
            className="bg-purple-700 text-white px-6 py-2.5
                       rounded-lg font-medium
                       hover:bg-purple-800 transition
                       disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* PRODUCTO ENCONTRADO */}

      {producto && (
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Producto encontrado
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-800">
            {producto.nombre}
          </h2>

          <p className="mt-2 text-gray-600">
            Presentación: {producto.presentacion || "-"}
          </p>

          <div className="mt-5">
            <p className="text-sm text-gray-500">
              Stock actual
            </p>

            <p className="text-3xl font-bold text-purple-700">
              {producto.stockActual}{" "}
              {producto.unidadStock === "KILOGRAMO"
                ? "kg"
                : "unidades"}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">

  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Precio efectivo
    </p>

    <p className="mt-1 text-xl font-bold text-gray-800">
      ${Number(producto.precioEfectivo).toLocaleString("es-AR")}
    </p>
  </div>

  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Precio tarjeta
    </p>

    <p className="mt-1 text-xl font-bold text-gray-800">
      ${Number(producto.precioTarjeta).toLocaleString("es-AR")}
    </p>
  </div>
  <div className="mt-6 flex gap-3">
 <button
  type="button"
  onClick={() => {
  setCantidadEntrada("")
  setCostoEntrada(producto.costoCompra ?? "")
  setPrecioEfectivoEntrada(producto.precioEfectivo ?? "")
  setPrecioTarjetaEntrada(producto.precioTarjeta ?? "")
  setMostrarEntrada(true)
  setMostrarSalida(false)
  
}}
  className="bg-green-600 text-white px-5 py-2.5
             rounded-lg font-medium
             hover:bg-green-700 transition"
>
  + Entrada de mercadería
</button>
<button
  type="button"
  onClick={() => {
    setCantidadSalida("")
    setMostrarEntrada(false)
    setMostrarSalida(true)
  }}
  className="bg-red-600 text-white px-5 py-2.5
             rounded-lg font-medium
             hover:bg-red-700 transition"
>
  - Registrar salida
</button>


</div>
{mostrarEntrada && (
  <div className="mt-6 border-t pt-6">

    <h3 className="text-lg font-semibold text-gray-800">
      Entrada de mercadería
    </h3>

    <div className="mt-4 grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Cantidad que ingresa
        </label>

       <input
  type="number"
  step="0.001"
  min="0"
  value={cantidadEntrada}
  onChange={(event) => setCantidadEntrada(event.target.value)}
  className="w-full border border-gray-300 rounded-lg
             px-3 py-2 outline-none
             focus:ring-2 focus:ring-green-500"
/>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Costo de compra
        </label>

       <input
  type="number"
  step="0.01"
  min="0"
  value={costoEntrada}
  onChange={(event) => setCostoEntrada(event.target.value)}
  className="w-full border border-gray-300 rounded-lg
             px-3 py-2 outline-none
             focus:ring-2 focus:ring-green-500"
/>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Precio efectivo
        </label>

       <input
  type="number"
  step="0.01"
  min="0"
  value={precioEfectivoEntrada}
  onChange={(event) =>
    setPrecioEfectivoEntrada(event.target.value)
  }
  className="w-full border border-gray-300 rounded-lg
             px-3 py-2 outline-none
             focus:ring-2 focus:ring-green-500"
/>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Precio tarjeta
        </label>

        <input
  type="number"
  step="0.01"
  min="0"
  value={precioTarjetaEntrada}
  onChange={(event) =>
    setPrecioTarjetaEntrada(event.target.value)
  }
  className="w-full border border-gray-300 rounded-lg
             px-3 py-2 outline-none
             focus:ring-2 focus:ring-green-500"
/>
      </div>

    </div>

    <div className="mt-5 flex gap-3">

      <button
        type="button"
        onClick={() => setMostrarEntrada(false)}
        className="border border-gray-300 px-4 py-2
                   rounded-lg hover:bg-gray-50"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={registrarEntrada}
        className="bg-green-600 text-white px-5 py-2
                   rounded-lg font-medium
                   hover:bg-green-700"
      >
        Registrar entrada
      </button>

    </div>

  </div>
)}
{mostrarSalida && (
  <div className="mt-6 border-t pt-6">

    <h3 className="text-lg font-semibold text-gray-800">
      Registrar salida de stock
    </h3>

    <div className="mt-4 max-w-sm">
      <label className="block text-sm text-gray-600 mb-1">
        Cantidad saliente 
      </label>

      <input
        type="number"
        step="0.001"
        min="0"
        value={cantidadSalida}
        onChange={(event) =>
          setCantidadSalida(event.target.value)
        }
        className="w-full border border-gray-300 rounded-lg
                   px-3 py-2 outline-none
                   focus:ring-2 focus:ring-red-500"
      />

      <p className="mt-2 text-sm text-gray-500">
        Stock disponible: {producto.stockActual}{" "}
        {producto.unidadStock === "KILOGRAMO"
          ? "kg"
          : "unidades"}
      </p>
    </div>

    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={() => setMostrarSalida(false)}
        className="border border-gray-300 px-4 py-2
                   rounded-lg hover:bg-gray-50"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={registrarSalida}
        className="bg-red-600 text-white px-5 py-2
                   rounded-lg font-medium
                   hover:bg-red-700"
      >
        Registrar salida
      </button>
    </div>

  </div>
)}

</div>
        </div>
      )}
    </div>
  )
}

export default Stock