import { useEffect, useState } from "react"

function FormularioEditarProducto({
  producto,
  proveedores,
  marcas,
  categorias,
  onCerrar,
  onProductoActualizado,
}) {
  const [productoEditado, setProductoEditado] = useState({
    nombre: "",
    codigoBarra: "",
    descripcion: "",
    imagenUrl: "",
    proveedorId: "",
    marcaId: "",
    presentacion: "",
    unidadStock: "UNIDAD",
    stockMinimo: "",
    costoCompra: "",
    precioSugerido: "",
    precioEfectivo: "",
    precioTarjeta: "",
    categorias: [],
  })

  const [cargandoCategorias, setCargandoCategorias] = useState(true)

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const token = localStorage.getItem("token")

        // Buscamos las categorías que actualmente tiene el producto
        const respuesta = await fetch(
          `http://localhost:3000/productos/${producto.id}/categorias`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener las categorías del producto"
          )
        }

        const categoriasProducto = await respuesta.json()

        setProductoEditado({
          nombre: producto.nombre || "",
          codigoBarra: producto.codigoBarra || "",
          descripcion: producto.descripcion || "",
          imagenUrl: producto.imagenUrl || "",
          proveedorId: String(producto.proveedorId),
          marcaId: String(producto.marcaId),
          presentacion: producto.presentacion || "",
          unidadStock: producto.unidadStock,
          stockMinimo: producto.stockMinimo ?? "",
          costoCompra: producto.costoCompra ?? "",
          precioSugerido: producto.precioSugerido ?? "",
          precioEfectivo: producto.precioEfectivo ?? "",
          precioTarjeta: producto.precioTarjeta ?? "",

          categorias: categoriasProducto.map(
            (relacion) => relacion.categoriaId
          ),
        })
      } catch (error) {
        console.error(error)
        alert(error.message)
      } finally {
        setCargandoCategorias(false)
      }
    }

    cargarProducto()
  }, [producto])

  const manejarCambio = (e) => {
  const { name, value } = e.target

  setProductoEditado((productoActual) => ({
    ...productoActual,
    [name]: value,
  }))
}

