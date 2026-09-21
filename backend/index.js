import express from "express";
import proveedorRoutes from "./src/routes/proveedor.routes.js";
import  marcaRoutes from "./src/routes/marca.routes.js";
import categoriaRoutes from "./src/routes/categoria.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import movimientoStockRoutes from "./src/routes/movimientoStock.routes.js";
import listaReposicionRoutes from "./src/routes/listaReposicion.routes.js";
const app = express();
const PORT = 3000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});