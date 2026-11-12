const STORAGE_KEY = 'reservo-language';

const translations = new Map(Object.entries({
  'Funciones': 'Features',
  'Cómo funciona': 'How it works',
  'Precios': 'Pricing',
  'Iniciar sesión': 'Log in',
  'Prueba gratis': 'Try for free',
  'Menú de navegación': 'Navigation menu',
  'Reservo, ir al inicio': 'Reservo, go to home',
  'Selecciona un sector para actualizar la demo': 'Choose a business type to update the demo',
  'Gimnasios': 'Gyms',
  'Clases, entrenamientos y aforo.': 'Classes, training sessions, and capacity.',
  'Restaurantes': 'Restaurants',
  'Mesas, turnos y reservas.': 'Tables, shifts, and reservations.',
  'Peluquerías': 'Hair salons',
  'Servicios, profesionales y horarios.': 'Services, staff, and schedules.',
  'Clínicas': 'Clinics',
  'Consultas y citas por especialista.': 'Consultations and appointments by specialist.',
  'Pensado para cualquier negocio con citas': 'Made for any appointment-based business',
  'Elige tu sector y descubre cómo se vería tu página de reservas.': 'Choose your business type and see what your booking page could look like.',
  'Llena tus clases': 'Fill your classes',
  'sin complicarte': 'without the hassle',
  'Gestiona clases, entrenamientos y reservas desde un solo lugar. Tus clientes reservan online y tú te centras en el gimnasio.': 'Manage classes, training sessions, and bookings in one place. Your clients book online while you focus on your gym.',
  'Cada mesa reservada': 'Every table booked',
  'sin llamadas': 'without phone calls',
  'Organiza las reservas y los turnos de tu restaurante. Tus clientes eligen mesa y horario online, a cualquier hora.': 'Manage your restaurant bookings and shifts. Your clients choose a table and time online, any time.',
  'Tu agenda de servicios': 'Your service schedule',
  'siempre organizada': 'always organised',
  'Gestiona citas de corte, color y peinado en una agenda clara. Tus clientes reservan cuando mejor les viene.': 'Manage cut, colour, and styling appointments in one clear calendar. Your clients book whenever suits them best.',
  'Más tiempo para tus pacientes': 'More time for your patients',
  'menos llamadas': 'fewer phone calls',
  'Organiza consultas y citas por especialista. Tus pacientes reservan online y reciben recordatorios automáticos.': 'Organise consultations and appointments by specialist. Your patients book online and receive automatic reminders.',
  'Clases disponibles': 'Available classes',
  'Mesas disponibles': 'Available tables',
  'Servicios disponibles': 'Available services',
  'Citas disponibles': 'Available appointments',
  'Completo': 'Full',
  '6 plazas': '6 spots',
  '2 plazas': '2 spots',
  '4 mesas': '4 tables',
  '1 mesa': '1 table',
  'Color': 'Colour',
  'Fisioterapia': 'Physiotherapy',
  'Nutrición': 'Nutrition',
  'Revisión general': 'General check-up',
  'Reservas online 24/7': 'Online bookings 24/7',
  'Tu propia página de reservas lista en minutos, integrable en tu web o Instagram.': 'Your own booking page, ready in minutes and easy to add to your website or Instagram.',
  'Recordatorios automáticos': 'Automatic reminders',
  'Email, SMS y WhatsApp antes de cada cita. Reduce los "no-shows" hasta un 70%.': 'Email, SMS, and WhatsApp reminders before every appointment. Reduce no-shows by up to 70%.',
  'Pagos y señales': 'Payments and deposits',
  'Cobra por adelantado, pide una señal o vende bonos y membresías.': 'Take payments upfront, request a deposit, or sell packages and memberships.',
  'Gestión de equipo': 'Team management',
  'Horarios por empleado, salas o mesas. Cada uno ve solo su agenda.': 'Schedules by employee, room, or table. Everyone sees only their own calendar.',
  'Estadísticas': 'Analytics',
  'Ocupación, ingresos y clientes recurrentes en un panel claro.': 'Occupancy, revenue, and returning clients in one clear dashboard.',
  'App móvil': 'Mobile app',
  'Gestiona tu negocio desde el móvil, estés donde estés.': 'Manage your business from your phone, wherever you are.',
  'Todo lo que necesitas para gestionar reservas': 'Everything you need to manage bookings',
  'Una sola herramienta para tu agenda, tus clientes y tus cobros.': 'One tool for your calendar, clients, and payments.',
  'Crea tu cuenta': 'Create your account',
  'Regístrate gratis en menos de dos minutos. Selecciona tu sector (peluquería, clínica, restaurante o gimnasio) y personaliza el nombre y la marca de tu negocio.': 'Sign up for free in under two minutes. Choose your business type (hair salon, clinic, restaurant, or gym) and customise your business name and brand.',
  'Configura tus servicios': 'Set up your services',
  'Define tus horarios, disponibilidad y duración de cada cita. Añade tu catálogo de servicios, precios, empleados asignados o mesas y salas según tu actividad.': 'Set your hours, availability, and appointment lengths. Add your services, prices, assigned staff, or tables and rooms.',
  'Comparte tu enlace': 'Share your link',
  'Publica tu enlace de reservas en tu web, perfil de Instagram, WhatsApp o Google Business. Tus clientes reservarán y pagarán online de forma autónoma 24/7.': 'Share your booking link on your website, Instagram, WhatsApp, or Google Business. Your clients can book and pay online on their own, 24/7.',
  'Empieza en 3 pasos': 'Get started in 3 steps',
  'En menos de 10 minutos tendrás tu agenda online.': 'Get your online calendar up and running in under 10 minutes.',
  'Básico': 'Basic',
  'Autónomos y negocios con un profesional': 'Solo workers and businesses with one professional',
  '1 profesional': '1 professional',
  'Recordatorios por email': 'Email reminders',
  'Estadísticas básicas': 'Basic analytics',
  'Soporte por email': 'Email support',
  'Elegir plan': 'Choose plan',
  'Negocios con equipo': 'Businesses with a team',
  'Hasta 5 profesionales': 'Up to 5 professionals',
  'Recordatorios por email y WhatsApp': 'Email and WhatsApp reminders',
  'Estadísticas completas': 'Full analytics',
  'Soporte por email y chat': 'Email and chat support',
  'Empezar prueba': 'Start trial',
  'Cadenas y negocios con varios locales': 'Chains and businesses with multiple locations',
  'Profesionales ilimitados': 'Unlimited professionals',
  'Locales ilimitados': 'Unlimited locations',
  'Gestor dedicado': 'Dedicated account manager',
  'Contactar': 'Contact us',
  'A medida': 'Custom',
  '/mes': '/month',
  'Facturado mensualmente': 'Billed monthly',
  'Más popular': 'Most popular',
  'Precios simples y transparentes': 'Simple, transparent pricing',
  '14 días gratis en cualquier plan. Sin permanencia.': '14 days free on every plan. No commitment.',
  'Mensual': 'Monthly',
  'Anual': 'Annual',
  'Pago anual': 'Annual billing',
  'Planes': 'Plans',
  'Mostrando precios con pago anual, con un 20 % de descuento': 'Showing annual prices with a 20% discount',
  'Mostrando precios con pago mensual': 'Showing monthly prices',
  'Facturado anualmente': 'Billed annually',
  '¿Listo para llenar tu agenda?': 'Ready to fill your calendar?',
  'Empieza tu prueba gratuita de 14 días. Sin compromiso.': 'Start your 14-day free trial. No commitment.',
  'Correo electrónico': 'Email address',
  'Empezar': 'Get started',
  'Escribe tu email para empezar la prueba.': 'Enter your email to start your trial.',
  'Introduce un email válido, por ejemplo: nombre@empresa.com': 'Enter a valid email address, for example: name@company.com',
  'Suscríbete a la newsletter': 'Subscribe to our newsletter',
  'Novedades de Reservo y consejos para tu negocio, una vez al mes.': 'Reservo updates and business tips, once a month.',
  'Tu email:': 'Your email:',
  'Suscribirme': 'Subscribe',
  'Acepto que Reservo guarde mi email para enviarme la newsletter.': 'I agree to let Reservo store my email to send me the newsletter.',
  'Escribe tu email.': 'Enter your email.',
  'El email no es válido. Ejemplo: nombre@negocio.com': 'This email is invalid. Example: name@company.com',
  'Marca la casilla para que podamos guardar tu email.': 'Tick the box so we can store your email.',
  '¡Gracias! Te has suscrito a la newsletter.': 'Thanks! You are subscribed to the newsletter.',
  'Este email ya estaba suscrito. ¡Gracias!': 'This email is already subscribed. Thanks!',
  'Todos los derechos reservados.': 'All rights reserved.',
  'Redes sociales': 'Social media',
  'Privacidad': 'Privacy',
  'Aviso legal': 'Legal notice',
  'Cookies': 'Cookies',
  'Contacto': 'Contact',
  'Aviso de cookies': 'Cookie notice',
  'Usamos cookies propias para que la web funcione y, si las aceptas, cookies de análisis para mejorarla. Más información en nuestra política de cookies.': 'We use essential cookies to make the website work and, if you accept, analytics cookies to improve it. Learn more in our cookie policy.',
  'política de cookies': 'cookie policy',
  'Rechazar': 'Reject',
  'Aceptar': 'Accept',
  'Lun': 'Mon',
  'Mié': 'Wed',
  'Jue': 'Thu',
  'Vie': 'Fri',
  'Lun 22': 'Mon 22',
  'Mar 23': 'Tue 23',
  'Mié 24': 'Wed 24',
  'Jue 25': 'Thu 25',
  'Vie 26': 'Fri 26',
  'Junio 2026': 'June 2026',
  'Abierto': 'Open',
  'Elige un día': 'Choose a day',
  'Selecciona un día de reserva': 'Choose a booking day',
  'Opciones y disponibilidad': 'Options and availability',
  'Reserva online': 'Online booking',
  'RESERVA ONLINE': 'ONLINE BOOKING',
  'Sin tarjeta de crédito · Cancela cuando quieras': 'No credit card required · Cancel anytime',
  'Empieza gratis 14 días': 'Start your 14-day free trial',
  'Ver cómo funciona': 'See how it works',
  'Ver la intro otra vez': 'Watch the intro again',
  'Ejemplo de reserva en FitZone Gym': 'Booking example at FitZone Gym',
  '¿Cómo es un día en tu negocio?': 'What does a day at your business look like?',
  'Intro: un día con Reservo': 'Intro: a day with Reservo',
  '¿Cómo': 'How',
  'es': 'is',
  'un': 'a',
  'día': 'day',
  'en': 'at',
  'tu negocio?': 'your business?',
  'Baja despacio y mira cómo cambia con Reservo.': 'Scroll slowly and see how it changes with Reservo.',
  'Desliza': 'Scroll',
  'Así es hoy la agenda de muchos negocios…': 'This is what the calendar looks like at many businesses today…',
  'Con Reservo, todo en': 'With Reservo, everything in',
  'orden': 'order',
  'Tus clientes reservan solos, 24/7': 'Your clients book on their own, 24/7',
  'Y les recordamos la cita': 'And we remind them about their appointment',
  'por ti': 'for you',
  'Perfecto para': 'Perfect for',
  'gimnasios': 'gyms',
  'peluquerías': 'hair salons',
  'restaurantes': 'restaurants',
  'clínicas': 'clinics',
  'Las reservas de tu negocio, en piloto automático': 'Your business bookings, on autopilot',
  '📱 Confirmación enviada': '📱 Confirmation sent',
  'Semana 24 · Junio': 'Week 24 · June',
  'En directo': 'Live',
  'Reservas esta semana': 'Bookings this week',
  'Citas sin aparecer': 'No-show appointments',
  'Recordatorios enviados': 'Reminders sent',
  'Agenda': 'Calendar',
  'Notas': 'Notes',
  '¡¡Llamar a TODOS para confirmar mañana!!': 'CALL everyone to confirm tomorrow!!',
  'Lunes: 4 citas sin aparecer': 'Monday: 4 no-show appointments',
  'Contestar WhatsApps': 'Reply to WhatsApp messages',
  'Hoja de turnos → ¿dónde está?': 'Shift sheet → where is it?',
  'Miércoles 24': 'Wednesday 24',
  '9:00 Laura — corte': '9:00 Laura — haircut',
  '10:30 ¿Marc o Marta? 📞': '10:30 Marc or Marta? 📞',
  '12:00 ??? llamar': '12:00 ??? call',
  '12:00 Pablo (¡doble!)': '12:00 Pablo (double booking!)',
  'Confirmación enviada': 'Confirmation sent',
  'no vino': 'no-show',
  'llamar': 'call',
  'Barba': 'Beard trim',
  'Mechas': 'Highlights',
  'Revisión': 'Check-up',
  'Limpieza': 'Cleaning',
  'Ortodoncia': 'Orthodontics',
  'Empaste': 'Filling',
  'Consulta': 'Consultation',
  'tu@email.com': 'you@email.com',
  'tu@empresa.com': 'you@company.com',
  'Usamos cookies propias para que la web funcione y, si las aceptas, cookies de análisis para mejorarla. Más información en nuestra': 'We use essential cookies to make the website work and, if you accept, analytics cookies to improve it. Learn more in our',
  '¡Reservado! ✓': 'Booked! ✓',
  'Reserva de prueba confirmada': 'Test booking confirmed',
  '🔔 Recordatorio': '🔔 Reminder',
}));

