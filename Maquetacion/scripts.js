document.addEventListener('DOMContentLoaded', () => {
  const btnDetalles = document.querySelectorAll('.btn-detalles');
  const modal = document.getElementById('modal-detalles');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalTexto = document.getElementById('modal-texto');
  const modalImagen = document.getElementById('modal-imagen');
  const closeModalBtn = document.querySelector('.close-modal');

  const detallesVehiculos = {
    "Toyota Corolla 2023": {
      info: "Motor 1.8L, 140 HP, transmisión CVT, cámara de retroceso.",
      img: "images/toyota_corolla.jpg"
    },
    "Honda CR-V 2022": {
      info: "Motor 2.0L, 190 HP, tracción 4x4, asistente de estacionamiento.",
      img: "images/honda_crv.jpg"
    },
    "Ford Mustang 2021": {
      info: "Motor V8, 450 HP, asientos de cuero.",
      img: "images/ford_mustang.jpg"
    },
    "Chevrolet Onix 2023": {
      info: "Motor 1.0L turbo, 116 HP, Android Auto/CarPlay, 6 airbags.",
      img: "images/chevrolet_onix.jpg"
    },
    "Volkswagen Golf 2021": {
      info: "Motor 1.4L TSI, 150 HP, suspensión deportiva, faros LED.",
      img: "images/volkswagen_golf.jpg"
    },
    "BMW Serie 3 2020": {
      info: "Motor 2.0L turbo, 255 HP, paquete M Sport, HUD.",
      img: "images/bmw_serie3.jpg"
    }
  };

  if (
    btnDetalles.length > 0 &&
    modal && modalTitulo && modalTexto && modalImagen && closeModalBtn
  ) {
    btnDetalles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const modelo = btn.getAttribute('data-modelo');
        const datos = detallesVehiculos[modelo];
        if (datos) {
          modalTitulo.textContent = modelo;
          modalTexto.textContent = datos.info;
          modalImagen.src = datos.img;
          modalImagen.alt = `Imagen de ${modelo}`;
        } else {
          modalTitulo.textContent = modelo;
          modalTexto.textContent = "No hay detalles disponibles.";
          modalImagen.src = "";
          modalImagen.alt = "";
        }
        modal.classList.remove('hidden');
      });
    });

    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  const filtroTipo = document.getElementById('filtro-tipo');
  const vehiculosCatalogo = document.querySelectorAll('.catalogo-grid .vehiculo-card');

  if (filtroTipo) {
    filtroTipo.addEventListener('change', () => {
      const seleccionado = filtroTipo.value;
      vehiculosCatalogo.forEach((card) => {
        const tipo = card.getAttribute('data-tipo');
        if (seleccionado === 'todos' || tipo === seleccionado) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  const formContacto = document.getElementById('form-contacto');
  const mensajeExito = document.getElementById('mensaje-exito');

  if (formContacto && mensajeExito) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = formContacto.nombre.value.trim();
      const email = formContacto.email.value.trim();
      const mensaje = formContacto.mensaje.value.trim();
      if (nombre === '' || email === '' || mensaje === '') {
        alert('Por favor, completa todos los campos.');
        return;
      }
      formContacto.reset();
      mensajeExito.classList.remove('hidden');
      setTimeout(() => {
        mensajeExito.classList.add('hidden');
      }, 3000);
    });
  }

  const btnMobileMenu = document.querySelector('.btn-mobile-menu');
  const navLista = document.querySelector('.main-nav ul');
  if (btnMobileMenu && navLista) {
    btnMobileMenu.addEventListener('click', () => {
      navLista.classList.toggle('visible');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header') && navLista.classList.contains('visible')) {
        navLista.classList.remove('visible');
      }
    });
  }

  const enlacesMenu = document.querySelectorAll('.main-nav a');
  enlacesMenu.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = document.querySelector(link.getAttribute('href'));
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
