import { useEffect, useState } from "react"

function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
const [nombreMarca, setNombreMarca] = useState("")
const [guardando, setGuardando] = useState(false)
const [marcaEditando, setMarcaEditando] = useState(null)
const [nombreEditado, setNombreEditado] = useState("")
const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  // =====================================================
  // CARGAR MARCAS
  // =====================================================

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const token = localStorage.getItem("token")

        const respuesta = await fetch(
          "http://localhost:3000/marcas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok) {
          throw new Error(
            datos.error ||
              "No se pudieron cargar las marcas"
          )
        }

        // Orden alfabético
        const marcasOrdenadas = [...datos].sort(
          (a, b) =>
            a.nombre.localeCompare(
              b.nombre,
              "es",
              {
                sensitivity: "base",
              }
            )
        )

        setMarcas(marcasOrdenadas)

      } catch (error) {
        console.error(error)
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarMarcas()
  }, [])
  const crearMarca = async (event) => {
  event.preventDefault()

  const nombre = nombreMarca.trim()

  if (!nombre) {
    setError("Ingresá el nombre de la marca")
    return
  }

  try {
    setGuardando(true)
    setError("")

    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      "http://localhost:3000/marcas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
        }),
      }
    )

    const nuevaMarca = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        nuevaMarca.error ||
          "No se pudo crear la marca"
      )
    }

    setMarcas((marcasActuales) =>
      [...marcasActuales, nuevaMarca].sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre,
            "es",
            {
              sensitivity: "base",
            }
          )
      )
    )

    setNombreMarca("")
    setMostrarFormulario(false)

  } catch (error) {
    console.error(error)
    setError(error.message)

  } finally {
    setGuardando(false)
  }
}
const editarMarca = async (event) => {
  event.preventDefault()

  const nombre = nombreEditado.trim()

  if (!nombre) {
    setError("Ingresá el nombre de la marca")
    return
  }

  try {
    setGuardandoEdicion(true)
    setError("")

    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      `http://localhost:3000/marcas/${marcaEditando.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
        }),
      }
    )

    const marcaActualizada =
      await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        marcaActualizada.error ||
          "No se pudo editar la marca"
      )
    }

    setMarcas((marcasActuales) =>
      marcasActuales
        .map((marca) =>
          marca.id === marcaActualizada.id
            ? marcaActualizada
            : marca
        )
        .sort((a, b) =>
          a.nombre.localeCompare(
            b.nombre,
            "es",
            {
              sensitivity: "base",
            }
          )
        )
    )

    setMarcaEditando(null)
    setNombreEditado("")

  } catch (error) {
    console.error(error)
    setError(error.message)

  } finally {
    setGuardandoEdicion(false)
  }
}
  // =====================================================
  // INTERFAZ
  // =====================================================

  return (
    <div>

     <div className="flex items-center justify-between">

  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Marcas
    </h1>

    <p className="mt-1 text-gray-500">
      Administrar las marcas de productos
    </p>
  </div>

  <button
    type="button"
    onClick={() => {
      setMostrarFormulario(
        !mostrarFormulario
      )
      setError("")
    }}
    className="bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-800"
  >
    + Nueva marca
  </button>

</div>
{mostrarFormulario && (

  <div className="mt-6 bg-white rounded-xl shadow p-6">

    <h2 className="text-lg font-semibold text-gray-800">
      Nueva marca
    </h2>

    <form
      onSubmit={crearMarca}
      className="mt-4 flex gap-3"
    >

      <input
        type="text"
        value={nombreMarca}
        onChange={(event) =>
          setNombreMarca(event.target.value)
        }
        placeholder="Nombre de la marca"
        autoFocus
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
      />

      <button
        type="submit"
        disabled={guardando}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {guardando
          ? "Guardando..."
          : "Guardar"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMostrarFormulario(false)
          setNombreMarca("")
          setError("")
        }}
        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
      >
        Cancelar
      </button>

    </form>

  </div>

)}
{marcaEditando && (

  <div className="mt-6 bg-white rounded-xl shadow p-6">

    <h2 className="text-lg font-semibold text-gray-800">
      Editar marca
    </h2>

    <form
      onSubmit={editarMarca}
      className="mt-4 flex gap-3"
    >

      <input
        type="text"
        value={nombreEditado}
        onChange={(event) =>
          setNombreEditado(
            event.target.value
          )
        }
        autoFocus
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
      />

      <button
        type="submit"
        disabled={guardandoEdicion}
        className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 disabled:opacity-50"
      >
        {guardandoEdicion
          ? "Guardando..."
          : "Guardar cambios"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMarcaEditando(null)
          setNombreEditado("")
          setError("")
        }}
        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
      >
        Cancelar
      </button>

    </form>

  </div>

)}


      {/* CARGANDO */}

      {cargando && (
        <p className="mt-6 text-gray-500">
          Cargando marcas...
        </p>
      )}


      {/* ERROR */}

      {error && (
        <p className="mt-6 text-red-600">
          {error}
        </p>
      )}


      {/* TABLA */}

      {!cargando && !error && (
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>

                <th className="text-left px-5 py-3 text-sm text-gray-600">
                  ID
                </th>

                <th className="text-left px-5 py-3 text-sm text-gray-600">
                  Marca
                </th>

                <th className="text-left px-5 py-3 text-sm text-gray-600">
                  Estado
                </th>
                <th className="text-right px-5 py-3 text-sm text-gray-600">
  Acciones
</th>

              </tr>
            </thead>

            <tbody>

              {marcas.length === 0 ? (

                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-6 text-center text-gray-500"
                  >
                    Todavía no hay marcas registradas.
                  </td>
                </tr>

              ) : (

                marcas.map((marca) => (

                  <tr
                    key={marca.id}
                    className="border-t border-gray-200"
                  >

                    <td className="px-5 py-4 font-semibold text-purple-700">
                      #{marca.id}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {marca.nombre}
                    </td>

                    <td className="px-5 py-4">

                      {marca.activo ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          Activa
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500">
                          Inactiva
                        </span>
                      )}

                    </td>
<td className="px-5 py-4 text-right">

  <button
    type="button"
    onClick={() => {
      setMarcaEditando(marca)
      setNombreEditado(marca.nombre)
      setError("")
    }}
    className="text-purple-700 hover:text-purple-900 font-medium"
  >
    Editar
  </button>

</td>
                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}

export default Marcas