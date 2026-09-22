import Sidebar from "./components/Sidebar"
import InicioAdmin from "./pages/admin/InicioAdmin"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <InicioAdmin />
      </main>
    </div>
  )
}

export default App