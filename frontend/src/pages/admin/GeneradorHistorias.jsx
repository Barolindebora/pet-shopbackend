import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import TarjetaHistoria from "../../components/TarjetaHistoria"

function GeneradorHistorias() {
  const [busqueda, setBusqueda] = useState("")
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState("")
  const [buscando, setBuscando] = useState(false)
  const tarjetaRef = useRef(null)
const [descargando, setDescargando] = useState(false)

  const buscarProducto = async (event) => {
    event.preventDefault()

    const valor = busqueda.trim()
    if (!valor) return

    setError("")
    setProducto(null)
    setBuscando(true)

    try {
      const token = localStorage.getItem("token")

      const esId = valor.startsWith("#")
      const identificador = esId
        ? valor.slice(1)
        : valor

      if (esId && !/^[1-9]\d*$/.test(identificador)) {
        throw new Error("Ingresá un ID válido, por ejemplo #10")
      }

      const url = esId
        ? `http://localhost:3000/productos/${identificador}`
        : `http://localhost:3000/productos/codigo-barra/${encodeURIComponent(identificador)}`

      const respuesta = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos || !datos.id) {
        throw new Error("No se encontró el producto")
      }

      setProducto(datos)
    } catch (error) {
      setError(error.message)
    } finally {
      setBuscando(false)
    }
  }
  const descargarHistoria = async () => {
  if (!tarjetaRef.current || !producto) return

  try {
    setDescargando(true)
    setError("")

    const dataUrl = await toPng(tarjetaRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
    })

    const enlace = document.createElement("a")
    enlace.download = `amor-animal-producto-${producto.id}.png`
    enlace.href = dataUrl
    enlace.click()

  } catch (error) {
    console.error(error)
    setError("No se pudo generar el PNG. Revisá las imágenes del producto.")
  } finally {
    setDescargando(false)
  }
}

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Generador de historias
      </h1>

      <p className="mt-1 text-gray-500">
        Creá publicaciones de productos para Instagram
      </p>

      <form
        onSubmit={buscarProducto}
        className="mt-6 flex gap-3"
      >
        <input
          type="text"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Código de barras o #ID"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white"
        />

        <button
          type="submit"
          disabled={buscando}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 disabled:opacity-50"
        >
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {producto && (
  <div className="mt-8 flex flex-col items-center gap-5">

    <div ref={tarjetaRef}>
      <TarjetaHistoria producto={producto} />
    </div>

    <button
      type="button"
      onClick={descargarHistoria}
      disabled={descargando}
      className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50"
    >
      {descargando
        ? "Generando PNG..."
        : "Descargar historia PNG"}
    </button>

  </div>
)}
    </div>
  )
}

export default GeneradorHistorias