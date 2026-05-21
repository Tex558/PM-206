const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const productos = [
  { id: 1, nombre: 'Espresso Solo', precio: 45.00, stock: 15, categoria: 'Bebidas Calientes' },
  { id: 2, nombre: 'Cafe Americano', precio: 58.00, stock: 20, categoria: 'Bebidas Calientes' },
  { id: 3, nombre: 'Capuccino Tradicional', precio: 72.00, stock: 12, categoria: 'Bebidas Calientes' },
  { id: 4, nombre: 'Latte Macchiato', precio: 78.00, stock: 10, categoria: 'Bebidas Calientes' },
  { id: 5, nombre: 'Caramel Frappuccino', precio: 89.00, stock: 8, categoria: 'Bebidas Frias' },
  { id: 6, nombre: 'Muffin de Chocolate', precio: 45.00, stock: 15, categoria: 'Panaderia' }
];

const pedidos = [];
let contadorPedidos = 1;
let carrito = [];

const rl = readline.createInterface({ input, output });

function limpiarConsola() {
  console.clear();
}

function mostrarBanner() {
  limpiarConsola();
  console.log("**************************************************");
  console.log("*            BIENVENIDO A COFFEE SHOP            *");
  console.log("**************************************************");
  console.log("--> PROMO: 10% de descuento en compras de mas de $150!");
  console.log("--> COMBO: Compra Cafe Americano + Muffin por solo $90!");
  console.log("**************************************************");
}

function mostrarMenu() {
  console.log("");
  console.log("1. Consultar cafes y productos (con filtros)");
  console.log("2. Gestionar mi carrito y pagar pedido (" + carrito.length + " items)");
  console.log("3. Consultar mis pedidos (con filtros)");
  console.log("4. Ver promociones activas en detalle");
  console.log("5. Salir del programa");
  console.log("**************************************************");
}

function mostrarTablaProductos(lista) {
  console.log("");
  console.log("=== LISTA DE PRODUCTOS DISPONIBLES ===");
  lista.forEach(p => {
    console.log("ID: " + p.id + " | " + p.nombre.padEnd(23) + " | Categoria: " + p.categoria.padEnd(18) + " | Precio: $" + p.precio.toFixed(2) + " | Stock: " + p.stock);
  });
  console.log("=======================================");
}

