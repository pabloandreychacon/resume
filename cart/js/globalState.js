class GlobalState {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
  }

  // 📦 Obtener el estado actual
  getState() {
    return this.state;
  }

  // 🛠️ Actualizar el estado y notificar suscriptores
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
    this.persist(); // Opcional: guardar en localStorage
  }

  // 🔔 Suscribirse a cambios de estado
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  // 🚨 Notificar cambios a todos los suscriptores
  notify() {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  // 🧱 Guardar en localStorage
  persist() {
    localStorage.setItem("globalState", JSON.stringify(this.state));
  }

  // 🔄 Cargar estado inicial desde localStorage
  loadFromStorage() {
    const saved = localStorage.getItem("globalState");
    if (saved) {
      this.state = JSON.parse(saved);
      this.notify();
    }
  }
}

// global state object properties
// 🏗️ Definir propiedades del estado globa
var globalStateProperties = {
  Email: "pabloandreychacon@hotmail.com",
  Phone: "+506 8888-8888",
  Address: "123 Commerce Street Suite 500 New York, NY 10001",
  MapLocation:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d747.5023706999765!2d-84.11690653621802!3d9.9985776402904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fac4705da317%3A0x1d6528332a4c602!2sMonumento%20Nacional%20Casa%20Alfredo%20Gonz%C3%A1lez%20Flores!5e1!3m2!1ses-419!2scr!4v1753551386846!5m2!1ses-419!2scr",
  BusinessName: "POStore",
  PaypalClientId: "",
};

// 🏁 Crear instancia global solo una vez para toda las páginas
if (!window.globalStore) {
  const store = new GlobalState(globalStateProperties);
  window.globalStore = store; // Hacerlo accesible globalmente
  // Guardar el estado inicial en localStorage
  store.persist();
}

// Si ya existe una instancia, cargar el estado desde localStorage
// pero solo si no hay parámetro email en la URL
if (window.globalStore) {
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get("email");
  
  if (!emailParam) {
    window.globalStore.loadFromStorage();
  }
}
//

// save storage to localStorage
globalStore.persist();

/* globalStore.loadFromStorage(); */

// 👀 Ejemplo de componente que escucha cambios
/* globalStore.subscribe((newState) => {
  console.log("Estado actualizado:", newState);
  if (newState.darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}); */

// 📲 Conectar un botón a una acción de cambio de estado
/* document.getElementById("toggle-dark").addEventListener("click", () => {
  const current = globalStore.getState().darkMode;
  globalStore.setState({ darkMode: !current });
}); */

// 🧾 Acceder desde cualquier parte
/* console.log(globalStore.getState()); */
