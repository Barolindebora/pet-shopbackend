import { useEffect, useState } from "react"

function Reposicion() {
  const [reposiciones, setReposiciones] = useState([])
  const [productos, setProductos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Editar cantidad
  const [reposicionEditando, setReposicionEditando] = useState(null)
  const [cantidadEditando, setCantidadEditando] = useState("")

  // Agregar producto manualmente
  const [mostrarAgregar, setMostrarAgregar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState("")
  const [cantidadNueva, setCantidadNueva] = useState("")

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token")

        // Reposiciones
        const respuestaReposiciones = await fetch(
          "http://localhost:3000/reposiciones",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const datosReposiciones =
          await respuestaReposiciones.json()

        if (!respuestaReposiciones.ok) {
          throw new Error(
            datosReposiciones.error ||
              "No se pudo cargar la lista de reposición"
          )
        }

        // Productos
        const respuestaProductos = await fetch(
          "http://localhost:3000/productos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const datosProductos =
          await respuestaProductos.json()

        if (!respuestaProductos.ok) {
          throw new Error(
            datosProductos.error ||
              "No se pudieron cargar los productos"
          )
        }

        setReposiciones(datosReposiciones)
        setProductos(datosProductos)

      } catch (error) {
        console.error(error)
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  // =====================================================
  // AGRUPAR REPOSICIONES POR PROVEEDOR
  // =====================================================

  const reposicionesPorProveedor = reposiciones.reduce(
    (grupos, reposicion) => {
      const proveedorId = reposicion.proveedorId

      if (!grupos[proveedorId]) {
        grupos[proveedorId] = {
          proveedor: reposicion.proveedor,
          productos: [],
        }
      }

      grupos[proveedorId].productos.push(reposicion)

      return grupos
    },
    {}
  )

  // =====================================================
  // EDITAR CANTIDAD
  // =====================================================

  const guardarCantidad = async () => {
    if (!cantidadEditando || Number(cantidadEditando) <= 0) {
      alert("Ingresá una cantidad válida")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const respuesta = await fetch(
        `http://localhost:3000/reposiciones/${reposicionEditando.id}/cantidad`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cantidadAReponer: cantidadEditando,
          }),
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo modificar la cantidad"
        )
      }

      setReposiciones((reposicionesActuales) =>
        reposicionesActuales.map((reposicion) =>
          reposicion.id === reposicionEditando.id
            ? {
                ...reposicion,
                cantidadAReponer: cantidadEditando,
              }
            : reposicion
        )
      )

      setReposicionEditando(null)
      setCantidadEditando("")

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  // =====================================================
  // AGREGAR PRODUCTO MANUALMENTE
  // =====================================================

  const agregarProductoReposicion = async () => {
    if (!productoSeleccionado) {
      alert("Seleccioná un producto")
      return
    }

    if (!cantidadNueva || Number(cantidadNueva) <= 0) {
      alert("Ingresá una cantidad válida")
      return
    }

    const producto = productos.find(
      (producto) =>
        producto.id === Number(productoSeleccionado)
    )

    if (!producto) {
      alert("No se encontró el producto seleccionado")
      return
    }

    // Evitar productos duplicados
    const yaEstaEnReposicion = reposiciones.some(
      (reposicion) =>
        reposicion.productoId === producto.id
    )

    if (yaEstaEnReposicion) {
      alert(
        "Este producto ya está en la lista de reposición. Podés modificar su cantidad desde Editar."
      )
      return
    }

    try {
      const token = localStorage.getItem("token")

      const respuesta = await fetch(
        "http://localhost:3000/reposiciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productoId: producto.id,
            proveedorId: producto.proveedorId,
            cantidadAReponer: cantidadNueva,
          }),
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo agregar el producto a reposición"
        )
      }

      // Volvemos a consultar para obtener
      // producto y proveedor completos
      const respuestaReposiciones = await fetch(
        "http://localhost:3000/reposiciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const reposicionesActualizadas =
        await respuestaReposiciones.json()

      if (!respuestaReposiciones.ok) {
        throw new Error(
          reposicionesActualizadas.error ||
            "El producto se agregó, pero no se pudo actualizar la lista"
        )
      }

      setReposiciones(reposicionesActualizadas)

      setProductoSeleccionado("")
      setCantidadNueva("")
      setMostrarAgregar(false)

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }
  const marcarPedidoRealizado = async (grupo) => {
  const confirmar = window.confirm(
    `¿Confirmás que ya realizaste el pedido a ${grupo.proveedor.nombre}?`
  )

  if (!confirmar) {
    return
  }

  try {
    const token = localStorage.getItem("token")

    // Eliminamos de reposición todos los productos
    // correspondientes a este proveedor
    for (const reposicion of grupo.productos) {
      const respuesta = await fetch(
        `http://localhost:3000/reposiciones/${reposicion.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!respuesta.ok) {
        const datos = await respuesta.json()

        throw new Error(
          datos.error ||
            "No se pudo completar el pedido realizado"
        )
      }
    }

    // Sacamos de la pantalla las reposiciones
    // que pertenecían a este proveedor
    const idsEliminados = grupo.productos.map(
      (reposicion) => reposicion.id
    )

    setReposiciones((reposicionesActuales) =>
      reposicionesActuales.filter(
        (reposicion) =>
          !idsEliminados.includes(reposicion.id)
      )
    )

    alert(
      `Pedido a ${grupo.proveedor.nombre} marcado como realizado`
    )

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

  // =====================================================
  // INTERFAZ
  // =====================================================

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Lista de reposición
      </h1>

      <p className="mt-1 text-gray-500">
        Productos pendientes de reposición
      </p>

      {/* BOTÓN AGREGAR */}

      <button
        type="button"
        onClick={() => setMostrarAgregar(true)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg
                   font-medium hover:bg-purple-700"
      >
        + Agregar producto
      </button>

      {/* FORMULARIO AGREGAR */}

      {mostrarAgregar && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Agregar producto a reposición
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* PRODUCTO */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>

              <select
                value={productoSeleccionado}
                onChange={(event) =>
                  setProductoSeleccionado(event.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">
                  Seleccionar producto
                </option>

                {productos.map((producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.nombre}
                    {producto.presentacion
                      ? ` - ${producto.presentacion}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* CANTIDAD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad a reponer
              </label>

              <input
                type="number"
                step="0.001"
                min="0"
                value={cantidadNueva}
                onChange={(event) =>
                  setCantidadNueva(event.target.value)
                }
                placeholder="Cantidad"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

          </div>

          {/* BOTONES FORMULARIO */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setMostrarAgregar(false)
                setProductoSeleccionado("")
                setCantidadNueva("")
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg
                         text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={agregarProductoReposicion}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg
                         font-medium hover:bg-purple-700"
            >
              Agregar a reposición
            </button>
          </div>
        </div>
      )}

      {/* CARGANDO */}

      {cargando && (
        <p className="mt-6 text-gray-500">
          Cargando...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p className="mt-6 text-red-600">
          {error}
        </p>
      )}

      {/* LISTA */}

      {!cargando && !error && (
        <div className="mt-6 bg-white rounded-xl shadow p-6">

          {reposiciones.length === 0 ? (
            <p className="text-gray-500">
              No hay productos pendientes de reposición.
            </p>
          ) : (

            <div className="space-y-8">

              {Object.values(reposicionesPorProveedor).map(
                (grupo) => (
                  <div
                    key={grupo.proveedor.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >

                    {/* PROVEEDOR */}

                   <div className="bg-gray-100 px-5 py-4 flex items-center justify-between">
  <h2 className="text-lg font-bold text-gray-800">
    {grupo.proveedor.nombre}
  </h2>

  <button
    type="button"
    onClick={() => marcarPedidoRealizado(grupo)}
    className="bg-green-600 text-white px-4 py-2 rounded-lg
               font-medium hover:bg-green-700"
  >
    ✓ Pedido realizado
  </button>
</div>

                    {/* TABLA */}

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
                              Cantidad a reponer
                            </th>

                            <th className="text-left px-5 py-3 text-sm text-gray-600">
                              Acciones
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {grupo.productos.map(
                            (reposicion) => (
                              <tr
                                key={reposicion.id}
                                className="border-t border-gray-200"
                              >

                                {/* PRODUCTO */}

                                <td className="px-5 py-4 font-medium text-gray-800">
                                  {reposicion.producto.nombre}
                                </td>

                                {/* PRESENTACIÓN */}

                                <td className="px-5 py-4 text-gray-600">
                                  {reposicion.producto.presentacion ||
                                    "-"}
                                </td>

                                {/* CANTIDAD */}

                                <td className="px-5 py-4 text-gray-800">
                                  {reposicion.cantidadAReponer}

                                  {reposicion.producto.unidadStock ===
                                  "KILOGRAMO"
                                    ? " kg"
                                    : " un."}
                                </td>

                                {/* ACCIONES */}

                                <td className="px-5 py-4">

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReposicionEditando(
                                        reposicion
                                      )

                                      setCantidadEditando(
                                        reposicion.cantidadAReponer
                                      )
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Editar
                                  </button>

                                  {/* EDITAR CANTIDAD */}

                                  {reposicionEditando?.id ===
                                    reposicion.id && (
                                    <div className="mt-3 flex items-center gap-2">

                                      <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        value={cantidadEditando}
                                        onChange={(event) =>
                                          setCantidadEditando(
                                            event.target.value
                                          )
                                        }
                                        className="w-24 border border-gray-300 rounded-lg px-2 py-1"
                                      />

                                      <button
                                        type="button"
                                        onClick={guardarCantidad}
                                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                                      >
                                        Guardar
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setReposicionEditando(
                                            null
                                          )
                                          setCantidadEditando("")
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        Cancelar
                                      </button>

                                    </div>
                                  )}

                                </td>
                              </tr>
                            )
                          )}
                        </tbody>

                      </table>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Reposicion