const reverseTranslations = new Map(
  [...translations].map(([spanish, english]) => [english, spanish]),
);

let currentLanguage = 'es';

function normalize(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function translateValue(value) {
  const dictionary = currentLanguage === 'en' ? translations : reverseTranslations;
  const normalized = normalize(value);
  let translated = dictionary.get(normalized);

  if (translated === undefined && currentLanguage === 'en') {
    const annualBilling = normalized.match(/^Facturado anualmente \((\d+) €\/año\)$/u);
    if (annualBilling) translated = `Billed annually (${annualBilling[1]} €/year)`;
    const reminder = normalized.match(/^🔔 Recordatorio · (Lun|Mar|Mié|Jue|Vie) (\d{2}:\d{2})$/u);
    if (reminder) {
      const day = new Map([['Lun', 'Mon'], ['Mar', 'Tue'], ['Mié', 'Wed'], ['Jue', 'Thu'], ['Vie', 'Fri']]).get(reminder[1]);
      translated = `🔔 Reminder · ${day} ${reminder[2]}`;
    }
    const copyright = normalized.match(/^© (\d+) Reservo\. Todos los derechos reservados\.$/u);
    if (copyright) translated = `© ${copyright[1]} Reservo. All rights reserved.`;
    const trialConfirmation = normalized.match(/^¡Listo! Te hemos enviado un email a (.+) para activar tu prueba gratuita de 14 días\.$/u);
    if (trialConfirmation) translated = `Done! We have sent an email to ${trialConfirmation[1]} to activate your 14-day free trial.`;
    const bookingConfirmation = normalized.match(/^Reserva de prueba confirmada: (.+) · (.+)$/u);
    if (bookingConfirmation) translated = `Test booking confirmed: ${bookingConfirmation[1]} · ${bookingConfirmation[2]}`;
    const toast = normalized.match(/^(.+) · (Lun|Mar|Mié|Jue|Vie) (\d+) · (.+)$/u);
    if (toast) {
      const day = new Map([['Lun', 'Mon'], ['Mar', 'Tue'], ['Mié', 'Wed'], ['Jue', 'Thu'], ['Vie', 'Fri']]).get(toast[2]);
      const item = translations.get(toast[4]) ?? toast[4];
      translated = `${toast[1]} · ${day} ${toast[3]} · ${item}`;
    }
  } else if (translated === undefined) {
    const annualBilling = normalized.match(/^Billed annually \((\d+) €\/year\)$/u);
    if (annualBilling) translated = `Facturado anualmente (${annualBilling[1]} €/año)`;
    const reminder = normalized.match(/^🔔 Reminder · (Mon|Tue|Wed|Thu|Fri) (\d{2}:\d{2})$/u);
    if (reminder) {
      const day = new Map([['Mon', 'Lun'], ['Tue', 'Mar'], ['Wed', 'Mié'], ['Thu', 'Jue'], ['Fri', 'Vie']]).get(reminder[1]);
      translated = `🔔 Recordatorio · ${day} ${reminder[2]}`;
    }
    const copyright = normalized.match(/^© (\d+) Reservo\. All rights reserved\.$/u);
    if (copyright) translated = `© ${copyright[1]} Reservo. Todos los derechos reservados.`;
    const trialConfirmation = normalized.match(/^Done! We have sent an email to (.+) to activate your 14-day free trial\.$/u);
    if (trialConfirmation) translated = `¡Listo! Te hemos enviado un email a ${trialConfirmation[1]} para activar tu prueba gratuita de 14 días.`;
    const bookingConfirmation = normalized.match(/^Test booking confirmed: (.+) · (.+)$/u);
    if (bookingConfirmation) translated = `Reserva de prueba confirmada: ${bookingConfirmation[1]} · ${bookingConfirmation[2]}`;
    const toast = normalized.match(/^(.+) · (Mon|Tue|Wed|Thu|Fri) (\d+) · (.+)$/u);
    if (toast) {
      const day = new Map([['Mon', 'Lun'], ['Tue', 'Mar'], ['Wed', 'Mié'], ['Thu', 'Jue'], ['Fri', 'Vie']]).get(toast[2]);
      const item = reverseTranslations.get(toast[4]) ?? toast[4];
      translated = `${toast[1]} · ${day} ${toast[3]} · ${item}`;
    }
  }

  if (translated === undefined) return null;

  const leading = value.match(/^\s*/u)?.[0] ?? '';
  const trailing = value.match(/\s*$/u)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const translated = translateValue(node.nodeValue);
    if (translated !== null) node.nodeValue = translated;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (!node.hasAttribute('data-language-toggle')) {
    ['aria-label', 'placeholder', 'title'].forEach((attribute) => {
      const value = node.getAttribute(attribute);
      if (value === null) return;
      const translated = translateValue(value);
      if (translated !== null) node.setAttribute(attribute, translated);
    });
  }
  node.childNodes.forEach(translateNode);
}

function updateDocumentLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title =
    currentLanguage === 'en'
      ? 'Reservo · Online bookings for your business'
      : 'Reservo · Reservas online para tu negocio';
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content =
      currentLanguage === 'en'
        ? 'Reservo: online booking system for gyms, restaurants, hair salons, and clinics.'
        : 'Reservo: sistema de reservas online para gimnasios, restaurantes, peluquerías y clínicas.';
  }
}

