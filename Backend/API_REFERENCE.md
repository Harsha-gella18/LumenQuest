# FiberConnectTV API Reference

This document lists all backend API endpoints, their methods, request/response formats, and sample data for frontend integration.

---

## Auth APIs

### Signup
- **POST** `/api/auth/signup`
- **Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "preferences": ["Sports", "Movies"],
  "profilePic": "https://example.com/pic.jpg"
}
```
- **Response:**
```json
{
  "message": "Signup successful",
  "userId": "user1"
}
```

### Login
- **POST** `/api/auth/login`
- **Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "userId": "user1",
  "token": "jwt_token_here"
}
```

---

## User APIs

### Get My Profile
- **GET** `/api/users/me`
- **Headers:** `x-user-id: <user_id>`
- **Response:**
```json
{
  "_id": "user1",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "preferences": ["Sports", "Movies"],
  "profilePic": "https://example.com/pic.jpg",
  "role": "user",
  "isVerified": true,
  "createdAt": "2025-09-13T08:00:00Z",
  "lastLogin": "2025-09-13T10:00:00Z"
}
```

### Update My Profile
- **PUT** `/api/users/me`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "fullName": "John Updated",
  "phone": "9876543210"
}
```
- **Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

### Get All Plans
- **GET** `/api/users/plans`
- **Headers:** `x-user-id: <user_id>`
- **Response:**
```json
[
  {
    "_id": "plan1",
    "name": "Family Pack",
    "category": "Basic",
    "description": "Best for families",
    "pricePerMonth": 299,
    "channels": ["Star Plus", "Sony"],
    "isActive": true
  }
]
```

### Create Subscription
- **POST** `/api/users/subscriptions`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "planId": "plan1",
  "duration": 3,
  "autoRenew": true,
  "offerCode": "FESTIVE20"
}
```
- **Response:**
```json
{
  "subscriptionId": "sub123",
  "status": "pending",
  "paymentLink": "https://payment.gateway/checkout/sub123"
}
```

### Cancel Subscription
- **PUT** `/api/users/subscriptions/cancel`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "subscriptionId": "sub123"
}
```
- **Response:**
```json
{
  "message": "Subscription cancelled successfully",
  "status": "cancelled"
}
```

### Renew Subscription
- **PUT** `/api/users/subscriptions/renew`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "subscriptionId": "sub123",
  "duration": 3
}
```
- **Response:**
```json
{
  "message": "Subscription renewed",
  "newExpiry": "2025-12-13T08:00:00Z"
}
```

