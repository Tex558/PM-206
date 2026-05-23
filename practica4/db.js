const db = {
    productos: [
        { id: 1, nombre: 'Espresso', tipo: 'Bebida', precio: 45.00, stock: 15 },
        { id: 2, nombre: 'Cafe', tipo: 'Bebida', precio: 58.00, stock: 20 },
        { id: 3, nombre: 'Capuccino', tipo: 'Bebida', precio: 72.00, stock: 12 },
        { id: 4, nombre: 'Latte', tipo: 'Bebida', precio: 78.00, stock: 10 },
        { id: 5, nombre: 'Pastel', tipo: 'Comida', precio: 89.00, stock: 8 },
        { id: 6, nombre: 'Muffin', tipo: 'Comida', precio: 45.00, stock: 15 }
    ],
    idProductoActual: 7,
    pedidos: [],
    idPedidoActual: 1,
    promociones: []
};

export default db;
