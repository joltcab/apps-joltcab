# 🚗 JoltCab Backend Endpoints - Documentación Completa

## ✅ Endpoints Ya Implementados

### 1. Login
```
POST https://joltcab.com/userslogin
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "device_type": "web",
  "login_by": "manual"
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "ekdISmrCcMQyF1lDEvrOdX4hSnp2",
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "user@example.com",
  "phone": "1234567890",
  "token": "jwt_token_here",
  "wallet": 0,
  "picture": "https://..."
}
```

### 2. Registro
```
POST https://joltcab.com/userregister
```

**Request:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "user@example.com",
  "phone": "1234567890",
  "country_phone_code": "+1",
  "country": "United States",
  "password": "123456",
  "login_by": "manual",
  "device_type": "web"
}
```

---

## 🔧 Endpoints Que Necesitas Implementar

### 3. Crear Viaje (Ride/Trip)
```
POST https://joltcab.com/create_ride
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "user_uid": "ekdISmrCcMQyF1lDEvrOdX4hSnp2",
  "user_name": "Juan Pérez",
  "user_location": {
    "latitude": 33.8751328,
    "longitude": -84.53365579999999,
    "address": "3240 S Cobb Dr, Smyrna, GA 30080, USA"
  },
  "destination_location": {
    "latitude": 33.8800000,
    "longitude": -84.5400000,
    "address": "123 Main St, Atlanta, GA 30080, USA"
  },
  "payment_method": "card"
}
```

**Response:**
```json
{
  "success": true,
  "ride_id": "ride_abc123",
  "user_uid": "ekdISmrCcMQyF1lDEvrOdX4hSnp2",
  "destination_address": "123 Main St, Atlanta, GA 30080, USA",
  "destination_location": {
    "latitude": 33.8800000,
    "longitude": -84.5400000
  },
  "user_location": {
    "latitude": 33.8751328,
    "longitude": -84.53365579999999
  },
  "driver_location": {
    "latitude": 0,
    "longitude": 0
  },
  "driver_name": "",
  "driver_uid": "",
  "is_driver_assigned": false,
  "status": "requested",
  "created_at": "2025-01-28T10:30:00Z",
  "fare": 15.50,
  "distance": 5.2
}
```

**Backend Implementation (Node.js):**
```javascript
app.post('/create_ride', async (req, res) => {
  try {
    const { user_uid, user_name, user_location, destination_location, payment_method } = req.body;
    
    // Calcular distancia y tarifa
    const distance = calculateDistance(user_location, destination_location);
    const fare = calculateFare(distance);
    
    // Crear documento en Firebase Firestore
    const rideRef = await db.collection('ride').add({
      user_uid,
      user_name,
      user_location: new admin.firestore.GeoPoint(
        user_location.latitude,
        user_location.longitude
      ),
      destination_address: destination_location.address,
      destination_location: new admin.firestore.GeoPoint(
        destination_location.latitude,
        destination_location.longitude
      ),
      driver_location: new admin.firestore.GeoPoint(0, 0),
      driver_name: "",
      driver_uid: "",
      is_driver_assigned: false,
      status: "requested",
      payment_method,
      fare,
      distance,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      ride_id: rideRef.id,
      // ... resto de campos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### 4. Listar Viajes del Usuario
```
GET https://joltcab.com/user_rides?user_uid=<user_uid>
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "rides": [
    {
      "ride_id": "ride_abc123",
      "destination_address": "123 Main St",
      "status": "completed",
      "fare": 15.50,
      "distance": 5.2,
      "created_at": "2025-01-28T10:30:00Z",
      "driver_name": "Pedro Lopez",
      "rating": 5
    }
  ]
}
```

**Backend Implementation:**
```javascript
app.get('/user_rides', async (req, res) => {
  try {
    const { user_uid } = req.query;
    
    const ridesSnapshot = await db.collection('ride')
      .where('user_uid', '==', user_uid)
      .orderBy('created_at', 'desc')
      .get();
    
    const rides = ridesSnapshot.docs.map(doc => ({
      ride_id: doc.id,
      ...doc.data()
    }));
    
    res.json({ success: true, rides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### 5. Obtener Detalles de Viaje
```
GET https://joltcab.com/ride_details?ride_id=<ride_id>
```

**Response:**
```json
{
  "success": true,
  "ride": {
    "ride_id": "ride_abc123",
    "user_uid": "user123",
    "driver_uid": "driver456",
    "destination_address": "123 Main St",
    "status": "started",
    "fare": 15.50
  }
}
```

---

### 6. Cancelar Viaje
```
POST https://joltcab.com/cancel_ride
```

**Request:**
```json
{
  "ride_id": "ride_abc123",
  "user_uid": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride cancelled successfully"
}
```

---

### 7. Calificar Viaje
```
POST https://joltcab.com/rate_ride
```

**Request:**
```json
{
  "ride_id": "ride_abc123",
  "user_uid": "user123",
  "rating": 5,
  "review": "Excellent service!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

---

### 8. Obtener Balance de Wallet
```
GET https://joltcab.com/user_wallet?user_uid=<user_uid>
```

**Response:**
```json
{
  "success": true,
  "wallet_balance": 50.00,
  "transactions": [
    {
      "transaction_id": "tx_123",
      "amount": 20.00,
      "type": "credit",
      "description": "Wallet top-up",
      "created_at": "2025-01-28T10:30:00Z"
    }
  ]
}
```

---

### 9. Recargar Wallet
```
POST https://joltcab.com/topup_wallet
```

**Request:**
```json
{
  "user_uid": "user123",
  "amount": 50.00,
  "payment_method_id": "pm_stripe_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "new_balance": 100.00,
  "transaction_id": "tx_456"
}
```

---

## 🔌 Socket.IO Events (Real-time)

### Server → Client Events

**1. ride_update**
```javascript
socket.on('ride_update', (data) => {
  // data: { ride_id, status, driver_location, etc. }
});
```

**2. driver_assigned**
```javascript
socket.on('driver_assigned', (data) => {
  // data: { ride_id, driver_name, driver_uid, driver_location }
});
```

**3. driver_location_update**
```javascript
socket.on('driver_location_update', (data) => {
  // data: { ride_id, driver_location: { latitude, longitude } }
});
```

### Client → Server Events

**1. join_ride**
```javascript
socket.emit('join_ride', { ride_id: 'ride_abc123' });
```

**2. update_user_location**
```javascript
socket.emit('update_user_location', {
  ride_id: 'ride_abc123',
  location: { latitude: 33.875, longitude: -84.533 }
});
```

---

## 📊 Estructura de Datos Firebase

### Colección: `ride`
```javascript
{
  ride_id: "auto_generated",
  user_uid: "ekdISmrCcMQyF1lDEvrOdX4hSnp2",
  user_name: "Juan Pérez",
  user_location: GeoPoint(33.8751328, -84.53365579999999),
  destination_address: "123 Main St, Atlanta, GA",
  destination_location: GeoPoint(33.8800000, -84.5400000),
  driver_uid: "driver_uid_here",
  driver_name: "Pedro Lopez",
  driver_location: GeoPoint(33.8760000, -84.5340000),
  is_driver_assigned: true,
  status: "started", // requested, accepted, started, completed, cancelled
  payment_method: "card",
  fare: 15.50,
  distance: 5.2,
  rating: null,
  review: null,
  created_at: Timestamp,
  started_at: Timestamp,
  completed_at: Timestamp
}
```

---

## 🔐 Autenticación

Todos los endpoints (excepto login/register) requieren:
```
Authorization: Bearer <token>
```

El token es el JWT que retorna `/userslogin` o `/userregister`.

---

## 💡 Notas de Implementación

1. **Cálculo de Distancia**: Usa Haversine formula
2. **Cálculo de Tarifa**: Base fare + per km rate
3. **GeoPoints**: Firebase Firestore GeoPoint format
4. **Real-time**: Socket.IO para actualizaciones en vivo
5. **Seguridad**: Validar user_uid del token con el request

---

## 🚀 Prioridad de Implementación

**Fase 1 (Crítico):**
1. ✅ `/userslogin` (Ya implementado)
2. ✅ `/userregister` (Ya implementado)
3. 🔧 `/create_ride` (Necesario)
4. 🔧 `/user_rides` (Necesario)

**Fase 2 (Importante):**
5. 🔧 `/ride_details`
6. 🔧 `/cancel_ride`
7. 🔧 Socket.IO setup

**Fase 3 (Nice to have):**
8. 🔧 `/rate_ride`
9. 🔧 `/user_wallet`
10. 🔧 `/topup_wallet`

---

**Última actualización**: 2025-01-28
**Versión**: 1.0
