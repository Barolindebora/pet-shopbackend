import { useEffect, useState } from "react"

function HistorialVentas({ canal }) {
  const [fechaAbierta, setFechaAbierta] = useState(null)
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

const ventasFiltradas = canal
  ? ventas.filter(
      (venta) => venta.canal === canal
    )
  : ventas
  // =====================================================
  // CARGAR VENTAS
  // =====================================================

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const token = localStorage.getItem("token")

        const respuesta = await fetch(
          "http://localhost:3000/ventas",
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
              "No se pudo cargar el historial de ventas"
          )
        }

        setVentas(datos)

      } catch (error) {
        console.error(error)
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarVentas()
  }, [])

  // =====================================================
  // AGRUPAR VENTAS POR FECHA
  // =====================================================

const ventasPorFecha = ventasFiltradas.reduce(
    (grupos, venta) => {
      const fecha = new Date(
        venta.fecha
      ).toLocaleDateString("es-AR")

      if (!grupos[fecha]) {
        grupos[fecha] = []
      }

      grupos[fecha].push(venta)

      return grupos
    },
    {}
  )

  // =====================================================
  // INTERFAZ
  // =====================================================

  return (
    <div>
<h1 className="text-3xl font-bold text-gray-800">
  {canal === "ONLINE"
    ? "Historial de ventas online"
    : "Historial de ventas"}
</h1>

<p className="mt-1 text-gray-500">
  {canal === "ONLINE"
    ? "Ventas online realizadas por fecha"
    : "Ventas realizadas por fecha"}
</p>


      {/* CARGANDO */}

      {cargando && (
        <p className="mt-6 text-gray-500">
          Cargando ventas...
        </p>
      )}


      {/* ERROR */}

      {error && (
        <p className="mt-6 text-red-600">
          {error}
        </p>
      )}


      {/* SIN VENTAS */}

      {!cargando &&
        !error &&
        ventasFiltradas.length === 0 && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Todavía no hay ventas registradas.
            </p>
          </div>
        )}


      {/* HISTORIAL */}

      {!cargando &&
        !error &&
        ventasFiltradas.length > 0 && (

          <div className="mt-6 space-y-4">

            {Object.entries(ventasPorFecha)

              // Ordenar fechas:
              // las más nuevas primero

              .sort(
                ([fechaA], [fechaB]) => {

                  const [diaA, mesA, anioA] =
                    fechaA.split("/")

                  const [diaB, mesB, anioB] =
                    fechaB.split("/")

                  const fechaRealA = new Date(
                    anioA,
                    mesA - 1,
                    diaA
                  )

                  const fechaRealB = new Date(
                    anioB,
                    mesB - 1,
                    diaB
                  )

                  return fechaRealB - fechaRealA
                }
              )

              .map(([fecha, ventasDelDia]) => {

                // ¿Está desplegado este día?

                const estaAbierta =
                  fechaAbierta === fecha


                // Total vendido durante el día

                const totalDia =
                  ventasDelDia.reduce(
                    (total, venta) =>
                      total +
                      Number(venta.total),
                    0
                  )


                // Ventas más nuevas primero

                const ventasOrdenadas =
                  [...ventasDelDia].sort(
                    (a, b) =>
                      new Date(b.fecha) -
                      new Date(a.fecha)
                  )


                return (

                  <div
                    key={fecha}
                    className="bg-white rounded-xl shadow overflow-hidden"
                  >

                    {/* ================================= */}
                    {/* ENCABEZADO DEL DÍA */}
                    {/* ================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        setFechaAbierta(
                          estaAbierta
                            ? null
                            : fecha
                        )
                      }
                      className="
                        w-full
                        bg-gray-100
                        px-5
                        py-4
                        flex
                        items-center
                        justify-between
                        hover:bg-gray-200
                      "
                    >

                      {/* FECHA */}

                      <div className="flex items-center gap-3">

                        <span className="text-gray-500 text-lg">
                          {estaAbierta
                            ? "▼"
                            : "▶"}
                        </span>

                        <div className="text-left">

                          <h2 className="text-lg font-bold text-gray-800">
                            {fecha}
                          </h2>

                          <p className="text-sm text-gray-500">
                            {ventasDelDia.length}{" "}
                            {ventasDelDia.length === 1
                              ? "venta"
                              : "ventas"}
                          </p>

                        </div>

                      </div>


                      {/* TOTAL DEL DÍA */}

                      <div className="text-right">

                        <p className="text-xs text-gray-500">
                          Total del día
                        </p>

                        <p className="text-xl font-bold text-purple-700">
                          $
                          {totalDia.toLocaleString(
                            "es-AR"
                          )}
                        </p>

                      </div>

                    </button>


                    {/* ================================= */}
                    {/* VENTAS DEL DÍA */}
                    {/* ================================= */}

                    {estaAbierta && (

                      <div className="overflow-x-auto">

                        <table className="w-full">

                          {/* ENCABEZADOS */}

                          <thead className="bg-gray-50">

                            <tr>

                              <th className="text-left px-5 py-3 text-sm text-gray-600">
                                Venta
                              </th>

                              <th className="text-left px-5 py-3 text-sm text-gray-600">
                                Hora
                              </th>

                              <th className="text-left px-5 py-3 text-sm text-gray-600">
                                Canal
                              </th>

                              <th className="text-left px-5 py-3 text-sm text-gray-600">
                                Forma de pago
                              </th>

                              <th className="text-right px-5 py-3 text-sm text-gray-600">
                                Total
                              </th>

                            </tr>

                          </thead>


                          {/* VENTAS */}

                          <tbody>

                            {ventasOrdenadas.map(
                              (venta) => (

                                <tr
                                  key={venta.id}
                                  className="border-t border-gray-200"
                                >

                                  {/* ID VENTA */}

                                  <td className="px-5 py-4 font-semibold text-purple-700">
                                    #{venta.id}
                                  </td>


                                  {/* HORA */}

                                  <td className="px-5 py-4 text-gray-700">

                                    {new Date(
                                      venta.fecha
                                    ).toLocaleTimeString(
                                      "es-AR",
                                      {
                                        hour:
                                          "2-digit",

                                        minute:
                                          "2-digit",
                                      }
                                    )}

                                  </td>


                                  {/* CANAL */}

                                  <td className="px-5 py-4 text-gray-700">

                                    {venta.canal ===
                                    "LOCAL"
                                      ? "Local"
                                      : "Online"}

                                  </td>


                                  {/* FORMA DE PAGO */}

                                  <td className="px-5 py-4 text-gray-700">

                                    {venta.formaPago ===
                                    "EFECTIVO"
                                      ? "Efectivo"
                                      : "Tarjeta"}

                                  </td>


                                  {/* TOTAL */}

                                  <td className="px-5 py-4 text-right font-semibold text-gray-800">

                                    $
                                    {Number(
                                      venta.total
                                    ).toLocaleString(
                                      "es-AR"
                                    )}

                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </div>

                )
              })}

          </div>

        )}

    </div>
  )
}

export default HistorialVentas