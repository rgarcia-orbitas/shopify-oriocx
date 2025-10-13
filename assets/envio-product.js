function calcularDiaEntrega() {
  const diasFestivos = [
    "2025-01-01", // Año Nuevo
    "2025-01-06", // Reyes Magos
    "2025-04-18", // Viernes Santo
    "2025-05-01", // Día del Trabajo
    "2025-08-15", // Asunción de la Virgen
    "2025-10-12", // Fiesta Nacional de España (domingo)
    "2025-11-01", // Todos los Santos
    "2025-12-06", // Día de la Constitución
    "2025-12-08", // Inmaculada Concepción
    "2025-12-25"  // Navidad
  ];
  const ahora = new Date();
  const horaLimite = 13;
  let minutosParaPedido;
  const tiempoEnvio = 48

  // Calcula las horas y minutos restantes para hacer el pedido
  if (ahora.getHours() < horaLimite) {
    minutosParaPedido =
      (horaLimite - ahora.getHours() - 1) * 60 + (60 - ahora.getMinutes());
  } else {
    // Calcula las horas y minutos hasta la hora límite del día siguiente.
    minutosParaPedido =
      (24 - ahora.getHours() + horaLimite - 1) * 60 + (60 - ahora.getMinutes());
  }

  let horasParaPedido = Math.floor(minutosParaPedido / 60);
  minutosParaPedido = minutosParaPedido % 60;

  let fechaEnvio = new Date(ahora);
  fechaEnvio.setMinutes(
    fechaEnvio.getMinutes() + minutosParaPedido + horasParaPedido * 60
  );

  // Añadir 24 horas para el tiempo de envío, excluyendo sábados, domingos y días festivos.
  let horasAgregadas = 0;
  while (horasAgregadas < tiempoEnvio) {
    fechaEnvio.setMinutes(fechaEnvio.getMinutes() + 60); // Agrega minuto a minuto para simplificar el control de los días.
    const diaSemana = fechaEnvio.getDay();
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado.
    const esDiaFestivo = diasFestivos.includes(
      fechaEnvio.toISOString().split("T")[0]
    );

    if (!esFinDeSemana && !esDiaFestivo) {
      horasAgregadas++;
    }
  }
  
  // Formatear fecha de envío para el mensaje.
  const opcionesFecha = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Europe/Madrid",
  };
  const fechaEntrega = fechaEnvio.toLocaleDateString("es-ES", opcionesFecha);
  const diaActual = ahora.getDay();
  const esEntregaManana = fechaEnvio.getDate() === ahora.getDate() + 1 || (ahora.getHours() >= horaLimite && fechaEnvio.getDate() === ahora.getDate());

   // Modificar el mensaje de retorno según si la entrega es mañana y hoy es entre lunes y jueves
   if (esEntregaManana && diaActual >= 1 && diaActual <= 4) {
    return `Haz el pedido antes de <span>${horasParaPedido > 0 ? horasParaPedido:''} ${horasParaPedido > 1 ? 'horas y' : horasParaPedido == 1 ? 'hora y' : ''} ${minutosParaPedido} minutos</span> y recíbelo <span>mañana.</span>`;
  } else {
    return `Haz el pedido antes de <span>${horasParaPedido > 0 ? horasParaPedido:''} ${horasParaPedido > 1 ? 'horas y' : horasParaPedido == 1 ? 'hora y' : ''} ${minutosParaPedido} minutos</span> y recíbelo antes del <span>${fechaEntrega}</span>.`;
  }

}

const productForms = document.querySelectorAll('.product-form');
productForms.forEach(function(productForm) {
  const parentDiv = productForm.parentNode;
  

  const deliveryDateElement = document.createElement('div');
  deliveryDateElement.classList.add('entrega-item')
  deliveryDateElement.innerHTML = calcularDiaEntrega();
  
  parentDiv.insertBefore(deliveryDateElement, parentDiv.firstChild);
});