document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDelCarrito();

    
    function cargarProductosDelCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
        const cuerpoTablaCarrito = document.querySelector('#cuerpo-tabla-carrito'); 

        if (!cuerpoTablaCarrito) return; 

        cuerpoTablaCarrito.innerHTML = ''; 

        if (carrito.length === 0) {
            cuerpoTablaCarrito.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agrega productos desde la <a href="./tienda.html">tienda</a>.</td></tr>';
        } else {
            carrito.forEach(producto => {
                const filaHTML = crearFilaProductoCarrito(producto);
                cuerpoTablaCarrito.innerHTML += filaHTML; 
            });
        }

        actualizarTotalGeneralCarrito();
        adjuntarEventosFilaCarrito(); 
    }

    function crearFilaProductoCarrito(producto) {
        const subtotalProducto = (producto.price * producto.cantidad).toFixed(2);

        const tituloMostrado = producto.title.length > 50 ? producto.title.substring(0, 50) + '...' : producto.title;
        
        return `
            <tr>
                <td>
                    <button id="${producto.id}" class="btn-eliminar"><i class="far fa-times-circle"></i></button>
                </td>
                <td>
                    <img src="${producto.image}" alt="${producto.title}">
                </td>
                <td>${tituloMostrado}</td>
                <td>$${producto.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${producto.cantidad}" min="1" data-id-producto="${producto.id}" class="cantidad-producto">
                </td>
                <td>$${subtotalProducto}</td>
            </tr>
        `;
    }

    function actualizarTotalGeneralCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
        let subtotalCalculado = 0;
        carrito.forEach(producto => {
            subtotalCalculado += producto.price * producto.cantidad;
        });

        document.getElementById('total-subtotal').textContent = `$${subtotalCalculado.toFixed(2)}`;
        document.getElementById('total-final').textContent = `$${subtotalCalculado.toFixed(2)}`;
    }

    function adjuntarEventosFilaCarrito() {
        
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', () => {
                let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
                const idProducto = parseInt(boton.id); 
                const indiceProducto = carrito.findIndex(producto => producto.id === idProducto);

                if (indiceProducto !== -1) {
                    carrito.splice(indiceProducto, 1); 
                    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito)); 
                    cargarProductosDelCarrito(); 
                    console.log(`Producto con ID ${idProducto} eliminado del carrito`);
                }
            });
        });
        document.querySelectorAll('.cantidad-producto').forEach(input => {
            input.addEventListener('change', () => {
                let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
                const idProducto = parseInt(input.dataset.idProducto); 
                let nuevaCantidad = parseInt(input.value);


                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                    input.value = 1;
                }

                const producto = carrito.find(item => item.id === idProducto);

                if (producto) {
                    producto.cantidad = nuevaCantidad; 
                    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito)); 
                    actualizarTotalesFilaYGeneralCarrito(); 
                    console.log(`Cantidad del producto ID ${idProducto} actualizada a ${nuevaCantidad}`);
                }
            });
        });
    }

   
    function actualizarTotalesFilaYGeneralCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

        
        const filas = document.querySelectorAll('#cuerpo-tabla-carrito tr');
        filas.forEach(fila => {
            const inputCantidad = fila.querySelector('.cantidad-producto');
            if (inputCantidad) {
                const idProducto = parseInt(inputCantidad.dataset.idProducto);
                const producto = carrito.find(item => item.id === idProducto);
                if (producto) {
                    const celdaSubtotal = fila.cells[5]; 
                    const subtotalProducto = (producto.price * producto.cantidad).toFixed(2);
                    celdaSubtotal.textContent = `$${subtotalProducto}`;
                }
            }
        });
        actualizarTotalGeneralCarrito(); 
    }
});