const manejarCategoria = (categoriaId) => {
  setProductoEditado((productoActual) => {
    const yaSeleccionada =
      productoActual.categorias.includes(categoriaId)

    return {
      ...productoActual,
      categorias: yaSeleccionada
        ? productoActual.categorias.filter(
            (id) => id !== categoriaId
          )
        : [...productoActual.categorias, categoriaId],
    }
  })
}
const guardarCambios = async (e) => {
  e.preventDefault()

  // VALIDACIONES

  if (!productoEditado.nombre.trim()) {
    alert("Ingresá el nombre del producto")
    return
  }

  if (!productoEditado.proveedorId) {
    alert("Seleccioná un proveedor")
    return
  }

  if (!productoEditado.marcaId) {
    alert("Seleccioná una marca")
    return
  }

  if (productoEditado.categorias.length === 0) {
    alert("Seleccioná al menos una categoría")
    return
  }

  if (productoEditado.stockMinimo === "") {
    alert("Ingresá el stock mínimo")
    return
  }

  if (productoEditado.costoCompra === "") {
    alert("Ingresá el costo de compra")
    return
  }

  if (productoEditado.precioEfectivo === "") {
    alert("Ingresá el precio en efectivo")
    return
  }

  if (productoEditado.precioTarjeta === "") {
    alert("Ingresá el precio con tarjeta")
    return
  }

  try {
    const token = localStorage.getItem("token")

    const datosProducto = {
      nombre: productoEditado.nombre.trim(),
      codigoBarra:
        productoEditado.codigoBarra.trim() || null,
      descripcion:
        productoEditado.descripcion.trim() || null,
      imagenUrl:
        productoEditado.imagenUrl.trim() || null,

      proveedorId: Number(productoEditado.proveedorId),
      marcaId: Number(productoEditado.marcaId),

      presentacion:
        productoEditado.presentacion.trim() || null,

      unidadStock: productoEditado.unidadStock,

      stockMinimo: productoEditado.stockMinimo,

      costoCompra: productoEditado.costoCompra,

      precioSugerido:
        productoEditado.precioSugerido || null,

      precioEfectivo:
        productoEditado.precioEfectivo,

      precioTarjeta:
        productoEditado.precioTarjeta,

      categorias: productoEditado.categorias,
    }

    const respuesta = await fetch(
      `http://localhost:3000/productos/${producto.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosProducto),
      }
    )

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.error || "No se pudo actualizar el producto"
      )
    }

    onProductoActualizado(datos)

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

  if (cargandoCategorias) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          Cargando producto...
        </div>
      </div>
    )
  }

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Editar producto
      </h2>

      <form
  onSubmit={guardarCambios}
  className="space-y-6"
>

        {/* DATOS GENERALES */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={productoEditado.nombre}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de barras
            </label>
            <input
              type="text"
              name="codigoBarra"
              value={productoEditado.codigoBarra}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

        </div>


        {/* DESCRIPCIÓN */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={productoEditado.descripcion}
            onChange={manejarCambio}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>


        {/* IMAGEN */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen del producto
          </label>

          <input
            type="url"
            name="imagenUrl"
            value={productoEditado.imagenUrl}
            onChange={manejarCambio}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <p className="text-xs text-gray-500 mt-1">
            Opcional. Por ahora podés ingresar la URL de una imagen.
          </p>
        </div>


        {/* PROVEEDOR Y MARCA */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor *
            </label>

            <select
              name="proveedorId"
              value={productoEditado.proveedorId}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccionar proveedor</option>

              {proveedores
                .filter(
                  (proveedor) =>
                    proveedor.activo ||
                    proveedor.id === Number(productoEditado.proveedorId)
                )
                .map((proveedor) => (
                  <option
                    key={proveedor.id}
                    value={proveedor.id}
                  >
                    {proveedor.nombre}
                  </option>
                ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca *
            </label>

            <select
              name="marcaId"
              value={productoEditado.marcaId}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccionar marca</option>

              {marcas
                .filter(
                  (marca) =>
                    marca.activo ||
                    marca.id === Number(productoEditado.marcaId)
                )
                .map((marca) => (
                  <option
                    key={marca.id}
                    value={marca.id}
                  >
                    {marca.nombre}
                  </option>
                ))}
            </select>
          </div>

        </div>


        {/* PRESENTACIÓN Y UNIDAD */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presentación
            </label>

            <input
              type="text"
              name="presentacion"
              value={productoEditado.presentacion}
              onChange={manejarCambio}
              placeholder="Ej: Bolsa 3 kg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad de stock *
            </label>

            <select
              name="unidadStock"
              value={productoEditado.unidadStock}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="UNIDAD">
                Por unidad
              </option>

              <option value="KILOGRAMO">
                Suelto / por kilogramo
              </option>
            </select>
          </div>

        </div>


        {/* STOCK */}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            El stock actual no se modifica desde este formulario.
            Las entradas y salidas se registran desde movimientos de stock.
          </p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock mínimo *
            </label>

            <input
              type="number"
              step="0.001"
              name="stockMinimo"
              value={productoEditado.stockMinimo}
              onChange={manejarCambio}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>


        {/* CATEGORÍAS */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorías *
          </label>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            {categorias
              .filter(
                (categoria) =>
                  categoria.activo ||
                  productoEditado.categorias.includes(categoria.id)
              )
              .map((categoria) => (
                <label
                  key={categoria.id}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg p-2"
                >
                  <input
                    type="checkbox"
                    checked={productoEditado.categorias.includes(
                      categoria.id
                    )}
                    onChange={() =>
                      manejarCategoria(categoria.id)
                    }
                  />

                  <span className="text-sm">
                    {categoria.nombre}
                  </span>
                </label>
              ))}

          </div>
        </div>


        {/* PRECIOS */}

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">
            Precios
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de compra *
              </label>

              <input
                type="number"
                step="0.01"
                name="costoCompra"
                value={productoEditado.costoCompra}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio sugerido
              </label>

              <input
                type="number"
                step="0.01"
                name="precioSugerido"
                value={productoEditado.precioSugerido}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio efectivo *
              </label>

              <input
                type="number"
                step="0.01"
                name="precioEfectivo"
                value={productoEditado.precioEfectivo}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio tarjeta *
              </label>

              <input
                type="number"
                step="0.01"
                name="precioTarjeta"
                value={productoEditado.precioTarjeta}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

          </div>
        </div>


        {/* BOTONES */}

        <div className="flex justify-end gap-3 pt-4 border-t">

          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            Guardar cambios
          </button>

        </div>

      </form>
    </div>
  </div>
  )

}

export default FormularioEditarProducto