# 🚕 JoltCab User App

<div align="center">

![JoltCab Logo](https://via.placeholder.com/150x150/0EA5E9/FFFFFF?text=JoltCab)

**Tu compañero de viaje confiable - Aplicación móvil para usuarios**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2051-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)

[Características](#características) • [Instalación](#instalación) • [Configuración](#configuración) • [Documentación](#documentación) • [Contribuir](#contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Arquitectura](#arquitectura)
- [Integraciones](#integraciones)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 🎯 Sobre el Proyecto

**JoltCab User App** es una aplicación móvil moderna y completa para solicitar servicios de transporte. Construida con React Native y Expo, ofrece una experiencia de usuario fluida y nativa con características avanzadas de IA, geolocalización en tiempo real, y múltiples opciones de reserva.

### 🌟 Características Destacadas

- 🤖 **Precio Dinámico con IA**: Cálculo inteligente de tarifas basado en demanda, tráfico y clima
- 💬 **Chat de Soporte IA 24/7**: Asistente virtual integrado con Emergent IA
- 📱 **Reserva por WhatsApp**: Opción de booking directo vía WhatsApp
- 🗺️ **Navegación en Tiempo Real**: Integración con Google Maps, Waze
- 🆘 **Botón de Emergencia SOS**: Sistema de seguridad para situaciones críticas
- 📤 **Compartir Viaje**: Comparte tu ubicación y detalles del viaje en tiempo real
- 💳 **Múltiples Métodos de Pago**: Tarjeta, efectivo, wallet digital
- 📊 **Sistema de Negociación**: Propón tu precio y recibe ofertas de conductores
- 📈 **Estadísticas Personales**: Ahorro, viajes totales, rating personal

---

## 🚀 Características

### 🔐 Autenticación y Perfiles
- [x] Login/Registro con email o teléfono
- [x] Perfil de usuario editable
- [x] Gestión de métodos de pago
- [x] Historial de viajes completo
- [x] Wallet digital con transacciones

### 🚗 Booking y Reservas
- [x] Búsqueda de direcciones con autocompletado (Google Places)
- [x] Selección de ubicación en mapa interactivo
- [x] Cálculo de tarifa estimada en tiempo real
- [x] Precio dinámico con IA (demanda, tráfico, clima)
- [x] Sistema de negociación de precios
- [x] Reserva por WhatsApp con mensaje pre-llenado
- [x] Múltiples opciones de pago

### 🗺️ Navegación y Tracking
- [x] Visualización en mapa en tiempo real
- [x] Seguimiento del conductor durante el viaje
- [x] Integración con Waze y Google Maps
- [x] Compartir ubicación en tiempo real
- [x] ETA (tiempo estimado de llegada)

### 💬 Comunicación
- [x] Chat en tiempo real con el conductor (Socket.IO)
- [x] Chat de soporte con IA 24/7
- [x] Notificaciones push (Firebase)
- [x] Mensajería por WhatsApp

### 🛡️ Seguridad
- [x] Botón de emergencia SOS
- [x] Compartir detalles del viaje con contactos
- [x] Verificación de conductores
- [x] Calificación y reseñas

### 📊 Estadísticas y Análisis
- [x] Dashboard personal con métricas
- [x] Ahorro total acumulado
- [x] Total de viajes completados
- [x] Rating personal promedio
- [x] Balance de wallet

---

## 🛠️ Stack Tecnológico

### Frontend (Mobile App)
- **Framework**: React Native 0.79.5
- **Build Tool**: Expo SDK 51
- **Lenguaje**: TypeScript 5.8.3
- **Navegación**: Expo Router v6 (file-based routing)
- **Estado Global**: Zustand 4.4.7
- **HTTP Client**: Axios 1.6.2
- **Mapas**: React Native Maps 1.26.18, Expo Location
- **Real-time**: Socket.IO Client 4.7.2
- **Almacenamiento**: AsyncStorage
- **Iconos**: Expo Vector Icons (Ionicons)

### Backend
- **Framework**: FastAPI 0.115.5 (Python)
- **Base de Datos**: MongoDB 6.0+
- **Autenticación**: JWT
- **Real-time**: Socket.IO Server
- **Pagos**: Stripe Integration
- **Notificaciones**: Firebase Cloud Messaging

### Servicios Externos
- **IA y Chat**: OpenAI (GPT-4) - Integrado desde backend
- **Mensajería**: Twilio WhatsApp Business API
- **Mapas**: Google Maps Platform (Places, Distance Matrix, Directions)
- **Notificaciones**: Firebase
- **Backend URL**: https://joltcab.com / https://admin.joltcab.com

---

## 📁 Estructura del Proyecto

```
mobile-apps/
├── apps/
│   └── user-app/                    # App principal de usuarios
│       ├── app/                     # File-based routing (Expo Router)
│       │   ├── (tabs)/             # Navegación con tabs
│       │   │   ├── home.tsx        # Pantalla principal
│       │   │   ├── history.tsx     # Historial de viajes
│       │   │   ├── wallet.tsx      # Wallet y transacciones
│       │   │   └── profile.tsx     # Perfil del usuario
│       │   ├── _layout.tsx         # Layout raíz
│       │   ├── index.tsx           # Splash/Welcome
│       │   ├── onboarding.tsx      # Onboarding screens
│       │   ├── login.tsx           # Pantalla de login
│       │   ├── register.tsx        # Pantalla de registro
│       │   ├── book-ride.tsx       # Reservar viaje (con IA pricing)
│       │   ├── ride-offers.tsx     # Ofertas de conductores
│       │   ├── chat.tsx            # Chat con conductor
│       │   ├── sos.tsx             # Emergencia SOS
│       │   ├── share-trip.tsx      # Compartir viaje
│       │   ├── navigation.tsx      # Opciones de navegación
│       │   └── ai-support.tsx      # Chat de soporte IA
│       │
│       ├── src/
│       │   ├── components/         # Componentes reutilizables
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   ├── TripCard.tsx
│       │   │   ├── OfferCard.tsx
│       │   │   ├── PriceNegotiationModal.tsx
│       │   │   ├── StatCard.tsx
│       │   │   ├── WhatsAppButton.tsx
│       │   │   ├── ChatBubble.tsx
│       │   │   ├── ChatMessageInput.tsx
│       │   │   ├── ChatHeader.tsx
│       │   │   ├── SOSButton.tsx
│       │   │   ├── ShareOptionsModal.tsx
│       │   │   ├── EmergencyModal.tsx
│       │   │   ├── AddressAutocomplete.tsx
│       │   │   ├── AISupportChat.tsx
│       │   │   └── NavigationButton.tsx
│       │   │
│       │   ├── services/           # Servicios e integraciones
│       │   │   ├── api.ts          # Cliente HTTP (Axios)
│       │   │   ├── socket.ts       # Cliente Socket.IO
│       │   │   ├── aiService.ts    # Servicio de IA (modular)
│       │   │   └── ai/             # Proveedores de IA (Strategy Pattern)
│       │   │       ├── IAIProvider.ts        # Interface
│       │   │       └── EmergentIAProvider.ts # Implementación Emergent
│       │   │
│       │   ├── store/              # Estado global (Zustand)
│       │   │   ├── authStore.ts    # Autenticación
│       │   │   ├── tripStore.ts    # Viajes
│       │   │   ├── negotiationStore.ts  # Negociaciones
│       │   │   ├── statsStore.ts   # Estadísticas
│       │   │   └── chatStore.ts    # Chat
│       │   │
│       │   ├── types/              # Tipos TypeScript
│       │   │   └── index.ts
│       │   │
│       │   └── constants/          # Constantes (colores, configs)
│       │       └── colors.ts
│       │
│       ├── app.json                # Configuración de Expo
│       ├── package.json            # Dependencias
│       ├── tsconfig.json           # Config de TypeScript
│       └── .env                    # Variables de entorno
│
├── backend/                        # Backend FastAPI
│   ├── server.py                   # Servidor principal
│   ├── models.py                   # Modelos de datos
│   └── requirements.txt            # Dependencias Python
│
├── docs/                           # Documentación
└── README.md                       # Este archivo
```

---

## 📦 Instalación

### Prerequisitos

- Node.js 18+ y npm/yarn
- Python 3.9+
- MongoDB 6.0+
- Expo CLI
- Android Studio / Xcode (para desarrollo nativo)
- Expo Go app (para testing en dispositivo físico)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/your-org/joltcab-user-app.git
cd joltcab-user-app
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
yarn install
# o
npm install
```

### 3. Instalar Dependencias del Backend

```bash
cd ../backend
pip install -r requirements.txt
```

### 4. Configurar MongoDB

Asegúrate de que MongoDB esté corriendo en tu máquina local o configura una instancia en la nube (MongoDB Atlas).

---

## ⚙️ Configuración

### Variables de Entorno - Frontend

Crea un archivo `.env` en `frontend/`:

```env
# Backend URLs
EXPO_PUBLIC_BACKEND_URL=https://joltcab.com

# Google Maps API Keys (obtener en Google Cloud Console)
GOOGLE_MAPS_API_KEY_IOS=tu_api_key_ios
GOOGLE_MAPS_API_KEY_ANDROID=tu_api_key_android
GOOGLE_WEB_API_KEY=tu_api_key_web

# Configuración de Expo (NO MODIFICAR - generadas automáticamente)
EXPO_PACKAGER_PROXY_URL=http://your-tunnel-url
EXPO_PACKAGER_HOSTNAME=your-hostname

# Otras configuraciones
EXPO_USE_FAST_RESOLVER=true
```

### Variables de Entorno - Backend

Crea un archivo `.env` en `backend/`:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/joltcab

# JWT Secret
JWT_SECRET=your_super_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Firebase (para notificaciones push)
FIREBASE_CREDENTIALS=path/to/firebase-credentials.json

# OpenAI (integrado en backend)
OPENAI_API_KEY=sk-your_openai_key_here
```

### Configuración de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Distance Matrix API
   - Directions API
   - Geocoding API
4. Crea credenciales (API Keys) para cada plataforma
5. Restringe las keys por aplicación/dominio

### Configuración en `app.json`

Actualiza `frontend/app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_ANDROID_API_KEY"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_IOS_API_KEY"
      }
    }
  }
}
```

---

## 🚀 Ejecución

### Modo Desarrollo - Frontend

```bash
cd frontend

# Iniciar Expo Dev Server
yarn start
# o
npm start

# Para plataforma específica
yarn android  # Android
yarn ios      # iOS
yarn web      # Web
```

### Ejecutar en Dispositivo Físico

1. Instala **Expo Go** desde Play Store o App Store
2. Escanea el QR code que aparece en la terminal
3. La app se cargará en tu dispositivo

### Modo Desarrollo - Backend

```bash
cd backend

# Iniciar servidor FastAPI
python server.py

# El servidor correrá en http://0.0.0.0:8001
```

### Modo Producción

```bash
# Build para Android
cd frontend
eas build --platform android

# Build para iOS
eas build --platform ios

# Deploy backend
# (Configurar según tu proveedor: Heroku, Railway, AWS, etc.)
```

---

## 🏗️ Arquitectura

### Patrón de Diseño

La aplicación sigue una arquitectura modular y escalable:

#### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Expo Router (App Layer)         │
│  File-based routing + Navigation        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Screens & Components            │
│  Presentational + Container Pattern     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      State Management (Zustand)         │
│  Global stores + Local state            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Services Layer                  │
│  API, Socket.IO, AI Services            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        External APIs                    │
│  Backend, Google Maps, Emergent IA      │
└─────────────────────────────────────────┘
```

#### AI Provider Architecture (Strategy Pattern)

```typescript
// Interface base
interface IAIProvider {
  sendMessage(message: string): Promise<Response>;
  getHistory(): Promise<History>;
}

// Implementación modular - fácil de cambiar
class BackendAIProvider implements IAIProvider { ... }  // Actual (OpenAI vía backend)
class EmergentIAProvider implements IAIProvider { ... }
class OpenAIProvider implements IAIProvider { ... }
class ClaudeProvider implements IAIProvider { ... }

// Servicio principal usa el provider configurado
class AIService {
  private provider: IAIProvider;
  
  setProvider(provider: IAIProvider) {
    this.provider = provider;
  }
}
```

**Ventajas:**
- ✅ Fácil cambio de proveedor de IA sin refactoring
- ✅ Testing simplificado (mock providers)
- ✅ Extensible a futuros proveedores

---

## 🔌 Integraciones

### 1. OpenAI (Backend Integration)

**El backend de JoltCab integra OpenAI GPT-4 para:**

- **Chat de Soporte**: Respuestas inteligentes y contextuales
- **Precio Dinámico**: Análisis de demanda, tráfico, clima para optimizar tarifas
- **Procesamiento de Lenguaje Natural**: Comprensión de solicitudes del usuario

**Endpoints del backend que usan IA:**

```typescript
// Chat con IA (OpenAI GPT-4 en backend)
POST https://admin.joltcab.com/api/v1/emergentIA/chat/sendMessage
Body: { message, userId, conversationId }
Response: { success, response, conversationId, timestamp }

// Historial de conversación
GET https://admin.joltcab.com/api/v1/emergentIA/chat/getHistory?userId=X

// Precio dinámico con IA
POST https://admin.joltcab.com/api/v1/ai/dynamic-pricing-advanced
Body: { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, service_type, time }
Response: { 
  final_price, base_price, surge_multiplier,
  factors: { distance_km, duration_min, demand_factor, traffic_factor, weather_factor }
}

// WhatsApp Booking
POST https://admin.joltcab.com/api/v1/whatsapp/booking
Body: { user_phone, pickup_address, dropoff_address, coordinates... }
Response: { success, booking_id, whatsapp_url }
```

**Características:**
- 🤖 GPT-4 powered chat (procesado en backend por seguridad)
- 🔒 API keys protegidas en servidor
- 📊 Context-aware responses
- 💰 Pricing optimization con ML
- 📈 Análisis de demanda en tiempo real

**Arquitectura:**
```
Mobile App → Backend API → OpenAI API
   ↓            ↓              ↓
Frontend    FastAPI        GPT-4
             (Proxy)
```

**Ventajas de integración via backend:**
- ✅ API keys seguras (no expuestas en frontend)
- ✅ Rate limiting controlado
- ✅ Caching de respuestas frecuentes
- ✅ Logging y monitoring centralizados
- ✅ Menor latencia con streaming
- ✅ Costos optimizados

### 2. Google Maps Platform

**APIs utilizadas:**
- **Places API**: Autocompletado de direcciones
- **Distance Matrix**: Cálculo de distancia/tiempo
- **Directions**: Rutas optimizadas
- **Geocoding**: Conversión dirección ↔ coordenadas
- **Maps SDK**: Visualización de mapas

### 3. WhatsApp Business

**Integración via Twilio:**
- Generación de mensajes pre-llenados
- Deep linking a WhatsApp
- Notificaciones de estado del viaje

### 4. Firebase

**Servicios:**
- Cloud Messaging (Push Notifications)
- Analytics
- Crashlytics (opcional)

---

## 📡 API Endpoints

### Autenticación

```http
POST /userregister
POST /userslogin
POST /logout
```

### Viajes

```http
POST /trips/create
GET /trips/user/:userId
GET /trips/:tripId
PUT /trips/:tripId/status
DELETE /trips/:tripId
```

### Negociación

```http
POST /negotiations/create
POST /negotiations/:id/offer
PUT /negotiations/:id/accept
```

### Wallet

```http
GET /wallet/balance/:userId
POST /wallet/topup
GET /wallet/transactions/:userId
```

### Chat

```http
GET /chat/history?tripId=X
POST /chat/send
```

### Mapas

```http
POST /maps/autocomplete
POST /maps/place-details
POST /maps/distance-matrix
POST /maps/directions
```

Para documentación completa de la API, visita: `http://localhost:8001/docs` (Swagger UI automático de FastAPI)

---

## 🧪 Testing

### Testing Manual

1. **Book Ride Flow**
   - Selecciona pickup/dropoff
   - Verifica cálculo de precio dinámico
   - Prueba botón de WhatsApp
   - Completa booking

2. **AI Chat**
   - Navega a Profile → Chat con Soporte IA
   - Envía mensajes
   - Prueba quick replies

3. **Emergency Features**
   - Botón SOS
   - Share trip
   - Navigation options

### Testing Automatizado (Próximamente)

```bash
# Unit tests
yarn test

# E2E tests con Detox
yarn test:e2e:ios
yarn test:e2e:android
```

---

## 🗺️ Roadmap

### ✅ Completado (v1.0)
- [x] Sistema de autenticación completo
- [x] Booking de viajes con mapas
- [x] Chat en tiempo real
- [x] Sistema de negociación
- [x] Integración con IA (pricing, chat)
- [x] WhatsApp booking
- [x] Features de seguridad (SOS, share)
- [x] Wallet digital

### 🚧 En Desarrollo (v1.1)
- [ ] Viajes programados
- [ ] Favoritos (lugares frecuentes)
- [ ] Múltiples paradas en un viaje
- [ ] Rating y reseñas mejoradas
- [ ] Modo oscuro
- [ ] Soporte multi-idioma completo

### 🔮 Futuro (v2.0)
- [ ] Apple Pay / Google Pay
- [ ] Viajes compartidos (carpooling)
- [ ] Subscripciones premium
- [ ] Programa de referidos
- [ ] Integración con calendarios
- [ ] Asistente de voz
- [ ] Modo offline básico

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- **TypeScript**: Usa tipos estrictos, evita `any`
- **Componentes**: Functional components con hooks
- **Naming**: camelCase para variables, PascalCase para componentes
- **Commits**: Conventional Commits (feat, fix, docs, etc.)
- **Testing**: Escribe tests para nuevas features

### Código de Conducta

Este proyecto sigue el [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

- **Product Owner**: JoltCab Team
- **Lead Developer**: [Tu Nombre]
- **Backend**: FastAPI + MongoDB
- **Mobile**: React Native + Expo
- **AI Integration**: Emergent IA Module

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: support@joltcab.com
- 💬 Chat: [En la app] Profile → Chat con Soporte IA
- 🐛 Bugs: [GitHub Issues](https://github.com/your-org/joltcab-user-app/issues)
- 📖 Docs: [Wiki del proyecto](https://github.com/your-org/joltcab-user-app/wiki)

---

## 🙏 Agradecimientos

- [Expo Team](https://expo.dev/) por el excelente framework
- [Google Maps Platform](https://cloud.google.com/maps-platform)
- [Emergent IA](https://emergent.sh/) por la integración de IA
- [React Native Community](https://reactnative.dev/)
- Todos los [contribuidores](https://github.com/your-org/joltcab-user-app/graphs/contributors)

---

<div align="center">

**Hecho con ❤️ por el equipo de JoltCab**

[⬆ Volver arriba](#-joltcab-user-app)

</div>
