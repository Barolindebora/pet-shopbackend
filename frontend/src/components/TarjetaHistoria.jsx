function TarjetaHistoria({ producto }) {
  const precioLista = Number(producto.precioTarjeta)
  const precioEfectivo = Number(producto.precioEfectivo)

  const formatoPrecio = (valor) =>
    valor.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    })

  return (
    <div className="w-[360px] bg-white rounded-xl overflow-hidden shadow-lg">

      {/* ENCABEZADO CON LOGO */}
<div className="bg-green-100 py-6 flex flex-col items-center">

  <img
    src="/MasNatural-Isotipo.png"
    alt="Logo Amor Animal"
    className="w-24 h-24 object-contain"
  />

  <h2 className="mt-2 text-2xl font-extrabold text-green-900">
    AMOR ANIMAL
  </h2>

  <p className="text-sm tracking-widest text-green-700">
    PET SHOP
  </p>

</div>

      {/* IMAGEN */}
      <div className="h-[310px] flex items-center justify-center p-6">
        {producto.imagenUrl ? (
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-center">
            Imagen del producto pendiente
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="px-6 pb-8 text-center">
        <h3 className="text-xl font-extrabold text-gray-900 uppercase">
          {producto.nombre}
        </h3>

        {producto.presentacion && (
          <p className="mt-2 text-gray-500">
            {producto.presentacion}
          </p>
        )}

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            PRECIO DE LISTA
          </p>

          <p className="text-3xl font-bold text-gray-900">
            {formatoPrecio(precioLista)}
          </p>
        </div>

        <div className="mt-5 bg-purple-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-purple-800">
            EFECTIVO O TRANSFERENCIA
          </p>

          <p className="text-3xl font-extrabold text-purple-800">
            {formatoPrecio(precioEfectivo)}
          </p>
        </div>
        {/* CONTACTO */}
{/* CONTACTO WHATSAPP */}
<div className="bg-green-800 text-white py-2 px-4">

  <div className="flex items-center justify-center gap-3">

    <img
      src="/whatsapp.png"
      alt="WhatsApp"
      className="w-8 h-8 object-contain"
    />

    <div className="text-left leading-tight">
      <p className="text-xs font-medium">
       Envíos a domicilio/punto de retiro 
       Estacionamiento sin cargo-Chacabuco 457
      </p>

      <p className="text-base font-bold">
        3834 235811
      </p>
    </div>

  </div>

</div>
      </div>
    </div>
  )
}

export default TarjetaHistoria