import { useState } from "react"

function Stock() {
  const [codigoBarra, setCodigoBarra] = useState("")
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState("")
  const [buscando, setBuscando] = useState(false)

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

</div>
        </div>
      )}
    </div>
  )
}

export default Stock