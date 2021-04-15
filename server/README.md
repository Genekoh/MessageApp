# Messaging App API Server

This api uses JWTs for authorization. Most api endpoints requires an access token in the headers.
Every Access Token expires in 15 minutes. To get a new access token a Refresh Token is used to get a new access token from the endpoint **_/refresh-token._** Refresh Tokens expires in 7 days and is stored in an HTTP-ONLY cookie

---

## **POST** /login

### Login a user from the username and password in the body then if username and password is valid returns a json that contains an access token for the user.

### Example Request Body:

```
{
    "username": "foo",
    "password": "bar"
}
```

### Example Response:

```
{
    "ok": true,             // returns false when there is an error
    "accessToken": "..."    // returns an empty string during an error
}
```

## **POST** /refresh-token

### Get a new access token using the refresh token stored in the Http-Only Cookie when the old access token has expired.

### Example Request Body:

```
{
    "username": "foo"
}
```

### Example Response:

```
{
    "ok": true,
    "accessToken": "..."
}
```
