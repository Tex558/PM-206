import db from './db.js';
import { prepararPedidoPromesa } from './cocina.js';

const IVA = 0.16;

function mostrarTablaProductos() {
  console.log("\nLISTA DE PRODUCTOS DISPONIBLES");
  if (db.productos.length === 0) {
    console.log("Actualmente no hay productos disponibles.");
  } else {
    db.productos.forEach(p => {
      const { id, nombre, precio, stock } = p;
      console.log(`ID: ${id} | ${nombre.padEnd(20)} | Precio: $${precio.toFixed(2)} | Stock: ${stock}`);
    });
  }
  console.log("");
}

function notificarCajaCallback(error, resultado, pedidoId) {
  if (error) {
    console.log(`\n[NOTIFICACIÓN CAJA] El pedido #${pedidoId} fue CANCELADO. Motivo: ${error.reason.toUpperCase()}`);
  } else {
    console.log(`\n[NOTIFICACIÓN CAJA] ¡El pedido #${pedidoId} está listo! Estado: ${resultado.toUpperCase()}`);
  }
}

function iniciarProcesamientoConCallback(pedido, tiempoMs, callback) {
  pedido.estado = 'Preparando....';
  
  prepararPedidoPromesa(pedido, tiempoMs)
    .then(resultado => {
      pedido.estado = 'Empacado....';
      setTimeout(() => {
        pedido.estado = 'Pedido entregado';
        callback(null, 'Pedido entregado', pedido.id);
      }, 2000);
    })
    .catch(error => {
      pedido.estado = 'Cancelado';
      callback(error, null, pedido.id);
    });
}

