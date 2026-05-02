export const translations = {
  es: {
    serviceInactiveTitle: "Servicio desactivado",
    serviceInactiveDescription: "Este comercio no está recibiendo pedidos.",

    promotions: "PROMOCIONES",

    loading: "CARGANDO",

    callWaiterConfirm: "¿Seguro que querés llamar al mozo?",
    cancel: "Cancelar",
    yesCall: "Sí, llamar",

    youHave: "Tenés",
    activeOrderSingle: "pedido en curso",
    activeOrderPlural: "pedidos en curso",
    latest: "Último",

    goToCart: "Ir al carrito",
    viewOrders: "Ver pedidos",

    preparingOrder: "Estamos preparando tu pedido",
    deliveryContact: "Te contactaremos para coordinar la entrega",
    pickupContact: "Te contactaremos para coordinar el retiro",
    tableDelivery: "El pedido será entregado en tu mesa",

    thanksPurchase: "Gracias por tu compra",
    accept: "Aceptar",

    close: "Cerrar",

    confirmOrder: "Confirmar pedido",
    orderSummary: "Resumen del pedido",
    quantity: "Cantidad",
    total: "Total",

    phoneNumber: "Número de Celular",
    phoneWithoutCountryCode: "Número sin código de país",
    phoneHelp: "Aquí solo te notificaremos sobre tu pedido. Esta información no será compartida con ningúna persona.",

    name: "Nombre",

    specialNotesOptional: "Notas Especiales (opcional)",
    specialNotesPlaceholder: "Alergias, preferencias de cocción, etc.",

    continue: "Continuar",

    paymentMethod: "Método de pago",
    totalToPay: "Total a pagar",
    cashAtCounter: "Efectivo / En caja",
    mercadoPago: "Mercado Pago",

    redirecting: "Redirigiendo",
    payWithMercadoPago: "Pagar con Mercado Pago",
    mercadoPagoRedirectDescription:
      "Cualquier metodo de pago en la app. Te vamos a redirigir al checkout de Mercado Pago.",
    back: "Volver",
    mercadoPagoInitError: "No se pudo iniciar Mercado Pago",

    information: "Información",
    open: "Abrir",
    notAvailable: "No disponible",

    phone: "Teléfono",
    call: "Llamar",

    address: "Dirección",
    noAddressLoaded: "Sin dirección cargada",

    map: "Mapa",
    openMaps: "Abrir Maps",
    mapLoadError: "No se pudo cargar el mapa",
    locationAvailable: "Ubicación disponible",
    shortMapsNotEmbeddable:
      "Este link corto de Google Maps no se puede embeber. Abrilo en Maps.",
    openInGoogleMaps: "Abrir en Google Maps",
    noValidMapLink: "No hay un link válido para mostrar el mapa.",

    add: "Agregar",

    pending: "Pendiente",
    preparing: "Preparando",
    ready: "Listo",
    delivered: "Entregado",

    addPromo: "Agregar promo",
    includes: "Incluye",
    product: "Producto",

    cart: "Carrito",
    order: "Pedido",
    inProgress: "en curso",
    incoming: "Entrante",

    emptyCart: "Tu carrito está vacío",
    completeOrder: "Complementa tu orden",
    placeOrder: "Realizar Pedido",
  },

  en: {
    serviceInactiveTitle: "Service unavailable",
    serviceInactiveDescription: "This venue is not receiving orders.",

    promotions: "PROMOTIONS",

    callWaiterConfirm: "Are you sure you want to call the waiter?",
    cancel: "Cancel",
    yesCall: "Yes, call",

    youHave: "You have",
    activeOrderSingle: "active order",
    activeOrderPlural: "active orders",
    latest: "Latest",
    loading: "LOADING",

    goToCart: "Go to cart",
    viewOrders: "View orders",

    preparingOrder: "We are preparing your order",
    deliveryContact: "We will contact you to coordinate the delivery",
    pickupContact: "We will contact you to coordinate the pickup",
    tableDelivery: "The order will be delivered to your table",

    thanksPurchase: "Thank you for your purchase",
    accept: "Accept",

    confirmOrder: "Confirm order",
    orderSummary: "Order summary",
    quantity: "Quantity",
    total: "Total",

    phoneNumber: "Phone number",
    phoneWithoutCountryCode: "Number without country code",
    phoneHelp: "We will only use this to notify you about your order. This information will not be shared with anyone.",

    name: "Name",
    close: "Close",

    specialNotesOptional: "Special notes (optional)",
    specialNotesPlaceholder: "Allergies, cooking preferences, etc.",

    paymentMethod: "Payment method",
    totalToPay: "Total to pay",
    cashAtCounter: "Cash / Counter",
    mercadoPago: "Mercado Pago",

    continue: "Continue",

    redirecting: "Redirecting",
    payWithMercadoPago: "Pay with Mercado Pago",
    mercadoPagoRedirectDescription:
      "Any payment method in the app. We will redirect you to Mercado Pago checkout.",
    back: "Back",
    mercadoPagoInitError: "Could not start Mercado Pago",

    information: "Information",
    open: "Open",
    notAvailable: "Not available",

    phone: "Phone",
    call: "Call",

    address: "Address",
    noAddressLoaded: "No address available",

    map: "Map",
    openMaps: "Open Maps",
    mapLoadError: "The map could not be loaded",
    locationAvailable: "Location available",
    shortMapsNotEmbeddable:
      "This short Google Maps link cannot be embedded. Open it in Maps.",
    openInGoogleMaps: "Open in Google Maps",
    noValidMapLink: "There is no valid map link to display.",

    add: "Add",

    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    delivered: "Delivered",

    addPromo: "Add promo",
    includes: "Includes",
    product: "Product",

    cart: "Cart",
    order: "Order",
    inProgress: "in progress",
    incoming: "Incoming",

    emptyCart: "Your cart is empty",
    completeOrder: "Complete your order",
    placeOrder: "Place Order",
  },
} as const;

export type Language = "es" | "en";
export type TranslationKey = keyof typeof translations.es;
export type TranslationShape = typeof translations.es;