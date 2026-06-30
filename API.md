# API Contract — IDN Package Backend

**Base URL:** `https://idnpackage-backend-production.up.railway.app/`

---

## 1. Global Response Envelope

Every response (success or error) follows a **standard shape**. Your frontend only needs to look at `data` and handle both cases.

### ✅ Success (200–299)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request processed successfully",
  "data": {
    /* endpoint-specific payload */
  },
  "timestamp": "2026-06-14T15:30:00.000Z"
}
```

### ❌ Error (400–599)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-06-14T15:30:00.000Z"
}
```

> **Frontend rule:** Always check `success` first. If `true`, read `data`. If `false`, show `message` to the user.

---

## 2. Common Headers

| Header                           | When                          | Value                         |
| -------------------------------- | ----------------------------- | ----------------------------- |
| `Authorization: Bearer <token>`  | All `GET /me` endpoints       | JWT token from login response |
| `Content-Type: application/json` | All `POST` / `PATCH` requests | —                             |

---

## 3. Auth Endpoints

---

### POST `/auth/login` — Login (v1)

Public. Returns JWT + user info.

**Request body:**

```json
{
  "email": "masaid@example.com",
  "password": "secret123"
}
```

**Response `data`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 12,
  "roomId": 1,
  "name": "Masaid Fairus",
  "role": "student"
}
```

---

### GET `/auth/me` — Get current user (v1)

Requires `Authorization: Bearer <token>` header.

**Response `data`:**

```json
{
  "userId": 12,
  "roomId": 1,
  "name": "Masaid Fairus",
  "role": "student"
}
```

---

### POST `/auth-v2/login` — Login (v2)

Same as v1 but uses Passport. Same body, same response shape.

**Request body:**

```json
{
  "email": "masaid@example.com",
  "password": "secret123"
}
```

**Response `data`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 12,
  "roomId": 1,
  "name": "Masaid Fairus",
  "role": "student"
}
```

---

### GET `/auth-v2/me` — Get current user (v2)

Requires `Authorization: Bearer <token>` header.

**Response `data`:**

```json
{
  "userId": 12,
  "roomId": 1,
  "name": "Masaid Fairus",
  "role": "student"
}
```

> **v1 vs v2:** They are identical in input/output. Both work. v2 is the recommended version. Use whichever you prefer.

---

## 4. Users

---

### POST `/users` — Create user

Public. Creates a user with hashed password.

**Request body:**

```json
{
  "name": "Masaid Fairus",
  "email": "masaid@example.com",
  "password": "secret123",
  "roomId": 1
}
```

**Response `data`:** The created user object:

```json
{
  "id": 12,
  "name": "Masaid Fairus",
  "email": "masaid@example.com",
  "password": "$2b$10$...",
  "role": "student",
  "roomId": 1,
  "createdAt": "2026-06-14T15:30:00.000Z"
}
```

> ⚠️ `password` is bcrypt-hashed. `roomId` contains the numeric FK, but when loaded via the relation it may return the full `Room` object.

---

### GET `/users` — List all users

Public.

**Response `data`:** Array of user objects:

```json
[
  {
    "id": 12,
    "name": "Masaid Fairus",
    "email": "masaid@example.com",
    "role": "student",
    "roomId": 1,
    "createdAt": "2026-06-14T15:30:00.000Z"
  }
]
```

---

### GET `/users/:id` — Get user by ID

Public.

**Response `data`:** Single user object or `null`.

---

### PATCH `/users/:id` — Update user

Public. All fields optional.

**Request body:** (any subset)

```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newPassword",
  "roomId": 2
}
```

**Response:** `data` is empty (204-like). Status code indicates success.

---

### DELETE `/users/:id` — Delete user

Public.

**Response:** `data` is empty.

---

## 5. Rooms

> ⚠️ Rooms endpoints currently return **placeholder strings only**. The service layer has not been implemented yet.

### POST `/rooms`

**Request body:** `{}` (empty, no fields defined yet)

**Response `data`:**

```text
"This action adds a new room"
```

### GET `/rooms`

**Response `data`:**

```text
"This action returns all rooms"
```

### GET `/rooms/:id`

**Response `data`:**

```text
"This action returns a #1 room"
```

### PATCH `/rooms/:id`

**Request body:** `{}` (empty)

**Response `data`:**

```text
"This action updates a #1 room"
```

### DELETE `/rooms/:id`

**Response `data`:**

```text
"This action removes a #1 room"
```

---

## 6. Packages

> ⚠️ Packages endpoints currently return **placeholder strings only**. The service layer has not been implemented yet.

### POST `/packages`

**Request body:** `{}` (empty, no fields defined yet)

**Response `data`:**

```text
"This action adds a new package"
```

### GET `/packages`

**Response `data`:**

```text
"This action returns all packages"
```

### GET `/packages/:id`

**Response `data`:**

```text
"This action returns a #1 package"
```

### PATCH `/packages/:id`

**Request body:** `{}` (empty)

**Response `data`:**

```text
"This action updates a #1 package"
```

### DELETE `/packages/:id`

**Response `data`:**

```text
"This action removes a #1 package"
```

---

## 7. Error Scenarios

| Scenario             | Status | Example `message`                                        |
| -------------------- | ------ | -------------------------------------------------------- |
| Missing/expired JWT  | 401    | `Unauthorized`                                           |
| Wrong email/password | 401    | `Unauthorized`                                           |
| Validation error     | 400    | `["email must be an email", "name should not be empty"]` |
| Resource not found   | 404    | `User with ID 99 not found`                              |
| Server error         | 500    | `Internal server error`                                  |

---

## 8. JWT Token Info

- **Algorithm:** HS256
- **Expires:** 1 day
- **Payload contents:**

```json
{
  "sub": 12,
  "roomId": 1,
  "name": "Masaid Fairus",
  "role": "student",
  "iat": 1718370000,
  "exp": 1718456400
}
```

---

## 9. Enums

| Enum              | Values                                       |
| ----------------- | -------------------------------------------- |
| `UserRole`        | `admin`, `operator`, `teacher`, `student`    |
| `PackageLocation` | `security_post`, `dormitory_office`, `taken` |

---

## 10. Quick Reference Table

| Method | Path             | Auth         | Body                                    |
| ------ | ---------------- | ------------ | --------------------------------------- |
| POST   | `/auth/login`    | —            | `{ email, password }`                   |
| GET    | `/auth/me`       | Bearer token | —                                       |
| POST   | `/auth-v2/login` | —            | `{ email, password }`                   |
| GET    | `/auth-v2/me`    | Bearer token | —                                       |
| POST   | `/users`         | —            | `{ name, email, password, roomId }`     |
| GET    | `/users`         | —            | —                                       |
| GET    | `/users/:id`     | —            | —                                       |
| PATCH  | `/users/:id`     | —            | `{ name?, email?, password?, roomId? }` |
| DELETE | `/users/:id`     | —            | —                                       |
| POST   | `/rooms`         | —            | `{}` (stub)                             |
| GET    | `/rooms`         | —            | —                                       |
| GET    | `/rooms/:id`     | —            | —                                       |
| PATCH  | `/rooms/:id`     | —            | `{}` (stub)                             |
| DELETE | `/rooms/:id`     | —            | —                                       |
| POST   | `/packages`      | —            | `{}` (stub)                             |
| GET    | `/packages`      | —            | —                                       |
| GET    | `/packages/:id`  | —            | —                                       |
| PATCH  | `/packages/:id`  | —            | `{}` (stub)                             |
| DELETE | `/packages/:id`  | —            | —                                       |
