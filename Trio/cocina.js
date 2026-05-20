const db = require('./db');

async function cocinaMenu(rl) {
  let salir = false;
  
  while (!salir) {
    console.clear();
    console.log("**************************************************");
    console.log("*                 MÓDULO COCINA                  *");
    console.log("**************************************************");
    console.log("1. Ver lista de productos");
    console.log("2. Agregar nuevo producto");
    console.log("3. Eliminar producto");
    console.log("4. Volver al menú principal");
    console.log("**************************************************");
    
    const opcion = await rl.question("Elija una opción (1-4): ");
    
    switch (opcion.trim()) {
      case '1':
        mostrarProductos();
        await rl.question("--> Dale ENTER para continuar...");
        break;
      case '2':
        await agregarProducto(rl);
        break;
      case '3':
        await eliminarProducto(rl);
        break;
      case '4':
        salir = true;
        break;
      default:
        console.log("--> Opción inválida.");
        await new Promise(r => setTimeout(r, 1000));
        break;
    }
  }
}

function mostrarProductos() {
  console.log("\n--- LISTA DE PRODUCTOS ---");
  if (db.productos.length === 0) {
    console.log("No hay productos registrados.");
    return;
  }
  db.productos.forEach(p => {
    console.log(`ID: ${p.id} | ${p.nombre.padEnd(20)} | Tipo: ${p.tipo.padEnd(8)} | Precio: $${p.precio.toFixed(2)} | Stock: ${p.stock}`);
  });
  console.log("--------------------------");
}

async function agregarProducto(rl) {
  console.log("\n--- AGREGAR PRODUCTO ---");
  const nombre = await rl.question("Nombre del producto: ");
  if (!nombre.trim()) return console.log("Nombre inválido.");
  
  const tipo = await rl.question("Tipo (Bebida/Comida): ");
  const precioInput = await rl.question("Precio: ");
  const stockInput = await rl.question("Stock inicial: ");
  
  const precio = parseFloat(precioInput);
  const stock = parseInt(stockInput);
  
  if (isNaN(precio) || isNaN(stock)) {
    console.log("Precio o stock inválidos.");
    await rl.question("ENTER para continuar...");
    return;
  }
  
  db.productos.push({
    id: db.idProductoActual++,
    nombre: nombre,
    tipo: tipo || 'Bebida',
    precio: precio,
    stock: stock
  });
  console.log("Producto agregado con éxito.");
  await rl.question("ENTER para continuar...");
}

async function eliminarProducto(rl) {
  mostrarProductos();
  const idInput = await rl.question("\nIngrese ID del producto a eliminar: ");
  const id = parseInt(idInput);
  
  const indice = db.productos.findIndex(p => p.id === id);
  if (indice !== -1) {
    db.productos.splice(indice, 1);
    console.log("Producto eliminado.");
  } else {
    console.log("Producto no encontrado.");
  }
  await rl.question("ENTER para continuar...");
}

module.exports = cocinaMenu;
