import {
  Routes,
  Route,
} from "react-router-dom"

import Sidebar from "../components/Sidebar"
import RutaProtegida from "../components/RutaProtegida"

import InicioAdmin from "../pages/admin/InicioAdmin"
import LoginAdmin from "../pages/admin/LoginAdmin"
import Productos from "../pages/admin/Productos"


function LayoutAdmin({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}


function AppRoutes() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/admin/login"
        element={<LoginAdmin />}
      />


      {/* INICIO DEL ADMIN */}
      <Route
        path="/admin"
        element={
          <RutaProtegida>
            <LayoutAdmin>
              <InicioAdmin />
            </LayoutAdmin>
          </RutaProtegida>
        }
      />


      {/* PRODUCTOS */}
      <Route
        path="/admin/productos"
        element={
          <RutaProtegida>
            <LayoutAdmin>
              <Productos />
            </LayoutAdmin>
          </RutaProtegida>
        }
      />

    </Routes>
  )
}

export default AppRoutes