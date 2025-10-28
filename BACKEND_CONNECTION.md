# 🚀 JoltCab Apps - Conexión a Backend joltcab.com

## ✅ Configuración Completada

Las apps móviles de JoltCab ahora están configuradas para conectarse a **joltcab.com** en producción.

---

## 🌐 URLs Configuradas

### Producción (Production)
```javascript
API_URL: 'https://joltcab.com'
SOCKET_URL: 'https://joltcab.com'
```

### Desarrollo (Development)
```javascript
API_URL: 'http://localhost:5000'
SOCKET_URL: 'http://localhost:5000'
```

---

## 📡 Endpoints API Configurados

### Autenticación (Modern API)
- ✅ `POST /api/auth/register` - Registro de usuarios
- ✅ `POST /api/auth/login` - Login de usuarios
- ✅ `GET /api/auth/me` - Obtener usuario actual
- ✅ `PUT /api/auth/profile` - Actualizar perfil

### Autenticación Legacy (si es necesaria)
- ⚠️ `POST /user_login` - Login legacy usuarios
- ⚠️ `POST /provider_login` - Login legacy providers

### Viajes (Trips)
- ✅ `GET /api/trips` - Listar viajes
- ✅ `POST /api/trips` - Crear viaje
- ✅ `GET /api/trips/:id` - Obtener viaje por ID
- ✅ `POST /api/trips/:id/rate` - Calificar viaje
- ✅ `POST /api/trips/:id/cancel` - Cancelar viaje

### Billetera (Wallet)
- ✅ `GET /api/wallet/balance` - Obtener balance
- ✅ `GET /api/wallet/transactions` - Listar transacciones
- ✅ `POST /api/wallet/topup` - Recargar billetera

### Pagos (Payments)
- ✅ `POST /api/payments/create-intent` - Crear intención de pago Stripe

### Salud (Health)
- ✅ `GET /api/health` - Verificar estado del servidor

---

## 🔌 Socket.IO (Real-Time)

### Conexión
```javascript
URL: https://joltcab.com (production)
URL: http://localhost:5000 (development)
Transport: WebSocket + Polling
Reconnection: Enabled (5 intentos)
```

### Eventos Socket (Preparados)
- `trip:update` - Actualización de viaje
- `driver:location` - Ubicación del conductor
- `trip:accepted` - Viaje aceptado
- `trip:started` - Viaje iniciado
- `trip:completed` - Viaje completado

---

## 📝 Formato de Autenticación

### Request Headers
```javascript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Registro (Register)
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role": "user"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "role": "user",
    "wallet_balance": 0.0
  }
}
```

---

## 🔄 Cómo Cambiar Entre Entornos

### Cambiar a Production (joltcab.com)
```bash
# En el código ya está configurado como 'production' por defecto
# El ambiente se detecta automáticamente
```

### Cambiar a Development (localhost:5000)
```bash
# Opción 1: Variable de entorno
export NODE_ENV=development

# Opción 2: Modificar config.ts
const ENV = 'development';
```

---

## 🧪 Testing de Conexión

### Verificar que la app se conecta a joltcab.com

**En los logs de Expo verás:**
```
🚀 JoltCab Environment: production
🌐 API URL: https://joltcab.com
🔌 Socket URL: https://joltcab.com
```

**Al hacer login verás:**
```
📤 API Request: POST https://joltcab.com/api/auth/login
✅ API Response: 200 /api/auth/login
```

### Prueba Manual
1. Abre la app móvil
2. Registra un nuevo usuario
3. Revisa los logs del navegador/console
4. Deberías ver requests a `https://joltcab.com/api/...`

---

## 🐛 Debugging

### Ver Logs de API
Todos los requests y responses se registran en console con emojis:
- 📤 = Request enviado
- ✅ = Response exitoso
- ❌ = Error

### Logs de Socket.IO
- 🔌 = Conectando
- ✅ = Conectado exitosamente
- 📤 = Evento enviado
- 📥 = Evento recibido
- ❌ = Desconectado
- 🔴 = Error de conexión

---

## ⚙️ Archivos Modificados

### `/app/frontend/src/constants/config.ts`
```typescript
// Configuración de URLs por ambiente
const config = {
  development: {
    API_URL: 'http://localhost:5000',
    SOCKET_URL: 'http://localhost:5000',
  },
  production: {
    API_URL: 'https://joltcab.com',
    SOCKET_URL: 'https://joltcab.com',
  }
};
```

### `/app/frontend/src/services/api.ts`
- ✅ Usa `API_CONFIG.BASE_URL` directamente
- ✅ Logs detallados de requests/responses
- ✅ Manejo de errores mejorado
- ✅ Auto-logout en 401

### `/app/frontend/src/services/socket.ts`
- ✅ Usa `API_CONFIG.SOCKET_URL`
- ✅ Reconnection automática
- ✅ Logs detallados de eventos
- ✅ Manejo de errores

---

## 🔐 Seguridad

### JWT Token
- Se guarda en `AsyncStorage`
- Se incluye en header `Authorization: Bearer <token>`
- Se elimina automáticamente en logout o 401

### HTTPS
- ✅ Producción usa `https://joltcab.com`
- ⚠️ Development usa `http://localhost:5000`

---

## 📱 Próximos Pasos

1. **Probar registro en joltcab.com**
   - Registrar usuario desde la app
   - Verificar que se guarda en tu backend

2. **Probar login**
   - Login con credenciales
   - Verificar que recibe token JWT

3. **Probar crear viaje**
   - Crear un viaje de prueba
   - Verificar que llega a joltcab.com

4. **Verificar Socket.IO**
   - Conectar Socket.IO
   - Enviar/recibir eventos en tiempo real

---

## 🆘 Soporte

Si hay problemas de conexión, verifica:

1. **Backend está corriendo en joltcab.com**
   ```bash
   curl https://joltcab.com/api/health
   ```

2. **CORS está habilitado en backend**
   - Debe permitir origen del frontend
   - Headers: Authorization, Content-Type

3. **Endpoints coinciden**
   - Frontend: `/api/auth/login`
   - Backend: debe tener mismo endpoint

4. **SSL/HTTPS está configurado**
   - joltcab.com debe tener certificado SSL válido

---

## ✅ Estado Actual

**🟢 CONFIGURADO Y LISTO**

Las apps móviles ahora apuntan a:
- **Production**: `https://joltcab.com`
- **Development**: `http://localhost:5000`

Todos los endpoints usan el prefijo `/api` y están listos para producción.

---

**Última actualización**: $(date)
**Ambiente actual**: Production (joltcab.com)
