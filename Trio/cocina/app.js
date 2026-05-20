// Arreglo para almacenar los productos
let productos = [];
let idActual = 1;

// Función para listar los productos
function renderizarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.tipo}</td>
            <td>$${producto.precio}</td>
            <td class="acciones">
                <button onclick="editarProducto(${producto.id})">Editar</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;

        listaProductos.appendChild(tr);
    });
}

// Función para guardar un producto
function guardarProducto() {
    const inputID = document.getElementById('producto-id').value;
    const inputNombre = document.getElementById('producto-nombre').value;
    const inputTipo = document.getElementById('producto-tipo').value;
    const inputPrecio = document.getElementById('producto-precio').value;

    if (!inputNombre || !inputPrecio) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (inputID) {
        // Actualizar producto existente
        const indice = productos.findIndex(p => p.id == inputID);
        if (indice !== -1) {
            productos[indice] = {
                id: parseInt(inputID),
                nombre: inputNombre,
                tipo: inputTipo,
                precio: parseFloat(inputPrecio).toFixed(2)
            };
        }
    } else {
        // Agregar nuevo producto
        const nuevoProducto = {
            id: idActual++,
            nombre: inputNombre,
            tipo: inputTipo,
            precio: parseFloat(inputPrecio).toFixed(2)
        };
        productos.push(nuevoProducto);
    }

    limpiarFormulario();
    renderizarProductos();
}

// Función para cargar los datos de un producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-tipo').value = producto.tipo;
        document.getElementById('producto-precio').value = producto.precio;

        document.getElementById('titulo-formulario').innerText = 'Editar Producto';
    }
}

// Función para eliminar un producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        renderizarProductos();
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('producto-id').value = '';
    document.getElementById('producto-nombre').value = '';
    document.getElementById('producto-tipo').value = 'Bebida';
    document.getElementById('producto-precio').value = '';
    document.getElementById('titulo-formulario').innerText = 'Agregar Producto';
}

// Datos de prueba
productos.push({ id: idActual++, nombre: 'Café Latte', tipo: 'Bebida', precio: '45.00' });
productos.push({ id: idActual++, nombre: 'Cheesecake Fresa', tipo: 'Comida', precio: '65.00' });
productos.push({ id: idActual++, nombre: 'Malteada Chocolate', tipo: 'Bebida', precio: '55.00' });

renderizarProductos();
