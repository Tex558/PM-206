import db from './db.js';

async function cocinaMenu(rl) {
  let salir = false;
  
  while (!salir) {
    console.clear();
    console.log("**************************************************");
    console.log("*                 MÓDULO COCINA                  *");
    console.log("**************************************************");
    console.log("1. Ver lista de productos");
    console.log("2. Agregar nuevo producto");
    console.log("3. Editar producto");
    console.log("4. Eliminar producto");
    console.log("5. Buscar productos (Filtrar)");
    console.log("6. Menú Promociones");
    console.log("7. Volver al menú principal");
    console.log("**************************************************");
    
    const opcion = await rl.question("Elija una opción (1-7): ");
    
    switch (opcion.trim()) {
      case '1':
        mostrarProductos();
        await rl.question("--> Dale ENTER para continuar...");
        break;
      case '2':
        await agregarProducto(rl);
        break;
      case '3':
        await editarProducto(rl);
        break;
      case '4':
        await eliminarProducto(rl);
        break;
      case '5':
        await buscarProductos(rl);
        break;
      case '6':
        await menuPromociones(rl);
        break;
      case '7':
        salir = true;
        break;
      default:
        console.log("--> Opción inválida.");
        await new Promise(r => setTimeout(r, 1000));
        break;
    }
  }
}

function mostrarProductos(lista = db.productos) {
  console.log("\n--- LISTA DE PRODUCTOS ---");
  if (lista.length === 0) {
    console.log("No hay productos para mostrar.");
    return;
  }
  lista.forEach(p => {
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

async function editarProducto(rl) {
  mostrarProductos();
  const idInput = await rl.question("\nIngrese ID del producto a editar: ");
  const id = parseInt(idInput);
  
  const producto = db.productos.find(p => p.id === id);
  if (!producto) {
    console.log("Producto no encontrado.");
    await rl.question("ENTER para continuar...");
    return;
  }
  
  console.log(`\nEditando producto: ${producto.nombre} (Deje en blanco para mantener el valor actual)`);
  
  const nombre = await rl.question(`Nombre (${producto.nombre}): `);
  if (nombre.trim()) producto.nombre = nombre.trim();
  
  const tipo = await rl.question(`Tipo (${producto.tipo}): `);
  if (tipo.trim()) producto.tipo = tipo.trim();
  
  const precioInput = await rl.question(`Precio (${producto.precio}): `);
  if (precioInput.trim()) {
    const precio = parseFloat(precioInput);
    if (!isNaN(precio)) producto.precio = precio;
    else console.log("Precio inválido, se mantiene el actual.");
  }
  
  const stockInput = await rl.question(`Stock (${producto.stock}): `);
  if (stockInput.trim()) {
    const stock = parseInt(stockInput);
    if (!isNaN(stock)) producto.stock = stock;
    else console.log("Stock inválido, se mantiene el actual.");
  }
  
  console.log("\nProducto actualizado con éxito.");
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

async function buscarProductos(rl) {
  console.log("\n--- BUSCAR PRODUCTOS ---");
  console.log("1. Productos baratos (menos de $50)");
  console.log("2. Productos caros ($50 o más)");
  console.log("3. Sólo Bebidas");
  console.log("4. Sólo Comidas");
  console.log("5. Buscar por nombre exacto");
  
  const opcion = await rl.question("Elija un filtro (1-5): ");
  let resultados = [];

  switch(opcion.trim()) {
    case '1':
      resultados = db.productos.filter(p => p.precio < 50);
      break;
    case '2':
      resultados = db.productos.filter(p => p.precio >= 50);
      break;
    case '3':
      resultados = db.productos.filter(p => p.tipo.toLowerCase() === 'bebida');
      break;
    case '4':
      resultados = db.productos.filter(p => p.tipo.toLowerCase() === 'comida');
      break;
    case '5':
      const nombre = await rl.question("Ingrese el nombre exacto: ");
      const encontrado = db.productos.find(p => p.nombre.toLowerCase() === nombre.trim().toLowerCase());
      if (encontrado) resultados = [encontrado];
      break;
    default:
      console.log("Opción inválida.");
      return;
  }

  mostrarProductos(resultados);
  await rl.question("ENTER para continuar...");
}

async function menuPromociones(rl) {
  let salir = false;
  
  while (!salir) {
    console.clear();
    console.log("**************************************************");
    console.log("*               MENÚ PROMOCIONES                 *");
    console.log("**************************************************");
    console.log("1. Ver promociones");
    console.log("2. Agregar promoción");
    console.log("3. Volver al menú cocina");
    console.log("**************************************************");
    
    const opcion = await rl.question("Elija una opción (1-3): ");
    
    switch(opcion.trim()) {
      case '1':
        console.log("\n--- LISTA DE PROMOCIONES ---");
        if (!db.promociones || db.promociones.length === 0) {
          console.log("No hay promociones registradas.");
        } else {
          db.promociones.forEach((p, i) => {
            console.log(`${i + 1}. ${p.nombre} - Descuento: ${p.descuento}%`);
          });
        }
        await rl.question("--> Dale ENTER para continuar...");
        break;
      case '2':
        console.log("\n--- AGREGAR PROMOCIÓN ---");
        const nombre = await rl.question("Nombre de la promoción: ");
        const descuentoInput = await rl.question("Porcentaje de descuento (ej. 15): ");
        const descuento = parseFloat(descuentoInput);
        
        if (nombre.trim() && !isNaN(descuento)) {
          if (!db.promociones) db.promociones = [];
          db.promociones.push({ nombre: nombre.trim(), descuento });
          console.log("Promoción agregada.");
        } else {
          console.log("Datos inválidos.");
        }
        await rl.question("ENTER para continuar...");
        break;
      case '3':
        salir = true;
        break;
      default:
        console.log("--> Opción inválida.");
        await new Promise(r => setTimeout(r, 1000));
        break;
    }
  }
}

export default cocinaMenu;
