import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LoginAdmin() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const iniciarSesion = async (e) => {
    e.preventDefault()

    setError("")
    setCargando(true)

    try {
      const respuesta = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario,
            password,
          }),
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setError(datos.error || "Error al iniciar sesión")
        return
      }

      // Guardamos el token que devuelve nuestro backend
      localStorage.setItem("token", datos.token)

      // Entramos al panel
      navigate("/admin")

    } catch (error) {
      console.error(error)
      setError("No se pudo conectar con el servidor")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">
            AMOR ANIMAL 🐾
          </h1>

          <p className="text-gray-500 mt-2">
            Acceso al sistema de gestión
          </p>
        </div>

        <form
          onSubmit={iniciarSesion}
          className="flex flex-col gap-5"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>

            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ingresá tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ingresá tu contraseña"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="bg-purple-700 text-white rounded-lg py-2.5 font-medium hover:bg-purple-800 transition disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default LoginAdmin