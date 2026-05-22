const db = {
    productos: [
        { id: 1, nombre: 'Espresso Solo', tipo: 'Bebida', precio: 45.00, stock: 15 },
        { id: 2, nombre: 'Cafe Americano', tipo: 'Bebida', precio: 58.00, stock: 20 },
        { id: 3, nombre: 'Capuccino Tradicional', tipo: 'Bebida', precio: 72.00, stock: 12 },
        { id: 4, nombre: 'Latte Macchiato', tipo: 'Bebida', precio: 78.00, stock: 10 },
        { id: 5, nombre: 'Caramel Frappuccino', tipo: 'Bebida', precio: 89.00, stock: 8 },
        { id: 6, nombre: 'Muffin de Chocolate', tipo: 'Comida', precio: 45.00, stock: 15 }
    ],
    idProductoActual: 7,
    pedidos: [],
    idPedidoActual: 1,
    promociones: []
};

export default db;
