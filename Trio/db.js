const db = {
    productos: [
        { id: 1, nombre: 'Café', tipo: 'Bebida', precio: 45.00, stock: 15 },
        { id: 2, nombre: 'Cheesecake', tipo: 'Comida', precio: 65.00, stock: 10 },
        { id: 3, nombre: 'Malteada', tipo: 'Bebida', precio: 55.00, stock: 8 }
    ],
    idProductoActual: 4,
    pedidos: [],
    idPedidoActual: 1
};

module.exports = db;
