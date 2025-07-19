document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductosTienda = document.getElementById('contenedor-productos-tienda'); // ID 'contenedor-productos-tienda'
    const contenedorPaginacion = document.querySelector('.paginacion');
    const productosPorPagina = 8; 
    let paginaActual = 1; 
    let todosLosProductos = []; 

    
    async function obtenerTodosLosProductos() {
        if (!contenedorProductosTienda) return; 
        contenedorProductosTienda.innerHTML = '<p>Cargando productos de la tienda...</p>';
        try {
            const respuesta = await fetch('https://fakestoreapi.com/products');
            if (!respuesta.ok) {
                throw new Error(`Error HTTP! estado: ${respuesta.status}`);
            }
            todosLosProductos = await respuesta.json(); 
            mostrarProductosPorPagina(paginaActual);
            configurarPaginacion(); 
        } catch (error) {
            console.error('Error al cargar productos de la tienda:', error);
            contenedorProductosTienda.innerHTML = '<p>No se pudieron cargar los productos de la tienda. Por favor, intenta de nuevo más tarde.</p>';
        }
    }

   
    function mostrarProductosPorPagina(pagina) {
        paginaActual = pagina;
        const indiceInicio = (pagina - 1) * productosPorPagina;
        const indiceFin = indiceInicio + productosPorPagina;
        const productosAMostrar = todosLosProductos.slice(indiceInicio, indiceFin);

        contenedorProductosTienda.innerHTML = ''; 
        if (productosAMostrar.length === 0) {
            contenedorProductosTienda.innerHTML = '<p>No hay productos para mostrar en esta página.</p>';
            return;
        }

        productosAMostrar.forEach(producto => {
            const tarjetaProducto = document.createElement('div');
            tarjetaProducto.classList.add('producto');
            tarjetaProducto.innerHTML = `
                <img src="${producto.image}" alt="${producto.title}">
                <div class="producto-descripcion">
                    <span>${producto.category}</span>
                    <h5>${producto.title.length > 50 ? producto.title.substring(0, 50) + '...' : producto.title}</h5>
                    <h4>$${producto.price.toFixed(2)}</h4>
                </div>
                <a href="#" class="carrito" 
                   data-id-producto="${producto.id}" 
                   data-titulo-producto="${producto.title}" 
                   data-precio-producto="${producto.price}" 
                   data-imagen-producto="${producto.image}">
                    <i class="fal fa-shopping-cart"></i>
                </a>
            `;
            contenedorProductosTienda.appendChild(tarjetaProducto);
        });
        

        function adjuntarEventosAgregarAlCarritoTienda() { 
            document.querySelectorAll('#contenedor-productos-tienda .carrito').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const idProducto = parseInt(boton.dataset.idProducto);
                    const tituloProducto = boton.dataset.tituloProducto;
                    const precioProducto = parseFloat(boton.dataset.precioProducto);
                    const imagenProducto = boton.dataset.imagenProducto;
                   
                    agregarAlCarrito({ id: idProducto, title: tituloProducto, price: precioProducto, image: imagenProducto, cantidad: 1 });
                    alert(`"${tituloProducto}" agregado al carrito.`);
                });
            });
        }
        adjuntarEventosAgregarAlCarritoTienda();
        
        actualizarUIdePaginacion(); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }


    function configurarPaginacion() {
        if (!contenedorPaginacion) return;

        contenedorPaginacion.innerHTML = '';

        const totalPaginas = Math.ceil(todosLosProductos.length / productosPorPagina);

        const enlacePaginaAnterior = document.createElement('a');
        enlacePaginaAnterior.href = "#";
        enlacePaginaAnterior.id = "pagina-anterior";
        enlacePaginaAnterior.innerHTML = '<i class="fal fa-long-arrow-alt-left"></i> Anterior';
        enlacePaginaAnterior.addEventListener('click', (e) => {
            e.preventDefault();
            if (paginaActual > 1) {
                mostrarProductosPorPagina(paginaActual - 1);
            }
        });
        contenedorPaginacion.appendChild(enlacePaginaAnterior);

      
        for (let i = 1; i <= totalPaginas; i++) {
            const enlacePagina = document.createElement('a');
            enlacePagina.href = "#";
            enlacePagina.textContent = i;
            enlacePagina.dataset.pagina = i;
            enlacePagina.addEventListener('click', (e) => {
                e.preventDefault();
                mostrarProductosPorPagina(parseInt(e.target.dataset.pagina));
            });
            contenedorPaginacion.appendChild(enlacePagina);
        }
        const enlacePaginaSiguiente = document.createElement('a');
        enlacePaginaSiguiente.href = "#";
        enlacePaginaSiguiente.id = "pagina-siguiente"; 
        enlacePaginaSiguiente.innerHTML = 'Siguiente <i class="fal fa-long-arrow-alt-right"></i>';
        enlacePaginaSiguiente.addEventListener('click', (e) => {
            e.preventDefault();
            if (paginaActual < totalPaginas) {
                mostrarProductosPorPagina(paginaActual + 1);
            }
        });
        contenedorPaginacion.appendChild(enlacePaginaSiguiente);

        actualizarUIdePaginacion(); 
    }

    
    function actualizarUIdePaginacion() {
        if (!contenedorPaginacion) return;

        const totalPaginas = Math.ceil(todosLosProductos.length / productosPorPagina);

       
        document.querySelectorAll('.paginacion a').forEach(enlace => {
            enlace.classList.remove('activo', 'deshabilitado');
        });


        const enlacePaginaActual = document.querySelector(`.paginacion a[data-pagina="${paginaActual}"]`);
        if (enlacePaginaActual) {
            enlacePaginaActual.classList.add('activo');
        }

        const botonAnterior = document.getElementById('pagina-anterior');
        const botonSiguiente = document.getElementById('pagina-siguiente');
        if (botonAnterior) {
            if (paginaActual === 1) {
                botonAnterior.classList.add('deshabilitado'); 
                botonAnterior.style.pointerEvents = 'none'; 
                botonAnterior.style.opacity = '0.5'; 
            } else {
                botonAnterior.classList.remove('deshabilitado');
                botonAnterior.style.pointerEvents = 'auto';
                botonAnterior.style.opacity = '1';
            }
        }
        if (botonSiguiente) {
            if (paginaActual === totalPaginas) {
                botonSiguiente.classList.add('deshabilitado'); 
                botonSiguiente.style.pointerEvents = 'none';
                botonSiguiente.style.opacity = '0.5';
            } else {
                botonSiguiente.classList.remove('deshabilitado');
                botonSiguiente.style.pointerEvents = 'auto';
                botonSiguiente.style.opacity = '1';
            }
        }
    }

    
    obtenerTodosLosProductos();
});