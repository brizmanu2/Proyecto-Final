function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push(producto);
    }
    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    console.log('Carrito actualizado:', carrito);
}

document.addEventListener('DOMContentLoaded', () => {

  
    const barraMenu = document.getElementById('barra-menu'); 
    const barraNavegacion = document.getElementById('barra-navegacion');
    const cerrarMenu = document.getElementById('cerrar-menu'); 

    if (barraMenu) {
        barraMenu.addEventListener('click', () => {
            barraNavegacion.classList.add('activo');
        });
    }

    if (cerrarMenu) {
        cerrarMenu.addEventListener('click', (e) => {
            e.preventDefault();
            barraNavegacion.classList.remove('activo'); 
        });
    }

    const iniciarSesionModal = document.getElementById('iniciar-sesion-modal');
    const registroModal = document.getElementById('registro-modal');

    const mostrarIniciarSesionNav = document.getElementById('mostrar-iniciar-sesion-nav'); 
    const mostrarRegistroNav = document.getElementById('mostrar-registro-nav'); 

    const botonesCerrarModal = document.querySelectorAll('.modal .btn-cerrar-modal'); 
    const contenidosModal = document.querySelectorAll('.contenido-modal'); 

    const mostrarRegistroDesdeInicioSesion = document.getElementById('mostrar-registro-desde-inicio-sesion');
    const mostrarInicioSesionDesdeRegistro = document.getElementById('mostrar-inicio-sesion-desde-registro');

    function abrirModal(elementoModal) {
        if (elementoModal) {
            elementoModal.classList.add('activo'); 
            document.body.style.overflow = 'hidden'; 
        }
    }

    function cerrarModal(elementoModal) {
        if (elementoModal) {
            elementoModal.classList.remove('activo'); 
            document.body.style.overflow = ''; 
        }
    }

    if (mostrarIniciarSesionNav) {
        mostrarIniciarSesionNav.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(iniciarSesionModal);
        });
    }

    if (mostrarRegistroNav) {
        mostrarRegistroNav.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(registroModal);
        });
    }

    botonesCerrarModal.forEach(boton => {
        boton.addEventListener('click', () => {
            const modalPadre = boton.closest('.modal');
            if (modalPadre) {
                cerrarModal(modalPadre);
            }
        });
    });

    contenidosModal.forEach(contenido => {
        contenido.addEventListener('click', (e) => {
            e.stopPropagation(); 
        });
    });

    
    window.addEventListener('click', (e) => {
        if (e.target === iniciarSesionModal) {
            cerrarModal(iniciarSesionModal);
        }
        if (e.target === registroModal) {
            cerrarModal(registroModal);
        }
    });

   
    if (mostrarRegistroDesdeInicioSesion) {
        mostrarRegistroDesdeInicioSesion.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarModal(iniciarSesionModal);
            abrirModal(registroModal);
        });
    }

    if (mostrarInicioSesionDesdeRegistro) {
        mostrarInicioSesionDesdeRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarModal(registroModal);
            abrirModal(iniciarSesionModal);
        });
    }

   
    const formulariosAutenticacion = document.querySelectorAll('.formulario-autenticacion');
    formulariosAutenticacion.forEach(formulario => {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const idFormulario = formulario.closest('.modal').id;
            if (idFormulario === 'iniciar-sesion-modal') {
                const email = formulario.querySelector('#email-iniciar-sesion').value;
                const contrasena = formulario.querySelector('#contrasena-iniciar-sesion').value;
                console.log('Intento de inicio de sesión:', { email, contrasena });
                alert(`Inicio de sesión simulado para: ${email}\nContraseña: ${contrasena}`);
                cerrarModal(iniciarSesionModal);
            } else if (idFormulario === 'registro-modal') {
                const nombre = formulario.querySelector('#nombre-registro').value;
                const email = formulario.querySelector('#email-registro').value;
                const contrasena = formulario.querySelector('#contrasena-registro').value;
                const confirmarContrasena = formulario.querySelector('#confirmar-contrasena-registro').value;

                if (contrasena !== confirmarContrasena) {
                    alert('Las contraseñas no coinciden.');
                    return;
                }
                console.log('Intento de registro:', { nombre, email, contrasena });
                alert(`Registro simulado para: ${email}`);
                cerrarModal(registroModal);
            }
        });
    });

    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        const contenedorProductosDestacados = document.getElementById('contenedor-productos-destacados');

        
        async function obtenerProductosDestacados() {
            if (!contenedorProductosDestacados) return;
            contenedorProductosDestacados.innerHTML = '<p>Cargando productos destacados...</p>';
            try {
                const respuesta = await fetch('https://fakestoreapi.com/products?limit=8');
                if (!respuesta.ok) {
                    throw new Error(`Error HTTP! estado: ${respuesta.status}`);
                }
                const productos = await respuesta.json();
                mostrarProductos(productos, contenedorProductosDestacados);
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
                contenedorProductosDestacados.innerHTML = '<p>No se pudieron cargar los productos destacados.</p>';
            }
        }

       
        function mostrarProductos(productos, elementoContenedor) {
            elementoContenedor.innerHTML = '';
            productos.forEach(producto => {
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
                elementoContenedor.appendChild(tarjetaProducto);
            });
           
            function adjuntarEventosAgregarAlCarrito() {
                document.querySelectorAll('#contenedor-productos-destacados .carrito').forEach(boton => {
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
            adjuntarEventosAgregarAlCarrito(); 
        }
        obtenerProductosDestacados();
    }

   
    const rutaActual = window.location.pathname;
    document.querySelectorAll('#barra-navegacion li a').forEach(enlace => {
        const hrefEnlace = enlace.getAttribute('href');
        enlace.classList.remove('activo'); 

        if ((rutaActual === '/' || rutaActual.includes('index.html')) && 
            (hrefEnlace === 'index.html' || hrefEnlace === '../index.html' || hrefEnlace === '/')) {
             enlace.classList.add('activo');
        }
       
        else if (rutaActual.includes(hrefEnlace) && !hrefEnlace.includes('index.html') && !hrefEnlace.startsWith('#')) {
            enlace.classList.add('activo');
        }
    });
});