async function consultarProductos() {
  mostrarBanner();
  console.log("\n--- FILTRAR CATALOGO DE PRODUCTOS ---");
  console.log("1. Mostrar todo el catalogo");
  console.log("2. Mostrar Bebidas (Calientes y Frias)");
  console.log("3. Mostrar Comida (Panaderia)");
  console.log("4. Mostrar Productos baratos (Hasta $55 pesos)");
  console.log("5. Mostrar Productos caros (Mas de $55 pesos)");
  console.log("--------------------------------------------------");
  
  const opFiltro = await rl.question("Elige como quieres filtrar (1-5): ");
  let productosFiltrados = productos;
  
  switch (opFiltro.trim()) {
    case '1':
      productosFiltrados = productos;
      break;
    case '2':
      productosFiltrados = productos.filter(p => p.categoria.startsWith('Bebidas'));
      break;
    case '3':
      productosFiltrados = productos.filter(p => p.categoria === 'Panaderia');
      break;
    case '4':
      productosFiltrados = productos.filter(p => p.precio <= 55.00);
      break;
    case '5':
      productosFiltrados = productos.filter(p => p.precio > 55.00);
      break;
    default:
      console.log("--> Opcion no valida. Mostrando todo el catalogo por defecto.");
      break;
  }
  
  mostrarBanner();
  mostrarTablaProductos(productosFiltrados);
  console.log("--------------------------------------------------");
  
  const agregarAlCarrito = await rl.question("¿Desea agregar algun producto de la lista a su carrito? (s/n): ");
  if (agregarAlCarrito.toLowerCase() === 's' || agregarAlCarrito.toLowerCase() === 'si') {
    const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
    const prodId = parseInt(idInput);
    
    const producto = productos.find(p => p.id === prodId);
    if (!producto) {
      console.log("--> ¡Error! Ese ID de producto no existe.");
      console.log("--------------------------------------------------");
      await rl.question("--> Dale ENTER para regresar...");
      return;
    }
    
    if (producto.stock <= 0) {
      console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
      console.log("--------------------------------------------------");
      await rl.question("--> Dale ENTER para regresar...");
      return;
    }
    
    const cantInput = await rl.question("¿Cuantos quieres llevar?: ");
    const cantidad = parseInt(cantInput);
    
    if (isNaN(cantidad) || cantidad <= 0) {
      console.log("--> ¡Ojo! Tienes que llevar al menos 1 unidad.");
      console.log("--------------------------------------------------");
      await rl.question("--> Dale ENTER para regresar...");
      return;
    }
    
    if (cantidad > producto.stock) {
      console.log("--> ¡No hay tanto! Solo nos quedan " + producto.stock + " unidades.");
      console.log("--------------------------------------------------");
      await rl.question("--> Dale ENTER para regresar...");
      return;
    }
    
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad > producto.stock) {
        console.log("--> ¡Alerta! No puedes agregar mas. Supera el stock disponible.");
      } else {
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        console.log("--> Cantidad actualizada en el carrito para: " + producto.nombre);
      }
    } else {
      carrito.push({
        producto: producto,
        cantidad: cantidad,
        subtotal: cantidad * producto.precio
      });
      console.log("--> Agregado al carrito de compras.");
    }
  }
  
  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function crearPedido() {
  let salirCarrito = false;
  
  while (!salirCarrito) {
    mostrarBanner();
    console.log("\n--- GESTIONAR MI CARRITO DE COMPRAS ---");
    
    if (carrito.length === 0) {
      console.log("\nSu carrito de compras esta vacio.");
      console.log("--------------------------------------------------");
      console.log("1. Agregar producto al carrito (ver catalogo completo)");
      console.log("2. Regresar al menu principal");
      console.log("--------------------------------------------------");
      
      const opVacia = await rl.question("Elige una opcion (1-2): ");
      if (opVacia.trim() === '1') {
        mostrarBanner();
        mostrarTablaProductos(productos);
        
        const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
        const prodId = parseInt(idInput);
        
        const producto = productos.find(p => p.id === prodId);
        if (!producto) {
          console.log("--> ¡Error! Ese ID de producto no existe.");
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        
        if (producto.stock <= 0) {
          console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        
        const cantInput = await rl.question("¿Cuantos quieres llevar?: ");
        const cantidad = parseInt(cantInput);
        
        if (isNaN(cantidad) || cantidad <= 0) {
          console.log("--> ¡Ojo! Tienes que llevar al menos 1 unidad.");
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        
        if (cantidad > producto.stock) {
          console.log("--> ¡No hay tanto! Solo nos quedan " + producto.stock + " unidades.");
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        
        carrito.push({
          producto: producto,
          cantidad: cantidad,
          subtotal: cantidad * producto.precio
        });
        console.log("--> Producto agregado al carrito.");
        await new Promise(r => setTimeout(r, 1500));
      } else {
        salirCarrito = true;
      }
      continue;
    }
    
    let subtotalOriginal = 0;
    carrito.forEach(item => {
      subtotalOriginal += item.subtotal;
    });

    let descuentoCombo = 0;
    const itemAmericano = carrito.find(item => item.producto.id === 2);
    const itemMuffin = carrito.find(item => item.producto.id === 6);
    
    if (itemAmericano && itemMuffin) {
      const parejasCombo = Math.min(itemAmericano.cantidad, itemMuffin.cantidad);
      descuentoCombo = parejasCombo * 13.00;
    }

    const subtotalConCombo = subtotalOriginal - descuentoCombo;
    let descuentoMonto = 0;
    if (subtotalConCombo > 150.00) {
      descuentoMonto = subtotalConCombo * 0.10;
    }

    const totalFinal = subtotalConCombo - descuentoMonto;

    console.log("\nProductos en su carrito actual:");
    carrito.forEach(item => {
      console.log("- " + item.producto.nombre.padEnd(25) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
    });
    console.log("--------------------------------------------------");
    console.log("Subtotal original:            $" + subtotalOriginal.toFixed(2));
    if (descuentoCombo > 0) {
      console.log("Ahorro por combo (Americano+Muffin): -$" + descuentoCombo.toFixed(2));
    }
    if (descuentoMonto > 0) {
      console.log("Descuento del 10% (> $150):         -$" + descuentoMonto.toFixed(2));
    }
    console.log("--------------------------------------------------");
    console.log("TOTAL A PAGAR (PREVIO):       $" + totalFinal.toFixed(2));
    console.log("--------------------------------------------------");
    
    console.log("1. Agregar mas productos al carrito");
    console.log("2. Quitar un producto del carrito");
    console.log("3. Confirmar pedido y pagar (Finalizar compra)");
    console.log("4. Vaciar todo el carrito");
    console.log("5. Regresar al menu principal (conservar carrito)");
    console.log("--------------------------------------------------");
    
    const opCar = await rl.question("Elige una opcion (1-5): ");
    
    switch (opCar.trim()) {
      case '1':
        mostrarBanner();
        mostrarTablaProductos(productos);
        
        const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
        const prodId = parseInt(idInput);
        
        const producto = productos.find(p => p.id === prodId);
        if (!producto) {
          console.log("--> ¡Error! Ese ID de producto no existe.");
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
        
        if (producto.stock <= 0) {
          console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
        
        const cantInput = await rl.question("¿Cuantos quieres llevar?: ");
        const cantidad = parseInt(cantInput);
        
        if (isNaN(cantidad) || cantidad <= 0) {
          console.log("--> ¡Ojo! Tienes que llevar al menos 1 unidad.");
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
        
        if (cantidad > producto.stock) {
          console.log("--> ¡No hay tanto! Solo nos quedan " + producto.stock + " unidades.");
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
        
        const itemExistente = carrito.find(item => item.producto.id === producto.id);
        if (itemExistente) {
          if (itemExistente.cantidad + cantidad > producto.stock) {
            console.log("--> ¡Alerta! No puedes agregar mas. Supera el stock disponible.");
          } else {
            itemExistente.cantidad += cantidad;
            itemExistente.subtotal = itemExistente.cantidad * producto.precio;
            console.log("--> Cantidad actualizada.");
          }
        } else {
          carrito.push({
            producto: producto,
            cantidad: cantidad,
            subtotal: cantidad * producto.precio
          });
          console.log("--> Agregado al carrito.");
        }
        await new Promise(r => setTimeout(r, 1500));
        break;
        
      case '2':
        const idQuitarInput = await rl.question("\nIngrese el ID del producto a quitar: ");
        const idQuitar = parseInt(idQuitarInput);
        
        const indexQuitar = carrito.findIndex(item => item.producto.id === idQuitar);
        if (indexQuitar === -1) {
          console.log("--> ¡Aviso! Ese producto no esta en su carrito.");
          await new Promise(r => setTimeout(r, 1500));
          break;
        }
        
        carrito.splice(indexQuitar, 1);
        console.log("--> Producto eliminado de su carrito.");
        await new Promise(r => setTimeout(r, 1500));
        break;
        
      case '3':
        let cliente = "";
        while (cliente.trim() === "") {
          cliente = await rl.question("\nIngrese su nombre para registrar la compra: ");
          if (cliente.trim() === "") {
            console.log("--> ¡Error! Debe ingresar un nombre.");
          }
        }
        
        let stockValido = true;
        for (const item of carrito) {
          if (item.cantidad > item.producto.stock) {
            console.log("--> ¡Error! Ya no hay suficiente stock de " + item.producto.nombre + " (Disponible: " + item.producto.stock + ")");
            stockValido = false;
          }
        }
        
        if (!stockValido) {
          console.log("--> Por favor, ajuste las cantidades o vacie el carrito.");
          await new Promise(r => setTimeout(r, 3000));
          break;
        }
        
        const idPedido = "PED-" + String(contadorPedidos).padStart(3, '0');
        
        mostrarBanner();
        console.log("\n--- CONFIRMACION DE COMPRA - " + idPedido + " ---");
        console.log("Cliente: " + cliente);
        console.log("Fecha:   " + new Date().toLocaleString());
        console.log("--------------------------------------------------");
        console.log("Detalle final:");
        carrito.forEach(item => {
          console.log("- " + item.producto.nombre.padEnd(25) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
        });
        console.log("--------------------------------------------------");
        console.log("Subtotal original:            $" + subtotalOriginal.toFixed(2));
        if (descuentoCombo > 0) {
          console.log("Ahorro por combo (Americano+Muffin): -$" + descuentoCombo.toFixed(2));
        }
        if (descuentoMonto > 0) {
          console.log("Descuento del 10% (> $150):         -$" + descuentoMonto.toFixed(2));
        }
        console.log("--------------------------------------------------");
        console.log("TOTAL PAGADO:                 $" + totalFinal.toFixed(2));
        console.log("--------------------------------------------------");
        
        const confirmar = await rl.question("\n¿Confirmar y pagar el pedido? (s/n): ");
        if (confirmar.toLowerCase() === 's' || confirmar.toLowerCase() === 'si') {
          carrito.forEach(item => {
            item.producto.stock -= item.cantidad;
          });
          
          pedidos.push({
            id: idPedido,
            cliente: cliente,
            fecha: new Date(),
            items: [...carrito],
            subtotalOriginal: subtotalOriginal,
            descuentoCombo: descuentoCombo,
            descuentoMonto: descuentoMonto,
            total: totalFinal
          });
          
          contadorPedidos++;
          carrito = [];
          console.log("\n--> ¡Pago exitoso! Pedido " + idPedido + " registrado y stock descontado.");
          salirCarrito = true;
        } else {
          console.log("\n--> Registro cancelado. Su carrito se conserva.");
        }
        console.log("--------------------------------------------------");
        await rl.question("--> Dale ENTER para continuar...");
        break;
        
      case '4':
        const confirmarVaciar = await rl.question("\n¿Esta seguro de vaciar todo su carrito? (s/n): ");
        if (confirmarVaciar.toLowerCase() === 's' || confirmarVaciar.toLowerCase() === 'si') {
          carrito = [];
          console.log("--> Carrito vaciado.");
        }
        await new Promise(r => setTimeout(r, 1500));
        break;
        
      case '5':
        salirCarrito = true;
        break;
        
      default:
        console.log("\n--> Opcion no valida. Elija un numero entre 1 y 5.");
        await new Promise(r => setTimeout(r, 2000));
        break;
    }
  }
}

async function listarPedidos() {
  mostrarBanner();
  console.log("\n--- FILTRAR MIS PEDIDOS ---");
  console.log("1. Ver todos mis pedidos");
  console.log("2. Ver mis pedidos baratos (Hasta $100 pesos)");
  console.log("3. Ver mis pedidos caros (Mas de $100 pesos)");
  console.log("4. Ver pedidos que tienen Bebidas");
  console.log("5. Ver pedidos que tienen Comida");
  console.log("6. Regresar al menu principal");
  console.log("--------------------------------------------------");
  
  const opFiltro = await rl.question("Elige una opcion (1-6): ");
  let pedidosFiltrados = pedidos;
  
  switch (opFiltro.trim()) {
    case '1':
      pedidosFiltrados = pedidos;
      break;
    case '2':
      pedidosFiltrados = pedidos.filter(p => p.total <= 100.00);
      break;
    case '3':
      pedidosFiltrados = pedidos.filter(p => p.total > 100.00);
      break;
    case '4':
      pedidosFiltrados = pedidos.filter(p => 
        p.items.some(item => item.producto.categoria.startsWith('Bebidas'))
      );
      break;
    case '5':
      pedidosFiltrados = pedidos.filter(p => 
        p.items.some(item => item.producto.categoria === 'Panaderia')
      );
      break;
    case '6':
      return;
    default:
      console.log("--> Opcion no valida. Mostrando todos los pedidos por defecto.");
      pedidosFiltrados = pedidos;
      break;
  }

  mostrarBanner();
  console.log("\n=== MIS PEDIDOS ENCONTRADOS ===");

  if (pedidosFiltrados.length === 0) {
    console.log("\n--> ¡Aviso! No se encontraron pedidos con ese filtro.");
    console.log("--------------------------------------------------");
    await rl.question("--> Dale ENTER para regresar...");
    return;
  }

  pedidosFiltrados.forEach(p => {
    console.log("\n==================================================");
    console.log("Pedido ID: " + p.id + " | Cliente: " + p.cliente);
    console.log("Fecha: " + p.fecha.toLocaleString());
    console.log("--------------------------------------------------");
    p.items.forEach(item => {
      console.log("  - " + item.producto.nombre.padEnd(22) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
    });
    console.log("--------------------------------------------------");
    console.log("Subtotal original:      $" + p.subtotalOriginal.toFixed(2));
    if (p.descuentoCombo > 0) {
      console.log("Descuento combo:       -$" + p.descuentoCombo.toFixed(2));
    }
    if (p.descuentoMonto > 0) {
      console.log("Descuento 10%:         -$" + p.descuentoMonto.toFixed(2));
    }
    console.log("Total del Pedido:       $" + p.total.toFixed(2));
    console.log("==================================================");
  });

  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function verPromociones() {
  mostrarBanner();
  console.log("\n=== DETALLE DE NUESTRAS PROMOCIONES ===");
  console.log("");
  console.log("1. COMBO CAFE Y MUFFIN");
  console.log("   Compra 1 Cafe Americano ($58.00) y 1 Muffin de Chocolate ($45.00)");
  console.log("   ¡y te llevas el paquete por solo $90.00 pesos!");
  console.log("   (Ahorras $13.00 pesos en cada combo)");
  console.log("");
  console.log("2. DESCUENTO DE LA CASA");
  console.log("   Si el total de tu pedido es mayor a $150.00 pesos");
  console.log("   (despues de aplicar combos), ¡te descontamos el 10%!");
  console.log("");
  console.log("--------------------------------------------------");
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function main() {
  let salir = false;
  
  while (!salir) {
    mostrarBanner();
    mostrarMenu();
    
    const opcion = await rl.question("Elija una opcion (1-5): ");
    
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
        await verPromociones();
        break;
      case '5':
        limpiarConsola();
        console.log("\n¡Gracias por venir! ¡Vuelve pronto por otro cafe!\n");
        salir = true;
        rl.close();
        break;
      default:
        console.log("\n--> ¡Error! Esa opcion no vale. Elige un numero del 1 al 5.");
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