function updateLanguageButtons(container) {
  container.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.setAttribute('aria-checked', String(currentLanguage === 'en'));
    button.setAttribute(
      'aria-label',
      currentLanguage === 'en' ? 'Cambiar idioma a español' : 'Cambiar idioma a inglés',
    );
    button.querySelectorAll('[data-language-code]').forEach((code) => {
      const isCurrent = code.dataset.languageCode === currentLanguage;
      code.classList.toggle('font-bold', isCurrent);
      code.classList.toggle('text-indigo-700', isCurrent);
      code.classList.toggle('text-slate-400', !isCurrent);
    });
  });
}

function setLanguage(language, container, observer, observerOptions) {
  currentLanguage = language;
  updateDocumentLanguage();
  observer.disconnect();
  try {
    translateNode(document.body);
    updateLanguageButtons(container);
  } finally {
    observer.observe(document.body, observerOptions);
  }

  try {
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  } catch (error) {
    console.warn('No se pudo guardar el idioma seleccionado.', error);
  }
}

export function initializeLanguage(container) {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      currentLanguage = savedLanguage;
    }
  } catch (error) {
    console.warn('No se pudo leer el idioma guardado; se usará español.', error);
  }

  updateDocumentLanguage();
  translateNode(document.body);
  updateLanguageButtons(container);

  const observerOptions = {
    attributes: true,
    attributeFilter: ['aria-label', 'placeholder', 'title'],
    characterData: true,
    childList: true,
    subtree: true,
  };
  const observer = new MutationObserver((mutations) => {
    observer.disconnect();
    try {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'characterData') {
          translateNode(mutation.target);
          return;
        }
        mutation.addedNodes.forEach(translateNode);
      });
    } finally {
      observer.observe(document.body, observerOptions);
    }
  });
  observer.observe(document.body, observerOptions);

  container.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(currentLanguage === 'es' ? 'en' : 'es', container, observer, observerOptions);
    });
  });
}

export function translateText(spanish, english) {
  return currentLanguage === 'en' ? english : spanish;
}

export function getLanguage() {
  return currentLanguage;
}
