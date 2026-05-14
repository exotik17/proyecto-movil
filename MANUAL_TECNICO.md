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
