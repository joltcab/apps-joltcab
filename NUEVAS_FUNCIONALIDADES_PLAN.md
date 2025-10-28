# 🚀 JoltCab - Nuevas Funcionalidades

## 📋 Resumen de Implementación

Basado en la información proporcionada, estas son las 5 funcionalidades prioritarias a implementar:

### 1. 🤝 Negociación Estilo InDrive
**Usuario sugiere precio, conductores ofertan**

**Endpoints:**
- `POST /trip/negotiable/create` - Crear viaje negociable
- `POST /trip/offer/make` - Conductor hace oferta
- `POST /trip/offer/accept` - Usuario acepta oferta

**Pantallas a crear:**
- [ ] Crear viaje con negociación
- [ ] Ver ofertas recibidas
- [ ] Aceptar/Rechazar ofertas
- [ ] Contador de tiempo para ofertas

---

### 2. 💬 Chat en Tiempo Real
**Comunicación entre usuario y conductor**

**Endpoints:**
- `POST /chat/send` - Enviar mensaje
- `GET /chat/history` - Historial de chat
- Socket.IO events: `message`, `typing`, `read`

**Pantallas a crear:**
- [ ] Lista de chats
- [ ] Pantalla de chat individual
- [ ] Notificaciones de mensajes
- [ ] Indicador "escribiendo..."

---

### 3. 🚨 Botón SOS (Emergencias)
**Sistema de pánico y emergencias**

**Endpoints:**
- `POST /emergency/panic` - Activar SOS
- `GET /emergency/contacts` - Contactos de emergencia
- `POST /emergency/contacts/add` - Agregar contacto

**Pantallas a crear:**
- [ ] Botón SOS prominente
- [ ] Confirmación de emergencia
- [ ] Contactos de emergencia
- [ ] Compartir ubicación automática

---

### 4. 📤 Compartir Viaje
**Compartir detalles del viaje vía WhatsApp/SMS**

**Endpoints:**
- `POST /trip/share/generate` - Generar link para compartir
- `GET /trip/share/:id` - Ver viaje compartido

**Funcionalidades:**
- [ ] Botón "Compartir viaje"
- [ ] Integración WhatsApp
- [ ] Integración SMS
- [ ] Link público con detalles del viaje
- [ ] Tracking en tiempo real compartido

---

### 5. 🗺️ Navegación
**Abrir en Waze o Google Maps**

**Endpoints:**
- `GET /navigation/options` - Obtener opciones de navegación

**Funcionalidades:**
- [ ] Botón "Navegar" en viaje activo
- [ ] Selector de app (Waze/Google Maps)
- [ ] Deep links a apps de navegación
- [ ] Fallback a Google Maps web

---

## 🛠️ Stack Técnico

### Backend (Ya implementado)
- Base URL: `https://joltcab.com`
- Socket.IO: `https://joltcab.com`
- 31 endpoints nuevos funcionando

### Frontend (A implementar)
- React Native + Expo
- Socket.IO Client
- React Native Share
- React Native Linking
- React Native Maps

---

## 📱 Estructura de Implementación

### Fase 1: Negociación (Semana 1)
```
/app/frontend/app/
  ├── negotiate-ride.tsx        # Crear viaje con precio sugerido
  ├── ride-offers.tsx           # Ver y gestionar ofertas
  └── components/
      ├── NegotiationCard.tsx   # Card de oferta
      └── PriceInput.tsx        # Input de precio personalizado
```

### Fase 2: Chat (Semana 1-2)
```
/app/frontend/app/
  ├── chats.tsx                 # Lista de conversaciones
  ├── chat/[id].tsx             # Chat individual
  └── components/
      ├── ChatBubble.tsx        # Mensaje individual
      ├── ChatInput.tsx         # Input de mensaje
      └── TypingIndicator.tsx   # Indicador "escribiendo"
```

### Fase 3: SOS (Semana 2)
```
/app/frontend/app/
  ├── emergency-contacts.tsx    # Gestión de contactos
  └── components/
      ├── SOSButton.tsx         # Botón de emergencia
      └── EmergencyModal.tsx    # Modal de confirmación
```

### Fase 4: Compartir (Semana 2-3)
```
/app/frontend/app/
  ├── share-trip.tsx            # Opciones para compartir
  └── components/
      └── ShareOptions.tsx      # Modal de opciones
```

### Fase 5: Navegación (Semana 3)
```
/app/frontend/app/
  └── components/
      └── NavigationButton.tsx  # Botón de navegación
```

---

## 🎨 Diseño UI/UX

### Colores
- Primary: `#00bf63` (Verde JoltCab)
- Danger: `#FF3B30` (Rojo para SOS)
- Success: `#00bf63`
- Chat: `#007AFF` (Azul)

### Iconos
- Negociación: 💰 `trending-up`
- Chat: 💬 `chatbubbles`
- SOS: 🚨 `alert-circle`
- Compartir: 📤 `share-social`
- Navegación: 🗺️ `navigate`

---

## 📊 Estado Actual

### ✅ Ya Implementado
- Login/Registro
- Crear viaje normal
- Historial de viajes
- Perfil de usuario
- Wallet
- Google Maps

### 🔄 En Implementación
- [ ] Negociación de precios
- [ ] Chat en tiempo real
- [ ] Botón SOS
- [ ] Compartir viaje
- [ ] Navegación

---

## 🧪 Plan de Testing

1. **Negociación**
   - Crear viaje con precio sugerido
   - Recibir ofertas de conductores
   - Aceptar/Rechazar ofertas

2. **Chat**
   - Enviar mensajes
   - Recibir en tiempo real
   - Indicador de escritura

3. **SOS**
   - Activar emergencia
   - Notificar contactos
   - Compartir ubicación

4. **Compartir**
   - Generar link
   - Compartir por WhatsApp
   - Compartir por SMS

5. **Navegación**
   - Abrir en Waze
   - Abrir en Google Maps
   - Fallback web

---

## 📝 Notas de Desarrollo

### Dependencias Adicionales Necesarias
```bash
npm install react-native-share
npm install @react-native-community/clipboard
```

### Permisos Necesarios
- Contactos (para SOS)
- Ubicación (ya configurado)
- Notificaciones (ya configurado)

---

**Última actualización:** 2025-01-28
**Estado:** Pendiente de inicio
**Tiempo estimado:** 2-3 semanas
