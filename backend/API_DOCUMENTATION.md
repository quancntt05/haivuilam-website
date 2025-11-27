# API Documentation

## Base Information

- **Base URL**: `http://localhost:3001`
- **API Version**: `v1`
- **API Prefix**: `/api/v1`
- **Content-Type**: `application/json` (except file uploads)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication via the `Authorization` header.

### Authentication Header Format

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token**: Short-lived token (default: 7 days) used for API requests
- **Refresh Token**: Long-lived token (default: 30 days) used to obtain new access tokens

---

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (optional)"
}
```

---

## Health Check

### GET /health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Authentication Endpoints

### POST /api/v1/auth/google/callback

Authenticate user with Google OAuth data.

**Request Body:**
```json
{
  "email": "user@example.com",
  "providerId": "google_provider_id",
  "name": "User Name",
  "picture": "https://profile-picture-url.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required Google user data
- `500 Internal Server Error`: Authentication failed

---

### POST /api/v1/auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Refresh token is required
- `401 Unauthorized`: Invalid or expired refresh token

---

### POST /api/v1/auth/logout

Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

---

## Photo Endpoints

### POST /api/v1/photos/upload

Upload a new photo (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `photo` (file): Image file (JPEG, PNG, or WebP)
  - Max size: 5MB
  - Allowed types: `image/jpeg`, `image/png`, `image/webp`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "id": "photo-uuid",
    "userId": "user-uuid",
    "filename": "photo-1234567890-12345678.png",
    "originalName": "my-photo.png",
    "mimeType": "image/png",
    "size": 1024000,
    "url": "http://localhost:3001/uploads/photos/photo-1234567890-12345678.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded, invalid file type, or file too large
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to upload photo

---

### GET /api/v1/photos

Get all photos with pagination.

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Number of items per page

**Example Request:**
```
GET /api/v1/photos?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "photos": [
      {
        "id": "photo-uuid",
        "userId": "user-uuid",
        "filename": "photo-1234567890-12345678.png",
        "originalName": "my-photo.png",
        "mimeType": "image/png",
        "size": 1024000,
        "url": "http://localhost:3001/uploads/photos/photo-1234567890-12345678.png",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "user@example.com",
          "name": "User Name"
        },
        "_count": {
          "comments": 5
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid pagination parameters
- `500 Internal Server Error`: Failed to fetch photos

---

### GET /api/v1/photos/:id

Get a specific photo by ID.

**Path Parameters:**
- `id` (required): Photo UUID

**Example Request:**
```
GET /api/v1/photos/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "photo-uuid",
    "userId": "user-uuid",
    "filename": "photo-1234567890-12345678.png",
    "originalName": "my-photo.png",
    "mimeType": "image/png",
    "size": 1024000,
    "url": "http://localhost:3001/uploads/photos/photo-1234567890-12345678.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    },
    "_count": {
      "comments": 5
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format
- `404 Not Found`: Photo not found
- `500 Internal Server Error`: Failed to fetch photo

---

### GET /api/v1/photos/user/:userId

Get all photos for a specific user with pagination.

**Path Parameters:**
- `userId` (required): User UUID

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Number of items per page

**Example Request:**
```
GET /api/v1/photos/user/123e4567-e89b-12d3-a456-426614174000?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "photos": [
      {
        "id": "photo-uuid",
        "userId": "user-uuid",
        "filename": "photo-1234567890-12345678.png",
        "originalName": "my-photo.png",
        "mimeType": "image/png",
        "size": 1024000,
        "url": "http://localhost:3001/uploads/photos/photo-1234567890-12345678.png",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "user@example.com",
          "name": "User Name"
        },
        "_count": {
          "comments": 5
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format or pagination parameters
- `500 Internal Server Error`: Failed to fetch user photos

---

### DELETE /api/v1/photos/:id

Delete a photo (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (required): Photo UUID

**Example Request:**
```
DELETE /api/v1/photos/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the owner of the photo
- `404 Not Found`: Photo not found
- `500 Internal Server Error`: Failed to delete photo

---

## Comment Endpoints

### POST /api/v1/comments

Create a new comment (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "photoId": "photo-uuid",
  "content": "This is a comment"
}
```

**Validation:**
- `photoId`: Required, must be a valid UUID
- `content`: Required, 1-1000 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": "comment-uuid",
    "photoId": "photo-uuid",
    "userId": "user-uuid",
    "content": "This is a comment",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid photoId or content validation failed
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Failed to create comment

---

### GET /api/v1/comments/photo/:photoId

Get all comments for a specific photo with pagination.

**Path Parameters:**
- `photoId` (required): Photo UUID

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Number of items per page

**Example Request:**
```
GET /api/v1/comments/photo/123e4567-e89b-12d3-a456-426614174000?page=1&limit=50
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment-uuid",
        "photoId": "photo-uuid",
        "userId": "user-uuid",
        "content": "This is a comment",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "email": "user@example.com",
          "name": "User Name"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25,
      "totalPages": 1
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format or pagination parameters
- `500 Internal Server Error`: Failed to fetch comments

---

### PUT /api/v1/comments/:id

Update a comment (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): Comment UUID

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Validation:**
- `content`: Required, 1-1000 characters

**Example Request:**
```
PUT /api/v1/comments/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": "comment-uuid",
    "photoId": "photo-uuid",
    "userId": "user-uuid",
    "content": "Updated comment content",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:01:00.000Z",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format or content validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the owner of the comment
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Failed to update comment

---

### DELETE /api/v1/comments/:id

Delete a comment (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (required): Comment UUID

**Example Request:**
```
DELETE /api/v1/comments/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid UUID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the owner of the comment
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Failed to delete comment

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters or validation failed |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - User does not have permission to perform the action |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error occurred |

---

## File Upload Requirements

### Supported File Types
- `image/jpeg` (JPEG)
- `image/png` (PNG)
- `image/webp` (WebP)

### File Size Limits
- Maximum file size: **5MB** (5,242,880 bytes)

### Upload Format
- Use `multipart/form-data` content type
- Field name: `photo`
- Example using `curl`:
  ```bash
  curl -X POST http://localhost:3001/api/v1/photos/upload \
    -H "Authorization: Bearer <access_token>" \
    -F "photo=@/path/to/image.jpg"
  ```

---

## Pagination

Most list endpoints support pagination using query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default varies by endpoint)

**Pagination Response Format:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## UUID Format

All IDs in the API use UUID v4 format:
```
123e4567-e89b-12d3-a456-426614174000
```

Invalid UUIDs will result in a `400 Bad Request` error.

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

---

## CORS

The API supports CORS (Cross-Origin Resource Sharing) for configured origins. The default origin is `http://localhost:3000`.

---

## Static File Serving

Uploaded photos are served statically at:
```
http://localhost:3001/uploads/photos/{filename}
```

These files are publicly accessible and do not require authentication.

---

## Examples

### Complete Authentication Flow

1. **Authenticate with Google:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/google/callback \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "providerId": "google_123456",
       "name": "John Doe",
       "picture": "https://example.com/picture.jpg"
     }'
   ```

2. **Use the access token for authenticated requests:**
   ```bash
   curl -X GET http://localhost:3001/api/v1/photos \
     -H "Authorization: Bearer <access_token>"
   ```

3. **Refresh token when access token expires:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{
       "refreshToken": "<refresh_token>"
     }'
   ```

### Upload Photo Example

```bash
curl -X POST http://localhost:3001/api/v1/photos/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "photo=@/path/to/photo.jpg"
```

### Create Comment Example

```bash
curl -X POST http://localhost:3001/api/v1/comments \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "photoId": "123e4567-e89b-12d3-a456-426614174000",
    "content": "Great photo!"
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All file URLs are absolute URLs
- The API version may change in the future; check the base URL for the current version
- For production use, ensure proper HTTPS configuration
- Environment variables can be configured via `.env` file

