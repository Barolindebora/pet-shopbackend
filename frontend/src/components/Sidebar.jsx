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

  <button className="text-left hover:text-purple-200">
    Stock
  </button>

  <button className="text-left hover:text-purple-200">
    Reposición
  </button>

  <button className="text-left hover:text-purple-200">
    Proveedores
  </button>

  <button className="text-left hover:text-purple-200">
    Marcas
  </button>

  <button className="text-left hover:text-purple-200">
    Categorías
  </button>

</nav>
    </aside>
  )
}

export default Sidebar