### Change Plan
- **PUT** `/api/users/subscriptions/change-plan`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "subscriptionId": "sub123",
  "newPlanId": "plan2",
  "duration": 2
}
```
- **Response:**
```json
{
  "message": "Plan changed successfully",
  "subscriptionId": "sub456",
  "status": "active"
}
```

### Get My Subscriptions
- **GET** `/api/users/subscriptions/me`
- **Headers:** `x-user-id: <user_id>`
- **Response:**
```json
[
  {
    "subscriptionId": "sub123",
    "planName": "Family Pack",
    "status": "active",
    "expiresAt": "2025-12-13T08:00:00Z",
    "autoRenew": true
  }
]
```

---

## Payment APIs

### Initiate Payment
- **POST** `/api/users/payments/initiate`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "planId": "plan1",
  "duration": 2,
  "gateway": "stripe"
}
```
- **Response:**
```json
{
  "paymentId": "pay123",
  "paymentLink": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Verify Payment
- **POST** `/api/users/payments/verify`
- **Headers:** `x-user-id: <user_id>`
- **Request:**
```json
{
  "transactionId": "cs_test_...",
  "status": "success"
}
```
- **Response (success):**
```json
{
  "message": "Payment verified, subscription activated",
  "subscriptionId": "sub123"
}
```
- **Response (fail):**
```json
{
  "message": "Payment failed"
}
```

### Get Payment History
- **GET** `/api/users/payments/history`
- **Headers:** `x-user-id: <user_id>`
- **Response:**
```json
[
  {
    "_id": "pay123",
    "planId": "plan1",
    "amount": 598,
    "duration": 2,
    "status": "success",
    "paymentGateway": "stripe",
    "transactionId": "cs_test_...",
    "createdAt": "2025-09-13T08:00:00Z"
  }
]
```

---

## Admin APIs

### Create Plan
- **POST** `/api/admin/plans`
- **Request:**
```json
{
  "name": "Regional Pack",
  "category": "Add-on",
  "description": "Telugu/Tamil/Malayalam channels",
  "pricePerMonth": 199,
  "channels": ["Gemini TV", "Sun TV"],
  "isActive": true
}
```
- **Response:**
```json
{
  "message": "Plan created successfully",
  "planId": "plan5"
}
```

### Update Plan
- **PUT** `/api/admin/plans/:id`
- **Request:**
```json
{
  "pricePerMonth": 249,
  "isActive": true
}
```
- **Response:**
```json
{
  "message": "Plan updated successfully",
  "planId": "plan5"
}
```

### Deactivate Plan
- **DELETE** `/api/admin/plans/:id`
- **Response:**
```json
{
  "message": "Plan deactivated"
}
```

### Create Offer
- **POST** `/api/admin/offers`
- **Request:**
```json
{
  "code": "FESTIVE20",
  "description": "20% off on all plans",
  "discountPercent": 20,
  "validFrom": "2025-09-10",
  "validUntil": "2025-09-30",
  "applicablePlans": ["plan1", "plan2"],
  "active": true
}
```
- **Response:**
```json
{
  "message": "Offer created",
  "offerId": "offer123"
}
```

### Update Offer
- **PUT** `/api/admin/offers/:id`
- **Request:**
```json
{
  "discountPercent": 25
}
```
- **Response:**
```json
{
  "message": "Offer updated"
}
```

### Deactivate Offer
- **DELETE** `/api/admin/offers/:id`
- **Response:**
```json
{
  "message": "Offer deactivated"
}
```

### Get Users
- **GET** `/api/admin/users?search=John&role=user`
- **Response:**
```json
[
  {
    "_id": "user1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "createdAt": "2025-09-13T08:00:00Z"
  }
]
```

### Get User By ID
- **GET** `/api/admin/users/:id`
- **Response:**
```json
{
  "_id": "user1",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "preferences": ["Sports", "Movies"],
  "subscriptions": [
    { "subscriptionId": "sub123", "planName": "Sports Pack", "status": "active" }
  ]
}
```

### Update User
- **PUT** `/api/admin/users/:id`
- **Request:**
```json
{
  "role": "admin",
  "isVerified": true
}
```
- **Response:**
```json
{
  "message": "User updated successfully"
}
```

### Analytics
- **GET** `/api/admin/analytics/active-subscriptions`
- **Response:**
```json
{ "activeSubscriptions": 1023 }
```
- **GET** `/api/admin/analytics/cancelled-subscriptions`
- **Response:**
```json
{ "cancelledSubscriptions": 123 }
```
- **GET** `/api/admin/analytics/top-plans?period=monthly`
- **Response:**
```json
[
  { "planName": "Family Pack", "subscriptions": 512 },
  { "planName": "Sports Pack", "subscriptions": 423 }
]
```
- **GET** `/api/admin/analytics/revenue?month=2025-09`
- **Response:**
```json
{ "revenue": 1234567 }
```
- **GET** `/api/admin/analytics/trends`
- **Response:**
```json
[
  { "month": "Apr", "active": 900, "cancelled": 50 },
  { "month": "May", "active": 950, "cancelled": 60 }
]
```

### Audit Logs
- **GET** `/api/admin/audit-logs?page=1&limit=20`
- **Response:**
```json
[
  {
    "actorId": "admin1",
    "role": "admin",
    "action": "CREATE_PLAN",
    "target": "plan5",
    "timestamp": "2025-09-13T08:00:00Z",
    "metadata": { "name": "Regional Pack" }
  }
]
```

---

**Note:**
- For user routes, set `x-user-id` header to a valid user ID.
- For admin routes, no auth is needed for now (dummy admin).
- Replace `<plan_id>`, `<user_id>`, `<subscription_id>`, `<transaction_id>` with actual values from your DB.
