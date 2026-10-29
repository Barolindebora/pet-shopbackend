import express from "express";
import cors from "cors";

import proveedorRoutes from "./src/routes/proveedor.routes.js";
import marcaRoutes from "./src/routes/marca.routes.js";
import categoriaRoutes from "./src/routes/categoria.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import movimientoStockRoutes from "./src/routes/movimientoStock.routes.js";
import listaReposicionRoutes from "./src/routes/listaReposicion.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import ventaRoutes from "./src/routes/venta.routes.js";

import { verificarToken } from "./src/middlewares/auth.middleware.js";

const app = express();
const PORT = 3000;

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// JSON
app.use(express.json());

// =====================================================
// RUTAS PÚBLICAS
// =====================================================

// Login
app.use("/auth", authRoutes);

// =====================================================
// AUTENTICACIÓN
// =====================================================

// A partir de acá se necesita estar autenticado
app.use(verificarToken);

// =====================================================
// RUTAS PRIVADAS
// =====================================================

// Ruta principal
app.get("/", (req, res) => {
  res.send("AMOR ANIMAL - Backend funcionando 🐾");
});

app.use("/proveedores", proveedorRoutes);
app.use("/marcas", marcaRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/productos", productoRoutes);
app.use("/movimientos", movimientoStockRoutes);
app.use("/reposiciones", listaReposicionRoutes);

// Ventas
app.use("/ventas", ventaRoutes);

// =====================================================
// SERVIDOR
// =====================================================

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});