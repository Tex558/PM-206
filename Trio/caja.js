const readline = require('readline');

const pedidos = [];
let nextId = 1;

function agregarPedido(nombre, precio) {
if (!nombre || !precio || precio <= 0) {
    console.log('Error: nombre y precio valido son requeridos.');
    return;
}
const pedido = { id: nextId++, nombre, precio };
  pedidos.push(pedido);
  console.log(`Pedido agregado: [#${pedido.id}] ${nombre} - $${precio.toFixed(2)}`);
}

function listarPedidos() {
  if (pedidos.length === 0) {
    console.log('No hay pedidos registrados.');
    return;
  }
  console.log('\n_____PEDIDOS_____');
  pedidos.forEach(p => {
    console.log(`  #${p.id}  ${p.nombre.padEnd(20)} $${p.precio.toFixed(2)}`);
  });
  const total = pedidos.reduce((acc, p) => acc + p.precio, 0);
  console.log('---------------');
  console.log(`  TOTAL: $${total.toFixed(2)}`);
  console.log('');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function menu() {
  console.log('\n1) Agregar pedido');
  console.log('2) Listar pedidos');
  console.log('3) Salir');
  rl.question('> ', (op) => {
    if (op === '1') {
      rl.question('Nombre del producto: ', (nombre) => {
        rl.question('Precio: ', (precio) => {
          agregarPedido(nombre.trim(), parseFloat(precio));
          menu();
        });
      });
    } else if (op === '2') {
      listarPedidos();
      menu();
    } else if (op === '3') {
      console.log('Adiooooss');
      rl.close();
    } else {
      console.log('Esa opción es inválida, ingresa un valor entre el 1 y el 3');
      menu();
    }
  });
}

console.log('\n_____Bienvenido a café Tacvba_____');
menu();
