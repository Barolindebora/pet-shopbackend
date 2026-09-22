import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import {
  obtenerAdministradorPorUsuario,
} from "../repositories/administrador.repository.js"


export const autenticarAdministrador = async (usuario, password) => {

  // Buscar administrador por usuario
  const administrador =
    await obtenerAdministradorPorUsuario(usuario)

  if (!administrador) {
    throw new Error("CREDENCIALES_INVALIDAS")
  }


  // Verificar que esté activo
  if (!administrador.activo) {
    throw new Error("ADMINISTRADOR_INACTIVO")
  }


  // Comparar contraseña con el hash guardado
  const passwordCorrecta = await bcrypt.compare(
    password,
    administrador.password
  )

  if (!passwordCorrecta) {
    throw new Error("CREDENCIALES_INVALIDAS")
  }


  // Crear token de acceso
  const token = jwt.sign(
    {
      id: administrador.id,
      usuario: administrador.usuario,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  )


  // Devolver administrador y token
  return {
    administrador: {
      id: administrador.id,
      usuario: administrador.usuario,
    },
    token,
  }
}