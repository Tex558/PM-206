const db = require('./db');
const caja = require('./caja');

function mostrarBanner() {
  console.clear();
  console.log("**************************************************");
  console.log("*            BIENVENIDO A COFFEE SHOP            *");
  console.log("**************************************************");
}

function mostrarMenu() {
  console.log("");
  console.log("1. Consultar cafés y productos");
  console.log("2. Crear pedido de café");
  console.log("3. Mis pedidos");
  console.log("4. Volver al menú principal");
  console.log("**************************************************");
}

function mostrarTablaProductos() {
  console.log("");
  console.log("=== LISTA DE PRODUCTOS DISPONIBLES ===");
  if (db.productos.length === 0) {
    console.log("Actualmente no hay productos disponibles.");
  } else {
    db.productos.forEach(p => {
      console.log(`ID: ${p.id} | ${p.nombre.padEnd(20)} | Precio: $${p.precio.toFixed(2)} | Stock: ${p.stock}`);
    });
  }
  console.log("=======================================");
}

async function consultarProductos(rl) {
  mostrarBanner();
  mostrarTablaProductos();
  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menú...");
}

async function clienteMenu(rl) {
  let salir = false;
  
  while (!salir) {
    mostrarBanner();
    mostrarMenu();
    
    const opcion = await rl.question("Elija una opción (1-4): ");
    
    switch (opcion.trim()) {
      case '1':
        await consultarProductos(rl);
        break;
      case '2':
        // Utilizamos la misma función de la Caja para crear pedidos
        await caja.crearPedido(rl);
        break;
      case '3':
        // Utilizamos la misma función de la Caja para listar pedidos
        await caja.listarPedidos(rl);
        break;
      case '4':
        salir = true;
        break;
      default:
        console.log("\n--> ¡Error! Esa opción no vale. Elige un número del 1 al 4.");
        console.log("--------------------------------------------------");
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
    }
  }
}

module.exports = clienteMenu;
