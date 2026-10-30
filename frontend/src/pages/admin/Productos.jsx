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
const [busqueda, setBusqueda] = useState("")
const [productoSeleccionado, setProductoSeleccionado] = useState(null)

const productosFiltrados = productos.filter((producto) =>
  producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
  String(producto.id).includes(busqueda.trim().replace("#", "")) ||
  String(producto.codigoBarra || "").includes(busqueda.trim())
)




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
const productosOrdenados = [...datos].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es", {
    sensitivity: "base",
  })
)

setProductos(productosOrdenados)

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
// CONFIGURAR VENTA SIN STOCK
// =========================

const configurarVentaSinStock = async (
  producto,
  ventaSinStock,
  diasDisponibilidad = null
) => {
  try {
    const token = localStorage.getItem("token")

    const respuesta = await fetch(
      `http://localhost:3000/productos/${producto.id}/venta-sin-stock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ventaSinStock,
          diasDisponibilidad,
        }),
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo modificar la venta sin stock"
      )
    }

    setProductos((productosActuales) =>
      productosActuales.map((productoActual) =>
        productoActual.id === datos.id
          ? datos
          : productoActual
      )
    )

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
// =========================
// CAMBIAR ESTADO DEL PRODUCTO
// =========================

const cambiarEstadoProducto = async (producto) => {
  try {
    const token = localStorage.getItem("token")

    const accion = producto.activo
      ? "desactivar"
      : "reactivar"

    const respuesta = await fetch(
      `http://localhost:3000/productos/${producto.id}/${accion}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo cambiar el estado del producto"
      )
    }

    setProductos((productosActuales) =>
      productosActuales.map((productoActual) =>
        productoActual.id === datos.id
          ? datos
          : productoActual
      )
    )

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


      {/* BUSCAR PRODUCTOS */}

      <div className="mb-5 rounded-xl bg-white p-4 shadow">
        <label htmlFor="buscar-producto" className="mb-2 block font-medium text-gray-700">
          Buscar producto por nombre, ID o código de barras
        </label>
        <input
          id="buscar-producto"
          type="text"
          value={busqueda}
          onChange={(event) => {
            setBusqueda(event.target.value)
            setProductoSeleccionado(null)
          }}
          placeholder="Ej.: Royal Canin, alimento adulto, #12..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
        />
        {busqueda.trim() && (
          <p className="mt-2 text-sm text-gray-500">
            {productosFiltrados.length} producto(s) encontrado(s)
          </p>
        )}
      </div>

      {/* FICHA DEL PRODUCTO SELECCIONADO */}

      {productoSeleccionado && (
        <div className="mb-6 rounded-xl border border-purple-200 bg-white p-6 shadow">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-purple-700">FICHA DEL PRODUCTO · #{productoSeleccionado.id}</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-800">{productoSeleccionado.nombre}</h2>
            </div>
            <button
              type="button"
              onClick={() => abrirEdicion(productoSeleccionado)}
              className="rounded-lg bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800"
            >
              Editar producto
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><p className="text-sm text-gray-500">Presentación</p><p className="font-medium text-gray-800">{productoSeleccionado.presentacion || "-"}</p></div>
            <div><p className="text-sm text-gray-500">Código de barras</p><p className="font-medium text-gray-800">{productoSeleccionado.codigoBarra || "-"}</p></div>
            <div><p className="text-sm text-gray-500">Stock actual</p><p className="font-medium text-gray-800">{productoSeleccionado.stockActual} {productoSeleccionado.unidadStock === "KILOGRAMO" ? "kg" : "u."}</p></div>
            <div><p className="text-sm text-gray-500">Costo de compra</p><p className="font-medium text-gray-800">${productoSeleccionado.costoCompra ?? "-"}</p></div>
            <div><p className="text-sm text-gray-500">Precio en efectivo</p><p className="font-medium text-gray-800">${productoSeleccionado.precioEfectivo ?? "-"}</p></div>
            <div><p className="text-sm text-gray-500">Precio con tarjeta</p><p className="font-medium text-gray-800">${productoSeleccionado.precioTarjeta ?? "-"}</p></div>
            <div><p className="text-sm text-gray-500">Marca (ID)</p><p className="font-medium text-gray-800">{productoSeleccionado.marcaId ?? "-"}</p></div>
            <div><p className="text-sm text-gray-500">Proveedor (ID)</p><p className="font-medium text-gray-800">{productoSeleccionado.proveedorId ?? "-"}</p></div>
            <div><p className="text-sm text-gray-500">Estado</p><p className="font-medium text-gray-800">{productoSeleccionado.activo ? "Activo" : "Inactivo"}</p></div>
            <div><p className="text-sm text-gray-500">Venta por encargo sin stock</p><p className="font-medium text-gray-800">{productoSeleccionado.ventaSinStock ? "Sí" : "No"}</p></div>
            {productoSeleccionado.diasDisponibilidad != null && (
              <div><p className="text-sm text-gray-500">Días de disponibilidad</p><p className="font-medium text-gray-800">{productoSeleccionado.diasDisponibilidad}</p></div>
            )}
            {productoSeleccionado.imagenUrl && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-500">Imagen del producto</p>
                <a href={productoSeleccionado.imagenUrl} target="_blank" rel="noreferrer" className="break-all text-purple-700 underline">Ver imagen</a>
              </div>
            )}
          </div>
        </div>
      )}

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
                  ID
                </th>
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

              {productosFiltrados.map((producto) => (

                <tr
                  key={producto.id}
                  className="border-b border-gray-100"
                >
<td className="px-5 py-4 font-semibold text-purple-700">
  #{producto.id}
</td>
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

                   <button
  type="button"
  onClick={() => cambiarEstadoProducto(producto)}
  className={
    producto.activo
      ? "text-red-600 hover:text-red-800 font-medium"
      : "text-green-700 hover:text-green-900 font-medium"
  }
>
  {producto.activo
    ? "Dejar de vender"
    : "Volver a vender"}
</button>

                  </td>
   <td className="px-5 py-4">
  <div className="flex flex-col items-start gap-2">

    <button
      type="button"
      onClick={() => setProductoSeleccionado(producto)}
      className="text-blue-700 hover:text-blue-900 font-medium"
    >
      Ver ficha
    </button>

    <button
      type="button"
      onClick={() => abrirEdicion(producto)}
      className="text-purple-700 hover:text-purple-900 font-medium"
    >
      Editar
    </button>

   {producto.ventaSinStock ? (
  <button
    type="button"
    onClick={() =>
      configurarVentaSinStock(
        producto,
        false
      )
    }
    className="text-green-700 font-medium"
  >
    Se vende por encargo
  </button>
) : (
  <button
    type="button"
    onClick={() => {
      const dias = window.prompt(
        "¿En cuántos días estará disponible este producto?"
      )

      if (dias === null) {
        return
      }

      configurarVentaSinStock(
        producto,
        true,
        dias
      )
    }}
    className="text-gray-500 hover:text-blue-700 font-medium"
  >
    No se vende por encargo
  </button>
)}
  </div>
</td>

                </tr>

              ))}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                    No se encontraron productos con esa búsqueda.
                  </td>
                </tr>
              )}

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