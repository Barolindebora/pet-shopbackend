import jwt from "jsonwebtoken"


export const verificarToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    // Verificar que se haya enviado el token
    if (!authorization) {
      return res.status(401).json({
        error: "Acceso no autorizado",
      })
    }


    // El formato esperado es:
    // Authorization: Bearer TOKEN
    const [tipo, token] = authorization.split(" ")

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Token inválido",
      })
    }


    // Verificar firma y vencimiento del token
    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET
    )


    // Guardar los datos del administrador
    // para que las siguientes funciones puedan usarlos
    req.administrador = datos

    next()

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o vencido",
    })
  }
}