# MedRutina

Llevar el control de varios medicamentos a la vez es más difícil de lo que
parece. Horarios distintos, dosis diferentes, tratamientos que empiezan y
terminan... MedRutina nació para resolver eso de forma simple y confiable.

Es una app móvil construida con React Native y Expo que permite registrar
medicamentos, programar recordatorios, llevar el conteo del stock disponible
y revisar qué tan seguido se están tomando las dosis. Todo funciona de forma
local, sin cuentas ni servidores.




# Manual de Usuario - MedRutina

¡Bienvenido a **MedRutina**! Esta aplicación está diseñada para ayudarte a ti o a tus seres queridos a llevar un control preciso y amigable de todos los medicamentos diarios, asegurando que nunca olvides una dosis.

---

## 1. Requisitos y Primeros Pasos
Para usar la aplicación necesitas:
- Un dispositivo móvil con acceso a internet para el inicio de sesión inicial.
- Crear una cuenta utilizando un correo electrónico y una contraseña segura.

Una vez que ingreses, la aplicación recordará tu sesión y te llevará a la pantalla principal.

---

## 2. Pantalla Principal (Dashboard)
Al entrar a la app, verás la pantalla principal que actúa como tu asistente diario:

1. **Lista de Medicamentos:** Aquí se muestran todos los medicamentos que has configurado. Podrás ver el nombre, la dosis y tu inventario (stock) actual.
2. **Registrar una Toma:** Al lado de cada medicamento que aún debas tomar hoy, verás un botón verde con un símbolo de más (`+`). ¡Pulsarlo significa que ya te tomaste tu dosis!
3. **Control de Dosis:** La aplicación te indicará cuántas veces has tomado el medicamento hoy. Si ya completaste las tomas del día, el medicamento se marcará en verde con el mensaje "¡DÍA COMPLETADO!".
4. **Alertas de Stock:** Al final de la pantalla, la sección "Alertas de Stock" te advertirá si alguno de tus medicamentos se está agotando para que puedas ir a la farmacia a tiempo.

---

## 3. Añadir un Medicamento
Si necesitas agregar un nuevo tratamiento:
1. En la pantalla principal, presiona el botón que dice **"Añadir"** o **"Añadir Medicamento"**.
2. Llegarás a un formulario sencillo. Rellena los siguientes datos:
   - **Nombre del Medicamento:** (Ej. Paracetamol)
   - **Dosis:** (Ej. 500mg)
   - **Frecuencia:** ¿Cuántas veces al día lo tomas? (Ej. 3)
   - **Stock Actual:** ¿Cuántas pastillas/unidades te quedan en casa? (Ej. 20)
   - **Umbral de Alerta:** ¿Cuándo quieres que la app te avise que se está acabando? (Ej. Cuando queden 5).
3. Presiona **"Guardar Medicamento"**. ¡Listo! Automáticamente aparecerá en tu pantalla principal.

---

## 4. Mi Perfil
Puedes acceder a tu perfil tocando el ícono redondo de usuario en la esquina superior derecha de la pantalla principal o desde el menú de navegación inferior.

### ¿Qué puedes hacer en tu Perfil?
- **Ver tus estadísticas:** La app te mostrará cuántas dosis en total has registrado, ayudándote a motivarte y ver tu adherencia al tratamiento.
- **Lista de Contactos Médicos:** Aquí podrás ver la lista de tus doctores de cabecera con su especialidad y teléfono. Así, siempre tendrás sus datos a la mano en caso de emergencia.
- **Cambiar tu Foto de Perfil:**
  1. Toca el botón **"Cambiar Foto"**.
  2. La app te pedirá permiso para acceder a la galería de tu teléfono.
  3. Selecciona una foto tuya.
  4. Presiona **"Guardar en Nube"** para actualizar tu perfil permanentemente.

---

## 5. Recomendaciones de Uso
- **Registra al momento:** Acostúmbrate a presionar el botón de "toma" justo después de ingerir el medicamento. Así evitarás confusiones y no te tomarás la pastilla dos veces.
- **Mantén tu inventario al día:** Cada vez que compres una nueva caja de medicina, recuerda actualizar el número de pastillas en la app para que las alertas de stock sigan funcionando correctamente.

¡Esperamos que MedRutina haga tu día a día mucho más tranquilo y saludable!



# Manual Técnico - MedRutina

## 1. Introducción
MedRutina es una aplicación móvil desarrollada en React Native utilizando el framework Expo. Su propósito principal es asistir a usuarios (especialmente adultos mayores) en la gestión y control de sus medicamentos, proporcionando un registro de adherencia, alertas de stock y acceso rápido a contactos médicos.

