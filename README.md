# Wanderlust

Wanderlust is a robust, full-stack travel and accommodation marketplace engineered to connect property hosts with travelers globally. Built originally as a traditional server-side rendered application, it has been completely re-architected into a high-performance **Single Page Application (SPA)**. The platform now leverages a decoupled architecture, pairing a highly responsive **React.js** front-end with an efficient, scalable **Node.js/Express.js RESTful API**. Wanderlust empowers users to seamlessly discover unique properties, manage complex listings, and engage with community-driven review systems.

## Architecture

The project is structured with a distinct separation of concerns:
- **Client**: A React-based SPA built with Vite. It manages client-side routing, global state via Context APIs (Authentication, Flash Messaging, and Tax configuration), and dynamic UI rendering.
- **Server**: A robust Node.js/Express API that handles business logic, database interactions, authentication, and structured error handling.
- **Database**: MongoDB integration utilizing Mongoose ODM for structured, relational-like data modeling between Users, Listings, and Reviews.

## Core Features

### Authentication and Authorization
- **Secure Authentication**: Implemented utilizing Passport.js with a Local Strategy. User sessions are persisted securely in MongoDB using `connect-mongo`.
- **Role-Based Authorization**: Custom Express middleware ensures stringent access control. Operations are protected by evaluating authentication status (`isLoggedIn`) and ownership (`isOwner`, `isReviewAuthor`). Users can only modify or delete listings and reviews they explicitly created.

### CRUD Operations & Listing Management
- **Extensive Functionality**: Full Create, Read, Update, and Delete lifecycle management for property listings and user reviews.
- **Categorization**: Listings can be filtered across various predefined categories (e.g., camping, tropical, iconic cities) to facilitate discovery.
- **Automated Data Maintenance**: Mongoose middleware automatically cascade-deletes associated reviews whenever a parent listing is removed, preventing orphaned documents in the database.

### Interactive Maps and Geolocation
- **Mapbox Integration**: Forward geocoding is utilized to transform user-provided location strings into accurate GeoJSON format.
- **Visual Representation**: Listings include interactive maps rendered via Mapbox GL JS on the client, utilizing coordinate geometry stored securely within the database schema.

### Data Security and Validation
- **Server-Side Validation**: All incoming requests for listings and reviews are validated against strict parameterized schemas using **Joi** before database interaction.
- **Assets Management**: Secure, direct cloud integrations via Multer and Cloudinary parse multipart-form data, hosting listing images entirely off-server.

### Error Handling
- **Centralized Error Middleware**: Express is configured with a comprehensive error-handling pipeline capturing asynchronous errors. Responses are uniformly structured as JSON objects, ensuring the client gracefully processes failed operations.
- **Custom Error Classes**: Implementation of an `ExpressError` wrapper handles status codes and custom messaging perfectly.
- **Route Fallbacks**: Custom 404 (Page Not Found) handlers catch unmapped API routes, whilst the frontend utilizes dedicated error boundaries and components for invalid pages.

## API Endpoints

The Express backend exposes a comprehensive JSON API designed for efficient client consumption. Below is the structured breakdown of the available RESTful routes:

### Authentication (`/api` & `/api/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Retrieves the currently authenticated user's session data and active flash messages. |
| `POST` | `/api/signup` | Registers a new user account within the database. |
| `POST` | `/api/login` | Authenticates existing user credentials and initializes a protected session. |
| `GET` | `/api/logout` | Terminates the active session and invalidates the local authentication store. |

### Listings (`/api/listings`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/listings` | Fetches an aggregate of all available property listings. | No |
| `GET` | `/api/listings/search` | Filters the property database utilizing specific category queries. | No |
| `POST` | `/api/listings` | Creates a new property listing. Accepts `multipart/form-data` for Cloudinary asset upload. | Yes |
| `GET` | `/api/listings/:id/edit`| Retrieves specific listing data formatted for pre-filling client-side edit forms. | Yes (Owner) |
| `GET` | `/api/listings/:id` | Fetches highly detailed listing data, hydrating the response with populated reviews and author details. | No |
| `PUT` | `/api/listings/:id` | Updates an existing listing entity. | Yes (Owner) |
| `DELETE` | `/api/listings/:id` | Removes a listing and cascades deletion to all associated review documents. | Yes (Owner) |

### Reviews (`/api/listings/:id/reviews`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/listings/:id/reviews` | Appends a new user-generated review with associated rating to a specific listing. | Yes |
| `DELETE` | `/api/listings/:id/reviews/:reviewId`| Deletes a specific review from a parent listing. | Yes (Author) |

## Technology Stack

- **Frontend**: React.js, Vite, React Router DOM, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication/Security**: Passport.js, Express Session, Connect-Mongo, Joi
- **External APIs**: Cloudinary (Image Hosting), Mapbox (Geolocation and Interactive Maps)

## Installation and Setup

Ensure you have Node.js (v20+) and MongoDB installed on your system. You will also require API credentials from Cloudinary and Mapbox.

### 1. Repository Setup

Clone the repository to your local environment:

```bash
git clone <repository-url>
cd Wanderlust
```

### 2. Backend Initialization

Install backend Node modules from the root directory:

```bash
npm install
```

Create a `.env` file at the root directory of the project and populate it with your environment variables:

```env
ATLASDB_URL=<your_mongodb_connection_string>
SECRET=<your_session_secret_key>
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>
MAP_TOKEN=<your_mapbox_public_token>
```

Start the backend server. By default, it will serve the API on port 8080:

```bash
node app.js
```

### 3. Frontend Initialization

Open a new terminal window. Navigate into the React client directory and install its dependencies:

```bash
cd client
npm install
```

Create a `.env` file within the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_MAP_TOKEN=<your_mapbox_public_token>
```

Start the Vite development server:

```bash
npm run dev
```

The application client will now be accessible via your browser, typically at `http://localhost:5173`.
