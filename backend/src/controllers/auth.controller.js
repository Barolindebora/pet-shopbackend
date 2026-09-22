import {
  autenticarAdministrador,
} from "../services/auth.service.js"


export const login = async (req, res) => {
  try {
    const { usuario, password } = req.body

    // Verificar que se enviaron ambos datos
    if (!usuario || !password) {
      return res.status(400).json({
        error: "Usuario y contraseña son obligatorios",
      })
    }

    // Comprobar las credenciales
 const resultado = await autenticarAdministrador(
  usuario,
  password
)

res.json({
  mensaje: "Inicio de sesión correcto",
  administrador: resultado.administrador,
  token: resultado.token,
})

  } catch (error) {
    console.error(error)

    if (error.message === "CREDENCIALES_INVALIDAS") {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos",
      })
    }

    if (error.message === "ADMINISTRADOR_INACTIVO") {
      return res.status(403).json({
        error: "Administrador inactivo",
      })
    }

    res.status(500).json({
      error: "Error al iniciar sesión",
    })
  }
}