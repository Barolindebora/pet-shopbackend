import { useState } from "react"

function FormularioAgregarProducto({
  proveedores,
  marcas,
  categorias,
  onCerrar,
  onProductoCreado,
}) {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    codigoBarra: "",
    descripcion: "",
    proveedorId: "",
    marcaId: "",
    presentacion: "",
    imagenUrl: "",
    unidadStock: "UNIDAD",
    stockActual: "",
    stockMinimo: "",
    costoCompra: "",
    precioSugerido: "",
    precioEfectivo: "",
    precioTarjeta: "",
    categorias: [],
  })

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    })
  }

  const manejarCategoria = (categoriaId) => {
    setNuevoProducto((productoActual) => {
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

  const guardarProducto = async (e) => {
    e.preventDefault()

    if (!nuevoProducto.nombre.trim()) {
      alert("Ingresá el nombre del producto")
      return
    }

    if (!nuevoProducto.proveedorId) {
      alert("Seleccioná un proveedor")
      return
    }

    if (!nuevoProducto.marcaId) {
      alert("Seleccioná una marca")
      return
    }

    if (nuevoProducto.categorias.length === 0) {
      alert("Seleccioná al menos una categoría")
      return
    }

    if (nuevoProducto.stockActual === "") {
      alert("Ingresá el stock inicial")
      return
    }

    if (nuevoProducto.stockMinimo === "") {
      alert("Ingresá el stock mínimo")
      return
    }

    if (nuevoProducto.costoCompra === "") {
      alert("Ingresá el costo de compra")
      return
    }

    if (nuevoProducto.precioEfectivo === "") {
      alert("Ingresá el precio en efectivo")
      return
    }

    if (nuevoProducto.precioTarjeta === "") {
      alert("Ingresá el precio con tarjeta")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const datosProducto = {
        nombre: nuevoProducto.nombre.trim(),
        codigoBarra:
          nuevoProducto.codigoBarra.trim() || null,
        descripcion:
          nuevoProducto.descripcion.trim() || null,
        proveedorId: Number(nuevoProducto.proveedorId),
        marcaId: Number(nuevoProducto.marcaId),
        presentacion:
          nuevoProducto.presentacion.trim() || null,
        imagenUrl: nuevoProducto.imagenUrl.trim() || null,
        unidadStock: nuevoProducto.unidadStock,
        stockActual: nuevoProducto.stockActual,
        stockMinimo: nuevoProducto.stockMinimo,
        costoCompra: nuevoProducto.costoCompra,
        precioSugerido:
          nuevoProducto.precioSugerido || null,
        precioEfectivo: nuevoProducto.precioEfectivo,
        precioTarjeta: nuevoProducto.precioTarjeta,
        categorias: nuevoProducto.categorias,
      }

      const respuesta = await fetch(
        "http://localhost:3000/productos",
        {
          method: "POST",
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
          datos.error || "No se pudo crear el producto"
        )
      }

      onProductoCreado(datos)
      onCerrar()

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Nuevo producto
          </h2>

          <button
            type="button"
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={guardarProducto}
          className="flex flex-col gap-5"
        >

          {/* NOMBRE Y CÓDIGO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del producto *
              </label>

              <input
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Excellent Puppy"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de barras
              </label>

              <input
                type="text"
                name="codigoBarra"
                value={nuevoProducto.codigoBarra}
                onChange={manejarCambio}
                placeholder="Ej: 7791234567890"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
              value={nuevoProducto.descripcion}
              onChange={manejarCambio}
              placeholder="Descripción opcional"
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>


          {/* PROVEEDOR Y MARCA */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor *
              </label>

              <select
                name="proveedorId"
                value={nuevoProducto.proveedorId}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="">
                  Seleccionar proveedor
                </option>

                {proveedores
                  .filter((proveedor) => proveedor.activo)
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
                value={nuevoProducto.marcaId}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="">
                  Seleccionar marca
                </option>

                {marcas
                  .filter((marca) => marca.activo)
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


          {/* PRESENTACIÓN Y FORMA DE VENTA */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentación
              </label>

              <input
                type="text"
                name="presentacion"
                value={nuevoProducto.presentacion}
                onChange={manejarCambio}
                placeholder="Ej: Bolsa 20 kg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Imagen del producto
  </label>

  <input
    type="url"
    name="imagenUrl"
    value={nuevoProducto.imagenUrl}
    onChange={manejarCambio}
    placeholder="https://..."
    className="w-full border border-gray-300 rounded-lg px-3 py-2"
  />

  <p className="text-xs text-gray-500 mt-1">
    Opcional. Por ahora podés ingresar la URL de una imagen.
  </p>
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de venta *
              </label>

              <select
                name="unidadStock"
                value={nuevoProducto.unidadStock}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {nuevoProducto.unidadStock === "KILOGRAMO"
                  ? "Kilos iniciales *"
                  : "Unidades iniciales *"}
              </label>

              <input
                type="number"
                step="0.001"
                min="0"
                name="stockActual"
                value={nuevoProducto.stockActual}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock mínimo *
              </label>

              <input
                type="number"
                step="0.001"
                min="0"
                name="stockMinimo"
                value={nuevoProducto.stockMinimo}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

          </div>


          {/* CATEGORÍAS */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías *
            </label>

            <div className="border border-gray-300 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-3">

              {categorias
                .filter((categoria) => categoria.activo)
                .map((categoria) => (
                  <label
                    key={categoria.id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      value={categoria.id}
                      checked={nuevoProducto.categorias.includes(
                        categoria.id
                      )}
                      onChange={() =>
                        manejarCategoria(categoria.id)
                      }
                    />

                    {categoria.nombre}
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
                  min="0"
                  name="costoCompra"
                  value={nuevoProducto.costoCompra}
                  onChange={manejarCambio}
                  placeholder="$"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio sugerido
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="precioSugerido"
                  value={nuevoProducto.precioSugerido}
                  onChange={manejarCambio}
                  placeholder="$"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio efectivo *
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="precioEfectivo"
                  value={nuevoProducto.precioEfectivo}
                  onChange={manejarCambio}
                  placeholder="$"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio tarjeta *
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="precioTarjeta"
                  value={nuevoProducto.precioTarjeta}
                  onChange={manejarCambio}
                  placeholder="$"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

            </div>
          </div>


          {/* BOTONES */}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={onCerrar}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800"
            >
              Guardar producto
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default FormularioAgregarProducto