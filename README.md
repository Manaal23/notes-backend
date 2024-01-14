**Notes Backend**

**Framework:-** Expressjs

**Database:** Mongodb

**Third Party tools:** Elastic search , Jest

Node version: 16.8.0

Local setup steps:

- npm i
- env is attached with credentials so not much required.

Command to run:

- npm start
- npm test

**Payloads with api endpoint:**

**POST** /api/auth/signup 

Payload: {"firstname": "demo", "lastname": "demo", "email": "demo@gmail.com", "password": "12345"}

**POST** /api/auth/login

Payload: {"email": "demo@gmail.com", "password": "12345"}

**GET** /api/notes

Payload: None


**POST** /api/notes

Payload: {
    "note": "first note of manaal"
}


**PUT** /api/notes/:id

Payload: {
    "note": "first note of manaal",
    "shared": [userIds]
}

Params: NoteId


**GET** /api/notes/:id

Params: NoteId


**DELETE** /api/notes/:id

Params: NoteId


**POST** /api/notes/:id/share

Payload: {
    "shared": [userIds]
}

Params: NoteId


**GET** /api/search

Query: q=keyword







