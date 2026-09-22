import bcrypt from "bcryptjs"
import { db } from "../prisma/db.js"
import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

const rl = readline.createInterface({
  input,
  output,
})

try {
  const usuario = await rl.question("Usuario administrador: ")
  const password = await rl.question("Contraseña: ")

  if (!usuario.trim() || !password.trim()) {
    console.log("El usuario y la contraseña son obligatorios.")
    process.exitCode = 1
  } else {
    const passwordHash = await bcrypt.hash(password, 10)

    await db.orm.public.Administrador.create({
      usuario: usuario.trim(),
      password: passwordHash,
      activo: true,
    })

    console.log("Administrador creado correctamente 🐾")
  }
} catch (error) {
  console.error("Error al crear el administrador:", error)
} finally {
  rl.close()
  await db.close()
}