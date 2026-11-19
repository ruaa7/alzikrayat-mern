# Alzikrayat-MERN

A full-stack photo sharing application.Users can register, log in, upload photos, browse a gallery,
open a photo's detail page, comment onphotos, and delete their own photos.

## Technologies
- **Client:** React 18, React Router 6, Vite, plain CSS (responsive), `fetch` for API calls
- **Server:** Node.js, Express 4, Mongoose (MongoDB), bcrypt, Joi, multer, cors, dotenv


## Requirements
- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup and run

### 1. Server
```bash
cd server
npm install
cp .env.example .env     
```
Edit `server/.env`:

Start the API:
```bash
npm run dev      
# or
npm start
```
The API runs on `http://localhost:5000`.

### 2. Client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the address Vite prints. The Vite dev server proxies `/api` and `/uploads` to the 
Express server so keep the server running.


## Security basics
- Passwords are hashed with bcrypt and never returned by the API.
- Secrets live in `server/.env`, which is excluded from Git by `.gitignore`.
- All input is validated on the server with Joi; uploads are limited to JPG/PNG/GIF/WEBP up to 5 MB
  and saved under random file names.

## Student Name
Ruaa Yousif Mohammed Elamin
