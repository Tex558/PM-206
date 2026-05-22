import db from './db.js';

let carrito = [];
let rl;

function limpiarConsola() {
  console.clear();
}

function mostrarBanner() {
  limpiarConsola();
  
  console.log("BIENVENIDO A COFFEE SHOP\n");
  
}

function mostrarMenu() {
  console.log("");
  console.log("1. Consultar cafes y productos (con filtros)");
  console.log("2. Gestionar mi carrito y pagar pedido (" + carrito.length + " items)");
  console.log("3. Consultar mis pedidos (con filtros)");
  console.log("4. Ver promociones activas en detalle");
  console.log("5. Salir del programa\n");
}

function mostrarTablaProductos(lista) {
  console.log("\nLISTA DE PRODUCTOS DISPONIBLES");
  lista.forEach(p => {
    const tipo = p.tipo || 'General';
    console.log("ID: " + p.id + " | " + p.nombre.padEnd(23) + " | Tipo: " + tipo.padEnd(8) + " | Precio: $" + p.precio.toFixed(2) + " | Stock: " + p.stock);
  });
  console.log("");
}

async function consultarProductos() {
  mostrarBanner();
  console.log("\nFILTRAR CATALOGO DE PRODUCTOS");
  console.log("1. Mostrar todo el catalogo");
  console.log("2. Mostrar Bebidas");
  console.log("3. Mostrar Comidas");
  console.log("4. Mostrar Productos baratos");
  console.log("5. Mostrar Productos caros\n");
  
  const opFiltro = await rl.question("Elige como quieres filtrar (1-5): ");
  let productosFiltrados = db.productos;
  
  switch (opFiltro.trim()) {
    case '1':
      productosFiltrados = db.productos;
      break;
    case '2':
      productosFiltrados = db.productos.filter(p => p.tipo && p.tipo.toLowerCase() === 'bebida');
      break;
    case '3':
      productosFiltrados = db.productos.filter(p => p.tipo && p.tipo.toLowerCase() === 'comida');
      break;
    case '4':
      productosFiltrados = db.productos.filter(p => p.precio <= 55.00);
      break;
    case '5':
      productosFiltrados = db.productos.filter(p => p.precio > 55.00);
      break;
    default:
      console.log("--> Opcion no valida. Mostrando todo el catalogo por defecto.");
      break;
  }
  
  mostrarBanner();
  mostrarTablaProductos(productosFiltrados);
  
  const agregarAlCarrito = await rl.question("¿Desea agregar algun producto de la lista a su carrito? (s/n): ");
  if (agregarAlCarrito.toLowerCase() === 's' || agregarAlCarrito.toLowerCase() === 'si') {
    const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
    const prodId = parseInt(idInput);
    
    const producto = db.productos.find(p => p.id === prodId);
    if (!producto) {
      console.log("--> ¡Error! Ese ID de producto no existe.");
      await rl.question("\n--> Dale ENTER para regresar...");
      return;
    }
    
    if (producto.stock <= 0) {
      console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
      await rl.question("\n--> Dale ENTER para regresar...");
      return;
    }
    
    const cantInput = await rl.question("¿Cuantos quieres llevar?: ");
    const cantidad = parseInt(cantInput);
    
    if (isNaN(cantidad) || cantidad <= 0) {
      console.log("--> ¡Ojo! Tienes que llevar al menos 1 unidad.");
      await rl.question("\n--> Dale ENTER para regresar...");
      return;
    }
    
    if (cantidad > producto.stock) {
      console.log("--> ¡No hay tanto! Solo nos quedan " + producto.stock + " unidades.");
      await rl.question("\n--> Dale ENTER para regresar...");
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
  
  
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function crearPedido() {
  let salirCarrito = false;
  
  while (!salirCarrito) {
    mostrarBanner();
    console.log("\nGESTIONAR MI CARRITO DE COMPRAS");
    
    if (carrito.length === 0) {
      console.log("\nSu carrito de compras esta vacio.");
      console.log("\n1. Agregar producto al carrito (ver catalogo completo)");
      console.log("2. Regresar al menu principal\n");
      
      const opVacia = await rl.question("Elige una opcion (1-2): ");
      if (opVacia.trim() === '1') {
        mostrarBanner();
        mostrarTablaProductos(db.productos);
        
        const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
        const prodId = parseInt(idInput);
        
        const producto = db.productos.find(p => p.id === prodId);
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

    let porcentajeDescuento = 0;
    if (db.promociones && db.promociones.length > 0) {
      db.promociones.forEach(promo => {
        porcentajeDescuento += promo.descuento;
      });
    }
    if (porcentajeDescuento > 100) porcentajeDescuento = 100;

    const descuentoTotal = subtotalOriginal * (porcentajeDescuento / 100);
    const totalFinal = subtotalOriginal - descuentoTotal;

    console.log("\nProductos en su carrito actual:");
    carrito.forEach(item => {
      console.log("- " + item.producto.nombre.padEnd(25) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
    });
    console.log("");
    console.log("Subtotal:                     $" + subtotalOriginal.toFixed(2));
    if (descuentoTotal > 0) {
      console.log(`Descuento (${porcentajeDescuento}%):              -$${descuentoTotal.toFixed(2)}`);
    }
    console.log("");
    console.log("TOTAL A PAGAR:                $" + totalFinal.toFixed(2));
    console.log("");
    
    console.log("1. Agregar mas productos al carrito");
    console.log("2. Quitar un producto del carrito");
    console.log("3. Confirmar pedido y pagar (Finalizar compra)");
    console.log("4. Vaciar todo el carrito");
    console.log("5. Regresar al menu principal (conservar carrito)\n");
    
    const opCar = await rl.question("Elige una opcion (1-5): ");
    
    switch (opCar.trim()) {
      case '1':
        mostrarBanner();
        mostrarTablaProductos(db.productos);
        
        const idInput = await rl.question("\nIngrese el ID del producto a agregar: ");
        const prodId = parseInt(idInput);
        
        const producto = db.productos.find(p => p.id === prodId);
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
        
        const idPedido = "PED-" + String(db.idPedidoActual).padStart(3, '0');
        
        mostrarBanner();
        console.log("\nCONFIRMACION DE COMPRA - " + idPedido);
        console.log("Cliente: " + cliente);
        console.log("Fecha:   " + new Date().toLocaleString() + "\n");
        console.log("Detalle final:");
        carrito.forEach(item => {
          console.log("- " + item.producto.nombre.padEnd(25) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
        });
        console.log("");
        console.log("Subtotal:                     $" + subtotalOriginal.toFixed(2));
        if (descuentoTotal > 0) {
          console.log(`Descuento (${porcentajeDescuento}%):              -$${descuentoTotal.toFixed(2)}`);
        }
        console.log("");
        console.log("TOTAL PAGADO:                 $" + totalFinal.toFixed(2));
        console.log("");
        
        const confirmar = await rl.question("\n¿Confirmar y pagar el pedido? (s/n): ");
        if (confirmar.toLowerCase() === 's' || confirmar.toLowerCase() === 'si') {
          carrito.forEach(item => {
            item.producto.stock -= item.cantidad;
          });
          
          db.pedidos.push({
            id: idPedido,
            cliente: cliente,
            fecha: new Date(),
            items: [...carrito],
            subtotal: subtotalOriginal,
            descuento: descuentoTotal,
            total: totalFinal,
            origen: 'Cliente'
          });
          
          db.idPedidoActual++;
          carrito = [];
          console.log("\n--> ¡Pago exitoso! Pedido " + idPedido + " registrado y stock descontado.");
          salirCarrito = true;
        } else {
          console.log("\n--> Registro cancelado. Su carrito se conserva.");
        }
        
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
  console.log("\nFILTRAR MIS PEDIDOS\n");
  console.log("1. Ver todos mis pedidos");
  console.log("2. Ver mis pedidos baratos");
  console.log("3. Ver mis pedidos caros");
  console.log("4. Ver pedidos que tienen Bebidas");
  console.log("5. Ver pedidos que tienen Comida");
  console.log("6. Regresar al menu principal");
  
  
  const opFiltro = await rl.question("Elige una opcion (1-6): ");
  let pedidosFiltrados = db.pedidos;
  
  switch (opFiltro.trim()) {
    case '1':
      pedidosFiltrados = db.pedidos;
      break;
    case '2':
      pedidosFiltrados = db.pedidos.filter(p => (p.total || 0) <= 100.00);
      break;
    case '3':
      pedidosFiltrados = db.pedidos.filter(p => (p.total || 0) > 100.00);
      break;
    case '4':
      pedidosFiltrados = db.pedidos.filter(p => 
        p.items.some(item => item.producto.tipo && item.producto.tipo.toLowerCase() === 'bebida')
      );
      break;
    case '5':
      pedidosFiltrados = db.pedidos.filter(p => 
        p.items.some(item => item.producto.tipo && item.producto.tipo.toLowerCase() === 'comida')
      );
      break;
    case '6':
      return;
    default:
      console.log("--> Opcion no valida. Mostrando todos los pedidos por defecto.");
      pedidosFiltrados = db.pedidos;
      break;
  }

  mostrarBanner();
  console.log("\nMIS PEDIDOS ENCONTRADOS\n");

  if (pedidosFiltrados.length === 0) {
    console.log("\n--> ¡Aviso! No se encontraron pedidos con ese filtro.");
    
    await rl.question("--> Dale ENTER para regresar...");
    return;
  }

  pedidosFiltrados.forEach(p => {
    console.log("\n==================================================");
    console.log("Pedido ID: " + p.id + " | Cliente: " + p.cliente);
    console.log("Fecha: " + p.fecha.toLocaleString());
    
    p.items.forEach(item => {
      console.log("  - " + item.producto.nombre.padEnd(22) + " x" + item.cantidad + " | Subtotal: $" + item.subtotal.toFixed(2));
    });
    
    console.log("Subtotal:               $" + (p.subtotal || 0).toFixed(2));
    if (p.descuento > 0) {
      console.log("Descuento aplicado:    -$" + p.descuento.toFixed(2));
    }
    if (p.iva > 0) {
      console.log("IVA (16%):              $" + p.iva.toFixed(2));
    }
    console.log("Total del Pedido:       $" + (p.total || 0).toFixed(2));
    
  });

  
  await rl.question("--> Dale ENTER para regresar al menu...");
}

async function verPromociones() {
  mostrarBanner();
  console.log("\nDETALLE DE NUESTRAS PROMOCIONES\n");
  if (!db.promociones || db.promociones.length === 0) {
    console.log("Actualmente no tenemos promociones activas. ¡Vuelve pronto!");
  } else {
    db.promociones.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nombre}`);
      console.log(`   ¡Disfruta de un ${p.descuento}% de descuento en tu compra!\n`);
    });
  }
  await rl.question("\n--> Dale ENTER para regresar al menu...");
}

export default async function clienteMenu(rlParam) {
  rl = rlParam;
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
        break;
      default:
        console.log("\n--> ¡Error! Esa opcion no vale. Elige un numero del 1 al 5.");
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
    }
  }
}
