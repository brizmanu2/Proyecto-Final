document.addEventListener('DOMContentLoaded', function () {
    const formularioContacto = document.getElementById('formulario-contacto'); 
    const tuNombre = document.getElementById('tu-nombre');
    const tuCorreo = document.getElementById('tu-correo');
    const asuntoContacto = document.getElementById('asunto-contacto'); 
    const tuMensaje = document.getElementById('tu-mensaje'); 

  
    const mostrarEstadoCampo = (elementoInput, esValido, mensaje = '') => {
        const divPadre = elementoInput.parentNode;
        const textoError = divPadre.querySelector('.texto-error'); 

        if (esValido) {
            divPadre.classList.remove('error');
            textoError.innerText = '';
        } else {
            divPadre.classList.add('error');
            textoError.innerText = mensaje;
        }
    };

    const esCorreoValido = (correo) => {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(correo);
    };

    
    const validarCampo = (campo, mensajeVacio, mensajeInvalido = '') => {
        const valor = campo.value.trim();
        if (valor === '') {
            mostrarEstadoCampo(campo, false, mensajeVacio);
            return false;
        } else if (campo.id === 'tu-correo' && !esCorreoValido(valor)) {
            mostrarEstadoCampo(campo, false, mensajeInvalido);
            return false;
        } else {
            mostrarEstadoCampo(campo, true);
            return true;
        }
    };

    [tuNombre, tuCorreo, asuntoContacto, tuMensaje].forEach(campo => {
        campo.addEventListener('change', () => {
            if (campo.id === 'tu-correo') {
                validarCampo(tuCorreo, 'El correo electrónico es obligatorio', 'Ingresa un correo electrónico válido.');
            } else if (campo.id === 'tu-nombre') {
                validarCampo(tuNombre, 'Por favor, ingresa tu nombre.');
            } else if (campo.id === 'asunto-contacto') {
                validarCampo(asuntoContacto, 'Por favor, ingresa un asunto.');
            } else if (campo.id === 'tu-mensaje') {
                validarCampo(tuMensaje, 'Por favor, ingresa tu mensaje.');
            }
        });
    });
    formularioContacto.addEventListener('submit', function (evento) {
        evento.preventDefault(); 

        
        const camposAValidar = [
            { elemento: tuNombre, mensajeVacio: 'Por favor, ingresa tu nombre.' },
            { elemento: tuCorreo, mensajeVacio: 'El correo electrónico es obligatorio', mensajeInvalido: 'Ingresa un correo electrónico válido.' },
            { elemento: asuntoContacto, mensajeVacio: 'Por favor, ingresa un asunto.' },
            { elemento: tuMensaje, mensajeVacio: 'Por favor, ingresa tu mensaje.' }
        ];

        let formularioEsValido = true; 
        camposAValidar.forEach(campoInfo => {
            const esCampoValido = validarCampo(campoInfo.elemento, campoInfo.mensajeVacio, campoInfo.mensajeInvalido);
            if (!esCampoValido) {
                formularioEsValido = false; 
            }
        });

        if (formularioEsValido) {
            console.log('¡Formulario enviado con éxito!');
            alert('¡Mensaje enviado con éxito!'); 
            formularioContacto.reset(); 
           
            camposAValidar.forEach(campoInfo => mostrarEstadoCampo(campoInfo.elemento, true));
        } else {
            console.log('El formulario no es válido. Por favor, revisa los campos.');
            alert('Por favor, completa todos los campos correctamente.'); 
        }
    });
});