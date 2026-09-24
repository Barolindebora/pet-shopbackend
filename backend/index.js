import express from "express";
import proveedorRoutes from "./src/routes/proveedor.routes.js";
import  marcaRoutes from "./src/routes/marca.routes.js";
import categoriaRoutes from "./src/routes/categoria.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import movimientoStockRoutes from "./src/routes/movimientoStock.routes.js";
import listaReposicionRoutes from "./src/routes/listaReposicion.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { verificarToken } from "./src/middlewares/auth.middleware.js";
import cors from "cors";
const app = express();
const PORT = 3000;
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.use(express.json());
// Login público
app.use("/auth", authRoutes);


// A partir de acá se necesita estar autenticado
app.use(verificarToken);

// Ruta principal
app.get("/", (req, res) => {
  res.send("AMOR ANIMAL - Backend funcionando 🐾");
});

// Rutas de proveedores
app.use("/proveedores", proveedorRoutes);
app.use("/marcas", marcaRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/productos", productoRoutes);
app.use("/movimientos", movimientoStockRoutes);
app.use("/reposiciones", listaReposicionRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});