## 2. Arquitectura del Sistema
El sistema sigue una arquitectura de cliente móvil (Frontend) apoyada por servicios en la nube (Backend as a Service - BaaS) y almacenamiento local:

- **Frontend:** React Native con Expo.
- **Navegación:** React Navigation (Tabs, Stack).
- **Almacenamiento Local:** SQLite (`expo-sqlite`) para persistencia rápida de medicamentos, registros de adherencia (tomas diarias) y contactos médicos sin necesidad de conexión permanente a internet.
- **Autenticación y Nube:** Firebase Authentication (Manejo de sesiones) y Firebase Firestore (Almacenamiento de datos del perfil de usuario).
- **Almacenamiento de Multimedia:** Cloudinary (Alojamiento de las fotos de perfil de los usuarios).

## 3. Estructura del Proyecto

La estructura principal del código reside en la carpeta `src/` y `navigation/`:

```
movil-1/
├── App.js                   # Punto de entrada de la aplicación
├── navigation/              # Configuración de rutas (Stack & Tabs)
│   ├── AppNavigator.js
│   ├── AppProvider.js
│   └── AuthContext.js
├── src/
│   ├── components/          # Componentes reutilizables (Formulario)
│   ├── constants/           # Constantes globales (colores de la UI)
│   ├── screens/             # Vistas principales de la aplicación
│   │   ├── AddMedicationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── SplashScreen.js
│   │   ├── UserScreen.js
│   │   └── auth/            # Pantallas de autenticación (Login, Registro)
│   └── services/            # Lógica de negocio y conexión a servicios externos
│       ├── cloudinaryService.js  # Integración con Cloudinary API
│       ├── contactService.js     # CRUD de contactos en SQLite
│       ├── firebaseService.js    # Inicialización de Firebase
│       ├── medicationService.js  # CRUD de medicamentos y adherencia en SQLite
│       ├── sqliteService.js      # Inicialización y conexión de base de datos local
│       └── userService.js        # Sincronización de perfil en Firestore
```

## 4. Servicios Principales y Lógica de Datos

### 4.1. Servicio SQLite (`sqliteService.js`)
Inicializa la base de datos `medrutina.db` y crea tres tablas principales:
- `medications`: Guarda la información de cada medicamento (nombre, dosis, frecuencia, stock, umbral de alerta).
- `adherence_logs`: Registra cada toma realizada por el usuario, asociando un `medicationId` a un `timestamp`.
- `medical_contacts`: Guarda el directorio de especialistas médicos.

### 4.2. Servicio de Firebase (`firebaseService.js` y `userService.js`)
Se utiliza para manejar la sesión del usuario (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`). Además, se almacena un documento de usuario en Firestore (colección `users`) que guarda la URL de la foto de perfil y sus fechas de actualización.

### 4.3. Flujo de Adición y Toma de Medicamentos (`HomeScreen.js` y `AddMedicationScreen.js`)
1. El usuario registra un medicamento, el cual se inserta en SQLite (`addMedication`).
2. En la pantalla principal, se leen los medicamentos asociados al usuario.
3. Al presionar el botón de "tomar" se invoca `recordDose()`, que resta 1 unidad al stock del medicamento en SQLite e inserta un nuevo registro en la tabla `adherence_logs`.
4. La UI se recalcula verificando el total de tomas del día comparado con la frecuencia requerida (`maxDoses`).

## 5. Dependencias Clave
- `expo-sqlite`: Base de datos relacional local.
- `firebase`: SDK para Autenticación y Firestore.
- `@react-navigation/native`: Manejo de navegación entre pantallas.
- `expo-image-picker`: Selección de fotos desde la galería del dispositivo.

## 6. Variables de Entorno (.env)
El proyecto requiere un archivo `.env` en la raíz para conectar con Firebase y Cloudinary (ya que Expo usa el prefijo `EXPO_PUBLIC_`). Es crucial asegurar que las siguientes variables estén definidas:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_AUTH_DOMAIN`
- `EXPO_PUBLIC_PROJECT_ID`
- `EXPO_PUBLIC_STORAGE_BUCKET`
- `EXPO_PUBLIC_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_APP_ID`

## 7. Despliegue y Ejecución
Para iniciar el proyecto en desarrollo local:
```bash
npm install
npx expo start
```
Se recomienda testear en un dispositivo físico usando Expo Go.


