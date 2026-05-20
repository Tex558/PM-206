const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const productos = [
  { id: 1, nombre: 'Espresso Solo', precio: 2.50, stock: 15 },
  { id: 2, nombre: 'Cafe Americano', precio: 3.00, stock: 20 },
  { id: 3, nombre: 'Capuccino Tradicional', precio: 4.00, stock: 12 },
  { id: 4, nombre: 'Latte Macchiato', precio: 4.50, stock: 10 },
  { id: 5, nombre: 'Caramel Frappuccino', precio: 5.50, stock: 8 },
  { id: 6, nombre: 'Muffin de Chocolate', precio: 3.50, stock: 15 }
];

const pedidos = [];
let contadorPedidos = 1;

const rl = readline.createInterface({ input, output });

function limpiarConsola() {
  console.clear();
}

function mostrarBanner() {
  limpiarConsola();
  console.log("**************************************************");
  console.log("*            BIENVENIDO A COFFEE SHOP            *");
  console.log("**************************************************");
}

function mostrarMenu() {
  console.log("");
  console.log("1. Consultar cafes y productos");
  console.log("2. Crear pedido de cafe");
  console.log("3. Listar pedidos de clientes");
  console.log("4. Salir del programa");
  console.log("**************************************************");
}

function mostrarTablaProductos() {
  console.log("");
  console.log("=== LISTA DE PRODUCTOS DISPONIBLES ===");
  productos.forEach(p => {
    console.log("ID: " + p.id + " | " + p.nombre.padEnd(23) + " | Precio: $" + p.precio.toFixed(2) + " | Stock: " + p.stock);
  });
  console.log("=======================================");
}

async function consultarProductos() {
  mostrarBanner();
  mostrarTablaProductos();
  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function crearPedido() {
  mostrarBanner();
  console.log("\n--- REGISTRO DE NUEVO PEDIDO ---");
  mostrarTablaProductos();

  let cliente = "";
  while (cliente.trim() === "") {
    cliente = await rl.question("\nIngrese el nombre del cliente: ");
    if (cliente.trim() === "") {
      console.log("--> ¡Error! El nombre no puede estar vacio. Escribelo de nuevo.");
    }
  }

  const itemsPedido = [];
  let agregarMas = true;

  while (agregarMas) {
    const idInput = await rl.question("\nIngrese el ID del cafe a comprar: ");
    const prodId = parseInt(idInput);

    const producto = productos.find(p => p.id === prodId);
    if (!producto) {
      console.log("--> ¡Error! Ese ID de cafe no existe. Intenta con otro.");
      continue;
    }

    if (producto.stock <= 0) {
      console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
      continue;
    }

    console.log("Seleccionado: " + producto.nombre + " | Precio: $" + producto.precio.toFixed(2) + " | Stock actual: " + producto.stock);

    let cantidad = 0;
    while (true) {
      const cantInput = await rl.question("¿Cuantos quieres llevar?: ");
      cantidad = parseInt(cantInput);

      if (isNaN(cantidad) || cantidad <= 0) {
        console.log("--> ¡Ojo! Tienes que llevar al menos 1 cafe.");
      } else if (cantidad > producto.stock) {
        console.log("--> ¡No hay tanto! Solo nos quedan " + producto.stock + " unidades.");
      } else {
        break;
      }
    }

    const itemExistente = itemsPedido.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad > producto.stock) {
        console.log("--> ¡Alerta! No puedes agregar mas. Supera el stock disponible.");
      } else {
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        console.log("--> Ok, cantidad actualizada para: " + producto.nombre);
      }
    } else {
      itemsPedido.push({
        producto: producto,
        cantidad: cantidad,
        subtotal: cantidad * producto.precio
      });
      console.log("--> Agregado al carrito de compras.");
    }

    const respuesta = await rl.question("\n¿Quieres agregar otra cosa al pedido? (s/n): ");
    agregarMas = respuesta.toLowerCase() === 's' || respuesta.toLowerCase() === 'si';
  }

  if (itemsPedido.length === 0) {
    console.log("\n--> Pedido cancelado. No agregaste nada.");
    console.log("--------------------------------------------------");
    await rl.question("--> Dale ENTER para volver...");
    return;
  }

  let total = 0;
  itemsPedido.forEach(item => {
    total += item.subtotal;
  });

  const idPedido = "PED-" + String(contadorPedidos).padStart(3, '0');

  mostrarBanner();
  console.log("\n--- CONFIRMACION DE COMPRA - " + idPedido + " ---");
  console.log("Cliente: " + cliente);
  console.log("Fecha:   " + new Date().toLocaleString());
  console.log("--------------------------------------------------");
  
  console.log("Detalle de la compra:");
  itemsPedido.forEach(item => {
    console.log("- " + item.producto.nombre.padEnd(25) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
  });
  console.log("--------------------------------------------------");
  console.log("TOTAL A PAGAR: $" + total.toFixed(2));
  console.log("--------------------------------------------------");

  const confirmar = await rl.question("\n¿Guardar este pedido en el sistema? (s/n): ");
  if (confirmar.toLowerCase() === 's' || confirmar.toLowerCase() === 'si') {
    itemsPedido.forEach(item => {
      item.producto.stock -= item.cantidad;
    });

    pedidos.push({
      id: idPedido,
      cliente: cliente,
      fecha: new Date(),
      items: itemsPedido,
      total: total
    });

    contadorPedidos++;
    console.log("\n--> ¡Listo! Pedido " + idPedido + " registrado y stock descontado.");
  } else {
    console.log("\n--> Pedido cancelado. No se realizo ningun cambio.");
  }

  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function listarPedidos() {
  mostrarBanner();
  console.log("\n=== HISTORIAL DE PEDIDOS ===");

  if (pedidos.length === 0) {
    console.log("\n--> ¡Aviso! No hay ningun pedido guardado todavia.");
    console.log("--------------------------------------------------");
    await rl.question("--> Dale ENTER para volver...");
    return;
  }

  pedidos.forEach(p => {
    console.log("\n==================================================");
    console.log("Pedido ID: " + p.id + " | Cliente: " + p.cliente);
    console.log("Fecha: " + p.fecha.toLocaleString());
    console.log("--------------------------------------------------");
    p.items.forEach(item => {
      console.log("  - " + item.producto.nombre.padEnd(22) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
    });
    console.log("--------------------------------------------------");
    console.log("Total del Pedido: $" + p.total.toFixed(2));
    console.log("==================================================");
  });

  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function main() {
  let salir = false;
  
  while (!salir) {
    mostrarBanner();
    mostrarMenu();
    
    const opcion = await rl.question("Elija una opcion (1-4): ");
    
    switch (opcion.trim()) {
      case '1':
        await consultarProductos();
        break;
      case '2':
        await crearPedido();
        break;
      case '3':
        await listarPedidos();
        break;
      case '4':
        limpiarConsola();
        console.log("\n¡Gracias por venir! ¡Vuelve pronto por otro cafe!\n");
        salir = true;
        rl.close();
        break;
      default:
        console.log("\n--> ¡Error! Esa opcion no vale. Elige un numero del 1 al 4.");
        console.log("--------------------------------------------------");
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
    }
  }
}

main().catch(err => {
  console.error("Error grave en el programa:", err);
  rl.close();
});
