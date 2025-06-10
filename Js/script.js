// ======Index.Noticias======

// ====== Utilidades ======
function formatearFecha(iso) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function crearPlantilla({ titulo, fecha, descripcion }) {
  return `
    <article class="noticia">
      <h3>${titulo}</h3>
      <time datetime="${fecha}">${formatearFecha(fecha)}</time>
      <p>${descripcion}</p>
    </article>`;
}

// ====== Carga desde JSON ======
async function leerJSON(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

// ====== Carga desde XML ======
async function leerXML(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  const texto = await resp.text();
  const xml = new DOMParser().parseFromString(texto, "application/xml");
  return [...xml.querySelectorAll("item")].map(item => ({
    titulo: item.querySelector("titulo")?.textContent ?? "Sin título",
    fecha: item.querySelector("fecha")?.textContent ?? "",
    descripcion: item.querySelector("descripcion")?.textContent ?? ""
  }));
}

// ====== Arranque ======
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-noticias");
  if (!contenedor) return;

  try {
    const noticias = await leerJSON("data/noticias.json"); // <- Ruta relativa
    contenedor.innerHTML = noticias.map(crearPlantilla).join("");
  } catch (e) {
    console.error(e);
    contenedor.innerHTML = `
      <p class='error'>
        No se pudieron cargar las noticias en este momento.
      </p>`;
  }
});

//======Final Index.Noticias======

//====== Pagina.Presupuesto ====== 

const form = document.getElementById('presupuestoForm');
  const nombre = document.getElementById('nombre');
  const apellidos = document.getElementById('apellidos');
  const telefono = document.getElementById('telefono');
  const email = document.getElementById('email');
  const producto = document.getElementById('producto');
  const plazo = document.getElementById('plazo');
  const extras = document.querySelectorAll('.extra');
  const total = document.getElementById('total');

  function calcularPresupuesto() {
    let base = parseFloat(producto.value) || 0;
    let extrasTotal = 0;

    extras.forEach(extra => {
      if (extra.checked) {
        extrasTotal += parseFloat(extra.value);
      }
    });

    let subtotal = base + extrasTotal;

    //======  Descuento del 5% si el plazo es mayor a 6 meses ====== 

    const plazoVal = parseInt(plazo.value);
    if (plazoVal > 6) {
      subtotal *= 0.90;
    }

    total.textContent = subtotal.toFixed(2);
  }

  //======  Escuchamos cambios ====== 

  producto.addEventListener('change', calcularPresupuesto);
  plazo.addEventListener('input', calcularPresupuesto);
  extras.forEach(extra => extra.addEventListener('change', calcularPresupuesto));

  //======  Validación del formulario ====== 

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreVal = nombre.value.trim();
    const apellidosVal = apellidos.value.trim();
    const telefonoVal = telefono.value.trim();
    const emailVal = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^\d+$/;

    if (!soloLetras.test(nombreVal) || nombreVal.length > 15) {
      alert("Nombre no válido. Solo letras, máx. 15 caracteres.");
      return;
    }

    if (!soloLetras.test(apellidosVal) || apellidosVal.length > 40) {
      alert("Apellidos no válidos. Solo letras, máx. 40 caracteres.");
      return;
    }

    if (!soloNumeros.test(telefonoVal) || telefonoVal.length !== 9) {
      alert("Teléfono no válido. Debe tener 9 números.");
      return;
    }

    if (!emailRegex.test(emailVal)) {
      alert("Correo electrónico no válido.");
      return;
    }

    if (!document.getElementById('condiciones').checked) {
      alert("Debes aceptar las condiciones.");
      return;
    }

    alert("Formulario enviado correctamente. Presupuesto: " + total.textContent + " €");
    form.reset();
    calcularPresupuesto();
  });
  

  //====== Calcular presupuesto inicial ====== 
  calcularPresupuesto();

//====== Final Pagina.Presupuesto ======
  