async function crearPedido(rl) {
  console.clear();
  console.log("NUEVO PEDIDO - CAJA\n");
  
  mostrarTablaProductos();

  if (db.productos.length === 0) {
    await rl.question("\n--> No hay productos registrados para vender. Dale ENTER para volver...");
    return;
  }

  let cliente = "";
  while (cliente.trim() === "") {
    cliente = await rl.question("\nIngrese el nombre del cliente: ");
    if (cliente.trim() === "") {
      console.log("--> ¡Error! El nombre no puede estar vacío. Escríbelo de nuevo.");
    }
  }

  const itemsPedido = [];
  let agregarMas = true;

  while (agregarMas) {
    const idInput = await rl.question("\nIngrese el ID del producto a comprar: ");
    const prodId = parseInt(idInput);

    const producto = db.productos.find(p => p.id === prodId);
    if (!producto) {
      console.log("--> ¡Error! Ese ID de producto no existe. Intenta con otro.");
      continue;
    }

    if (producto.stock <= 0) {
      console.log("--> ¡Lo sentimos! Ya no tenemos stock de: " + producto.nombre);
      continue;
    }

    const { nombre, precio, stock } = producto;
    console.log(`Seleccionado: ${nombre} | Precio: $${precio.toFixed(2)} | Stock actual: ${stock}`);

    let cantidad = 0;
    while (true) {
      const cantInput = await rl.question("¿Cuántos quieres llevar?: ");
      cantidad = parseInt(cantInput);

      if (isNaN(cantidad) || cantidad <= 0) {
        console.log("--> ¡Ojo! Tienes que llevar al menos 1.");
      } else if (cantidad > producto.stock) {
        console.log(`--> ¡No hay tanto! Solo nos quedan ${producto.stock} unidades.`);
      } else {
        break;
      }
    }

    const itemExistente = itemsPedido.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad > producto.stock) {
        console.log("--> ¡Alerta! No puedes agregar más. Supera el stock disponible.");
      } else {
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        console.log("--> Ok, cantidad actualizada para: " + producto.nombre);
      }
    } else {
      itemsPedido.push({
        producto: producto,
        amount: cantidad,
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
    await rl.question("\n--> Dale ENTER para volver...");
    return;
  }

  const subtotal = itemsPedido.reduce((acumulador, { subtotal }) => acumulador + subtotal, 0);
  const iva = subtotal * IVA;
  const total = subtotal + iva;
  const idPedido = "PED-" + String(db.idPedidoActual).padStart(3, '0');

  console.clear();
  console.log("\nCONFIRMACIÓN DE COMPRA - " + idPedido);
  console.log("Cliente: " + cliente);
  console.log("Fecha:   " + new Date().toLocaleString() + "\n");
  
  console.log("Detalle de la compra:");
  itemsPedido.forEach(item => {
    const { producto: { nombre }, cantidad, subtotal: subtotalItem } = item;
    console.log(`- ${nombre.padEnd(25)} x${cantidad} | Subtotal: $${subtotalItem.toFixed(2)}`);
  });

  console.log(`\nSubtotal (sin IVA):  $${subtotal.toFixed(2)}`);
  console.log(`IVA (16%):           $${iva.toFixed(2)}`);
  console.log(`TOTAL A PAGAR:       $${total.toFixed(2)}\n`);

  const confirmar = await rl.question("\n¿Guardar este pedido en el sistema y procesar pago? (s/n): ");
  if (confirmar.toLowerCase() === 's' || confirmar.toLowerCase() === 'si') {
    itemsPedido.forEach(item => {
      item.producto.stock -= item.cantidad;
    });

    const nuevoPedido = {
      id: idPedido,
      cliente: cliente,
      fecha: new Date(),
      items: itemsPedido,
      subtotal: subtotal,
      iva: iva,
      total: total,
      estado: 'recibido',
      tiempoMinutos: 0.16
    };
    db.pedidos.push(nuevoPedido);

    db.idPedidoActual++;
    console.log(`\n--> ¡Listo! Pedido ${idPedido} registrado y stock descontado.`);
    console.log(`--> Preparando pedido en segundo plano...`);

    iniciarProcesamientoConCallback(nuevoPedido, 10000, notificarCajaCallback);
  } else {
    console.log("\n--> Pedido cancelado. No se realizó ningún cambio.");
  }

  await rl.question("\n--> Dale ENTER para continuar...");
}

async function listarPedidos(rl) {
  console.clear();
  console.log("\nHISTORIAL DE PEDIDOS\n");

  if (db.pedidos.length === 0) {
    console.log("\n--> ¡Aviso! No hay ningún pedido guardado todavía.");
    await rl.question("\n--> Dale ENTER para volver...");
    return;
  }

  db.pedidos.forEach(p => {
    const { id, cliente, fecha, items, subtotal, descuento, iva, total, estado } = p;

    console.log("\n==================================================");
    console.log(`Pedido ID: ${id} | Cliente: ${cliente} | Estado actual: ${estado.toUpperCase()}`);
    console.log(`Fecha: ${fecha.toLocaleString()}`);
    console.log("--------------------------------------------------");

    items.forEach(item => {
      const { producto: { nombre }, cantidad, subtotal: subtotalItem } = item;
      console.log(`  - ${nombre.padEnd(22)} x${cantidad} | Subtotal: $${subtotalItem.toFixed(2)}`);
    });

    console.log("--------------------------------------------------");
    console.log(`Subtotal (sin desc.):         $${(subtotal || 0).toFixed(2)}`);
    if (descuento > 0) {
      console.log(`Descuento aplicado:          -$${descuento.toFixed(2)}`);
    }
    console.log(`IVA (16%):                    $${(iva || 0).toFixed(2)}`);
    console.log("--------------------------------------------------");
    console.log(`Total del Pedido:             $${(total || 0).toFixed(2)}`);
    console.log("==================================================");
  });

  await rl.question("\n--> Dale ENTER para regresar...");
}

async function cajaMenu(rl) {
  let salir = false;
  
  while (!salir) {
    console.clear();
    console.log("MÓDULO CAJA\n");
    console.log("1. Crear nuevo pedido (Punto de Venta)");
    console.log("2. Listar todos los pedidos");
    console.log("3. Volver al menú principal\n");
    
    const opcion = await rl.question("Elija una opción (1-3): ");
    
    switch (opcion.trim()) {
      case '1':
        await crearPedido(rl);
        break;
      case '2':
        await listarPedidos(rl);
        break;
      case '3':
        salir = true;
        break;
      default:
        console.log("\n--> ¡Error! Opción inválida.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
    }
  }
}

export {
  cajaMenu,
  crearPedido,
  listarPedidos
};
