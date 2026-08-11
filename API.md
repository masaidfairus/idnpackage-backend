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
| `Authorization: Bearer <token>`  | All protected endpoints       | JWT token from login response |
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
  "name": "Masaid Fairus",
  "role": "admin",
  "tokenVersion": 1
}
```

---

### POST `/auth/logout` — Logout (v1)

Requires `Authorization: Bearer <token>` header. Invalidates the session by incrementing the user's `tokenVersion`, making all existing JWTs for that user unusable.

**Response `data`:**

```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/auth/me` — Get current user (v1)

Requires `Authorization: Bearer <token>` header.

**Response `data`:**

```json
{
  "userId": 12,
  "name": "Masaid Fairus",
  "role": "admin",
  "tokenVersion": 1
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
  "name": "Masaid Fairus",
  "role": "admin",
  "tokenVersion": 1
}
```

---

### POST `/auth-v2/logout` — Logout (v2)

Requires `Authorization: Bearer <token>` header. Same behavior as v1 logout.

**Response `data`:**

```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/auth-v2/me` — Get current user (v2)

Requires `Authorization: Bearer <token>` header.

**Response `data`:**

```json
{
  "userId": 12,
  "name": "Masaid Fairus",
  "role": "admin",
  "tokenVersion": 1
}
```

> **v1 vs v2:** They are identical in input/output. Both work. v2 is the recommended version. Use whichever you prefer.

---

## 4. Users

---

### POST `/users` — Create user

Requires `Authorization: Bearer <token>` header and role `admin`.

**Request body:**

```json
{
  "name": "Masaid Fairus",
  "email": "masaid@example.com",
  "password": "secret123",
  "role": "admin"
}
```

| Field      | Type     | Required | Description                                      |
| ---------- | -------- | -------- | ------------------------------------------------ |
| `name`     | string   | yes      | User's full name                                 |
| `email`    | string   | yes      | User's email (unique)                            |
| `password` | string   | yes      | Plain-text password (bcrypt-hashed before store) |
| `role`     | enum     | no       | `admin`, `operator`, `teacher` (default: `teacher`) |

**Response `data`:** The created user object:

```json
{
  "id": 12,
  "name": "Masaid Fairus",
  "email": "masaid@example.com",
  "password": "$2b$10$...",
  "role": "admin",
  "tokenVersion": 0,
  "createdAt": "2026-06-14T15:30:00.000Z"
}
```

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
    "role": "admin",
    "tokenVersion": 0,
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

Requires `Authorization: Bearer <token>` header and role `admin`. All fields optional.

**Request body:** (any subset)

```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newPassword",
  "role": "operator"
}
```

**Response `data`:** The updated user object.

---

### DELETE `/users/:id` — Delete user

Requires `Authorization: Bearer <token>` header and role `admin`.

**Response `data`:** The delete result object.

---

## 5. Rooms

---

### POST `/rooms`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

**Request body:**

```json
{
  "name": "A101",
  "floor": 1
}
```

| Field   | Type   | Required | Description       |
| ------- | ------ | -------- | ----------------- |
| `name`  | string | yes      | Room name/number  |
| `floor` | number | yes      | Floor number      |

**Response `data`:** The created room object:

```json
{
  "id": 1,
  "name": "A101",
  "floor": 1,
  "createdAt": "2026-06-14T15:30:00.000Z"
}
```

---

### GET `/rooms`

Public.

**Response `data`:** Array of room objects (each includes `students` relation).

---

### GET `/rooms/:id`

Public.

**Response `data`:** Single room object with `students` relation, or `null`.

---

### PATCH `/rooms/:id`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

**Request body:** (any subset)

```json
{
  "name": "A102",
  "floor": 2
}
```

**Response `data`:** The updated room object.

---

### DELETE `/rooms/:id`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

**Response `data`:** The delete result object.

---

## 6. Students

---

### POST `/students`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

**Request body:**

```json
{
  "name": "Budi Santoso",
  "nis": "1234567890",
  "roomId": 1
}
```

| Field    | Type   | Required | Description             |
| -------- | ------ | -------- | ----------------------- |
| `name`   | string | yes      | Student's full name     |
| `nis`    | string | yes      | Student NIS (unique)    |
| `roomId` | number | yes      | ID of the student's room |

**Response `data`:** The created student object:

```json
{
  "id": 1,
  "name": "Budi Santoso",
  "nis": "1234567890",
  "isActive": true,
  "roomId": { ... },
  "createdAt": "2026-06-14T15:30:00.000Z"
}
```

> `roomId` is returned as a full nested Room object.
>
> `isActive` indicates whether the student is current (`true`) or archived (`false`).

---

### POST `/students/bulk` — Bulk sync students

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

Bulk-create/update students from an imported list (e.g. CSV). Matching strategy:

1. **Upsert by NIS** when a valid NIS is provided (updates existing student & re-activates archived ones).
2. **Dedupe by name + room** when NIS is empty/`N/A` (skips if a match already exists).

Room is resolved by `roomName` — case-insensitive. Any non-existent room name aborts with a 400 error.

**Request body:**

```json
{
  "students": [
    {
      "name": "Budi Santoso",
      "nis": "1234567890",
      "roomName": "Kamar 2.4"
    },
    {
      "name": "Siti Aminah",
      "roomName": "Kamar 2.4"
    }
  ]
}
```

| Field          | Type     | Required | Description                       |
| -------------- | -------- | -------- | --------------------------------- |
| `students`     | array    | yes      | List of student entries           |
| `students[].name`     | string | yes      | Student's full name               |
| `students[].nis`      | string | no       | Student NIS; skip/blank/`N/A` uses name+room dedupe |
| `students[].roomName` | string | yes      | Existing room name (case-insensitive) |

**Response `data`:**

```json
{
  "added": 1,
  "updated": 0,
  "skipped": 1,
  "details": {
    "added": ["Budi Santoso"],
    "updated": [],
    "skipped": ["Siti Aminah"]
  }
}
```

---

### GET `/students` — List active students

Public.

**Response `data`:** Array of active (`isActive: true`) student objects.

---

### GET `/students/archived` — List archived students

Public.

**Response `data`:** Array of archived (`isActive: false`) student objects.

---

### GET `/students/:id`

Public.

**Response `data`:** Single student object or `null`.

---

### PATCH `/students/:id`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

All fields optional. Only provided fields are updated.

**Request body:** (any subset)

```json
{
  "name": "Updated Name",
  "nis": "0987654321",
  "roomId": 2
}
```

**Response `data`:** The updated student object.

---

### PATCH `/students/:id/archive` — Archive a student

Requires `Authorization: Bearer <token>` header and role `admin`.

Soft-deletes the student by setting `isActive` to `false` (e.g. graduate). The student no longer appears in `GET /students` but is kept in `GET /students/archived`.

**Response `data`:** The updated student object with `isActive: false`.

---

### DELETE `/students/:id`

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

**Response `data`:** The delete result object.

---

### DELETE `/students/reset-all` — Reset all students

Requires `Authorization: Bearer <token>` header and role `admin`.

Hard-reset for a new academic year. Deletes **all** packages first (to avoid foreign-key errors), then removes **all** students from the database (active and archived).

**Response `data`:**

```json
{
  "deleted": "all"
}
```

> ⚠️ **Destructive.** This permanently removes every package and student record.

---

## 7. Employees

---

### POST `/employees` — Create an employee

Requires `Authorization: Bearer <token>` header and role `admin`.

**Request body:**

```json
{
  "name": "Budi Santoso",
  "division": "Keamanan",
  "position": "Satpam"
}
```

| Field      | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| `name`     | string | yes      | Employee full name |
| `division` | string | yes      | Employee division  |
| `position` | string | yes      | Job position       |

**Response `data`:** The created employee object:

```json
{
  "id": 1,
  "name": "Budi Santoso",
  "division": "Keamanan",
  "position": "Satpam"
}
```

---

### GET `/employees` — List all employees

Public.

**Response `data`:** Array of employee objects.

---

### GET `/employees/:id` — Get an employee by ID

Public.

**Response `data`:** Single employee object or `null`.

---

### PATCH `/employees/:id` — Update an employee

Requires `Authorization: Bearer <token>` header and role `admin`.

All fields optional. Only provided fields are updated.

**Request body:** (any subset)

```json
{
  "name": "Updated Name",
  "division": "Kebersihan",
  "position": "Petugas Kebersihan"
}
```

**Response `data`:** The updated employee object.

---

### DELETE `/employees/:id` — Delete an employee

Requires `Authorization: Bearer <token>` header and role `admin`.

**Response `data`:** The delete result object.

---

## 8. Packages

---

### POST `/packages` — Create a package

Requires `Authorization: Bearer <token>` header and role `admin` or `operator`.

**Request body:**

```json
{
  "studentId": 1,
  "roomId": 2,
  "location": "security_post",
  "notes": "Handle with care",
  "photoUrl": "https://example.com/photo.jpg",
  "createdBy": 12
}
```

| Field       | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| `studentId` | number   | yes      | Student ID                 |
| `roomId`    | number   | yes      | Room ID                    |
| `location`  | enum     | yes      | `security_post`, `dormitory_office`, `taken` |
| `notes`     | string   | no       | Optional notes             |
| `photoUrl`  | string   | no       | Optional photo URL         |
| `createdBy` | number   | yes      | Operator/user ID           |

`receivedDate` is auto-set to the current date on creation.

**Response `data`:** The created package object:

```json
{
  "id": 1,
  "studentId": { ... },
  "roomId": { ... },
  "receivedDate": "2026-06-14",
  "location": "security_post",
  "pickedUpDate": null,
  "notes": "Handle with care",
  "photoUrl": "https://example.com/photo.jpg",
  "createdBy": { ... },
  "createdAt": "2026-06-14T15:30:00.000Z",
  "updatedAt": "2026-06-14T15:30:00.000Z"
}
```

> Related entities (`studentId`, `roomId`, `createdBy`) are returned as full nested objects.

---

### GET `/packages` — List all packages

Public.

**Response `data`:** Array of package objects (same shape as above, with relations populated).

---

### GET `/packages/:id` — Get a package by ID

Public.

**Response `data`:** Single package object (with relations populated) or `null`.

---

### PATCH `/packages/:id` — Update a package

Requires `Authorization: Bearer <token>` header and role `admin` or `teacher`.

All fields are optional. Only provided fields are updated.

**Request body:**

```json
{
  "location": "taken",
  "pickedUpDate": "2026-06-15T10:00:00.000Z",
  "notes": "Picked up by student"
}
```

| Field          | Type     | Required | Description                              |
| -------------- | -------- | -------- | ---------------------------------------- |
| `studentId`    | number   | no       | Student ID                               |
| `roomId`       | number   | no       | Room ID                                  |
| `location`     | enum     | no       | `security_post`, `dormitory_office`, `taken` |
| `notes`        | string   | no       | Optional notes                           |
| `photoUrl`     | string   | no       | Optional photo URL                       |
| `createdBy`    | number   | no       | Operator/user ID                         |
| `pickedUpDate` | date     | no       | Date-time when the package was picked up |

> Mark a package as picked up by setting `location` to `taken` and `pickedUpDate` to the current timestamp.

**Response `data`:** The updated package object.

---

### DELETE `/packages/:id` — Delete a package

Requires `Authorization: Bearer <token>` header and role `admin`.

**Response `data`:** The delete result object.

---

## 9. Error Scenarios

| Scenario             | Status | Example `message`                                        |
| -------------------- | ------ | -------------------------------------------------------- |
| Missing/expired JWT  | 401    | `Unauthorized`                                           |
| Wrong email/password | 401    | `Unauthorized`                                           |
| Validation error     | 400    | `["email must be an email", "name should not be empty"]` |
| Resource not found   | 404    | `User with ID 99 not found`                              |
| Server error         | 500    | `Internal server error`                                  |

---

## 10. JWT Token Info

- **Algorithm:** HS256
- **Expires:** 1 day
- **Payload contents:**

```json
{
  "sub": 12,
  "name": "Masaid Fairus",
  "role": "admin",
  "tokenVersion": 1,
  "iat": 1718370000,
  "exp": 1718456400
}
```

---

## 11. Enums

| Enum              | Values                                       |
| ----------------- | -------------------------------------------- |
| `UserRole`        | `admin`, `operator`, `teacher`               |
| `PackageLocation` | `security_post`, `dormitory_office`, `taken` |

---

## 12. Quick Reference Table

| Method | Path              | Auth                    | Body                                    |
| ------ | ----------------- | ----------------------- | --------------------------------------- |
| POST   | `/auth/login`     | —                       | `{ email, password }`                   |
| GET    | `/auth/me`        | Bearer token            | —                                       |
| POST   | `/auth/logout`    | Bearer token            | —                                       |
| POST   | `/auth-v2/login`  | —                       | `{ email, password }`                   |
| GET    | `/auth-v2/me`     | Bearer token            | —                                       |
| POST   | `/auth-v2/logout` | Bearer token            | —                                       |
| POST   | `/users`          | Bearer + Admin          | `{ name, email, password, role? }`      |
| GET    | `/users`          | —                       | —                                       |
| GET    | `/users/:id`      | —                       | —                                       |
| PATCH  | `/users/:id`      | Bearer + Admin          | `{ name?, email?, password?, role? }`   |
| DELETE | `/users/:id`      | Bearer + Admin          | —                                       |
| POST   | `/rooms`          | Bearer + Admin/Teacher  | `{ name, floor }`                       |
| GET    | `/rooms`          | —                       | —                                       |
| GET    | `/rooms/:id`      | —                       | —                                       |
| PATCH  | `/rooms/:id`      | Bearer + Admin/Teacher  | `{ name?, floor? }`                     |
| DELETE | `/rooms/:id`      | Bearer + Admin/Teacher  | —                                       |
| POST   | `/students`       | Bearer + Admin/Teacher  | `{ name, nis, roomId }`                 |
| POST   | `/students/bulk`  | Bearer + Admin/Teacher  | `{ students: [{ name, nis?, roomName }] }` |
| GET    | `/students`       | —                       | —                                       |
| GET    | `/students/archived` | —                    | —                                       |
| GET    | `/students/:id`   | —                       | —                                       |
| PATCH  | `/students/:id`   | Bearer + Admin/Teacher  | `{ name?, nis?, roomId? }`              |
| PATCH  | `/students/:id/archive` | Bearer + Admin      | —                                       |
| DELETE | `/students/:id`   | Bearer + Admin/Teacher  | —                                       |
| DELETE | `/students/reset-all` | Bearer + Admin       | —                                       |
| POST   | `/employees`      | Bearer + Admin          | `{ name, division, position }`          |
| GET    | `/employees`      | —                       | —                                       |
| GET    | `/employees/:id`  | —                       | —                                       |
| PATCH  | `/employees/:id`  | Bearer + Admin          | `{ name?, division?, position? }`       |
| DELETE | `/employees/:id`  | Bearer + Admin          | —                                       |
| POST   | `/packages`       | Bearer + Admin/Operator | `{ studentId, roomId, location, createdBy, notes?, photoUrl? }` |
| GET    | `/packages`       | —                       | —                                       |
| GET    | `/packages/:id`   | —                       | —                                       |
| PATCH  | `/packages/:id`   | Bearer + Admin/Teacher  | `{ studentId?, roomId?, location?, notes?, photoUrl?, createdBy?, pickedUpDate? }` |
| DELETE | `/packages/:id`   | Bearer + Admin          | —                                       |
