import { useEffect, useState } from "react"
import FormularioAgregarProducto from "../../components/productos/FormularioAgregarProducto"
import FormularioEditarProducto from "../../components/productos/FormularioEditarProducto"

function Productos() {
const [productos, setProductos] = useState([])
const [cargando, setCargando] = useState(true)
const [error, setError] = useState("")
const [mostrarFormulario, setMostrarFormulario] = useState(false)

const [proveedores, setProveedores] = useState([])
const [marcas, setMarcas] = useState([])
const [categorias, setCategorias] = useState([])
const [productoEditando, setProductoEditando] = useState(null)




  // =========================
  // CARGAR PRODUCTOS
  // =========================

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem("token")

        const respuesta = await fetch(
          "http://localhost:3000/productos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener los productos"
          )
        }

        const datos = await respuesta.json()

        setProductos(datos)

      } catch (error) {
        console.error(error)
        setError("No se pudieron cargar los productos")

      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])


  // =========================
  // DATOS PARA NUEVO PRODUCTO
  // =========================

  const cargarDatosFormulario = async () => {
    try {
      const token = localStorage.getItem("token")

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        respuestaProveedores,
        respuestaMarcas,
        respuestaCategorias,
      ] = await Promise.all([
        fetch(
          "http://localhost:3000/proveedores",
          { headers }
        ),

        fetch(
          "http://localhost:3000/marcas",
          { headers }
        ),

        fetch(
          "http://localhost:3000/categorias",
          { headers }
        ),
      ])

      if (
        !respuestaProveedores.ok ||
        !respuestaMarcas.ok ||
        !respuestaCategorias.ok
      ) {
        throw new Error(
          "No se pudieron cargar los datos del formulario"
        )
      }

      const datosProveedores =
        await respuestaProveedores.json()

      const datosMarcas =
        await respuestaMarcas.json()

      const datosCategorias =
        await respuestaCategorias.json()

      setProveedores(datosProveedores)
      setMarcas(datosMarcas)
      setCategorias(datosCategorias)

      setMostrarFormulario(true)

    } catch (error) {
      console.error(error)

      setError(
        "No se pudieron cargar los datos del formulario"
      )
    }
  }
  const abrirEdicion = async (producto) => {
  try {
    const token = localStorage.getItem("token")

    const [respuestaProveedores, respuestaMarcas, respuestaCategorias] =
      await Promise.all([
        fetch("http://localhost:3000/proveedores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:3000/marcas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:3000/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

    if (
      !respuestaProveedores.ok ||
      !respuestaMarcas.ok ||
      !respuestaCategorias.ok
    ) {
      throw new Error(
        "No se pudieron cargar los datos para editar el producto"
      )
    }

    const datosProveedores = await respuestaProveedores.json()
    const datosMarcas = await respuestaMarcas.json()
    const datosCategorias = await respuestaCategorias.json()

    setProveedores(datosProveedores)
    setMarcas(datosMarcas)
    setCategorias(datosCategorias)

    setProductoEditando(producto)
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}


  // =========================
  // CARGANDO
  // =========================

  if (cargando) {
    return (
      <p className="text-gray-500">
        Cargando productos...
      </p>
    )
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <p className="text-red-600">
        {error}
      </p>
    )
  }


  // =========================
  // PANTALLA
  // =========================

  return (
    <div>

      {/* ENCABEZADO */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Productos
          </h1>

          <p className="mt-1 text-gray-500">
            Productos registrados en AMOR ANIMAL
          </p>
        </div>


        <button
          onClick={cargarDatosFormulario}
          className="bg-purple-700 text-white px-5 py-2.5 rounded-lg
                     font-medium hover:bg-purple-800 transition"
        >
          + Nuevo producto
        </button>

      </div>


      {/* LISTADO DE PRODUCTOS */}

      {productos.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            Todavía no hay productos registrados.
          </p>

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>
                <th className="px-5 py-3">
                  Producto
                </th>

                <th className="px-5 py-3">
                  Presentación
                </th>

                <th className="px-5 py-3">
                  Stock
                </th>

                <th className="px-5 py-3">
                  Efectivo
                </th>

                <th className="px-5 py-3">
                  Tarjeta
                </th>

                <th className="px-5 py-3">
                  Estado
                </th>
                <th className="px-5 py-3">
                   Acciones
                </th>
              </tr>

            </thead>


            <tbody>

              {productos.map((producto) => (

                <tr
                  key={producto.id}
                  className="border-b border-gray-100"
                >

                  <td className="px-5 py-4 font-medium text-gray-800">
                    {producto.nombre}
                  </td>


                  <td className="px-5 py-4 text-gray-600">
                    {producto.presentacion || "-"}
                  </td>


                  <td className="px-5 py-4 text-gray-600">

                    {producto.stockActual}{" "}

                    {producto.unidadStock === "KILOGRAMO"
                      ? "kg"
                      : "u."}

                  </td>


                  <td className="px-5 py-4 text-gray-600">
                    ${producto.precioEfectivo}
                  </td>


                  <td className="px-5 py-4 text-gray-600">
                    ${producto.precioTarjeta}
                  </td>


                  <td className="px-5 py-4">

                    {producto.activo ? (

                      <span className="text-green-700 font-medium">
                        Activo
                      </span>

                    ) : (

                      <span className="text-red-600 font-medium">
                        Inactivo
                      </span>

                    )}

                  </td>
                  <td className="px-5 py-4">
  <button
  type="button"
 onClick={() => abrirEdicion(producto)}
  className="text-purple-700 hover:text-purple-900 font-medium"
>
  Editar
</button>
</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}
{/* FORMULARIO AGREGAR PRODUCTO */}

{mostrarFormulario && (
  <FormularioAgregarProducto
    proveedores={proveedores}
    marcas={marcas}
    categorias={categorias}
    onCerrar={() => setMostrarFormulario(false)}
    onProductoCreado={(producto) =>
      setProductos((productosActuales) => [
        ...productosActuales,
        producto,
      ])
    }
  />
)}


{/* FORMULARIO EDITAR PRODUCTO */}

{productoEditando && (
  <FormularioEditarProducto
    producto={productoEditando}
    proveedores={proveedores}
    marcas={marcas}
    categorias={categorias}
    onCerrar={() => setProductoEditando(null)}
    onProductoActualizado={(productoActualizado) => {
      setProductos((productosActuales) =>
        productosActuales.map((producto) =>
          producto.id === productoActualizado.id
            ? productoActualizado
            : producto
        )
      )

      setProductoEditando(null)
    }}
  />
)}


    </div>
  )
}

export default Productos