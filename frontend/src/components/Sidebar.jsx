import { NavLink } from "react-router-dom"
function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-purple-700 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        AMOR ANIMAL 🐾
      </h2>

      <nav className="flex flex-col gap-4">

  <NavLink
    to="/admin"
    className="text-left hover:text-purple-200"
  >
    Inicio
  </NavLink>

  <NavLink
    to="/admin/productos"
    className="text-left hover:text-purple-200"
  >
    Productos
  </NavLink>
<NavLink
  to="/admin/stock"
  className="text-left hover:text-purple-200"
>
  Stock
</NavLink>
<NavLink
  to="/admin/reposicion"
  className="text-left hover:text-purple-200"
>
  Reposición
</NavLink>

<NavLink
  to="/admin/ventas"
  className="text-left hover:text-purple-200"
>
  Ventas
</NavLink>
<NavLink
  to="/admin/historial-ventas"
  className="text-left hover:text-purple-200"
>
  Historial de ventas
</NavLink>
        <NavLink
          to="/admin/ventas-online"
          className="text-left hover:text-purple-200"
        >
          Ventas online
        </NavLink>


 <NavLink
  to="/admin/proveedores"
  className="text-left hover:text-purple-200"
>
  Proveedores
</NavLink>

<NavLink
  to="/admin/marcas"
  className="text-left hover:text-purple-200"
>
  Marcas
</NavLink>

<NavLink
  to="/admin/categorias"
  className="text-left hover:text-purple-200"
>
  Categorías
</NavLink>
<NavLink
  to="/admin/historias"
  className="text-left hover:text-purple-200"
>
  📸 Generador de historias
</NavLink>

</nav>
    </aside>
  )
}

export default Sidebar