# ✈️ Wanderlust: Your Ultimate Travel Marketplace

Wanderlust is a comprehensive platform built to connect travelers with unique stays worldwide. Whether you're looking for a cozy cabin in the woods or a luxury villa by the beach, Wanderlust provides the tools to find your next adventure or host your own space.


## System Architecture

The project is structured using the **MVC (Model-View-Controller)** pattern to enhance maintainability and scalability:

* **Models:** Defines the data structure for `Listings`, `Reviews`, and `Users` using Mongoose schemas.
* **Views:** Server-side rendered templates using EJS to display dynamic content.
* **Controllers:** Contains the core logic for handling requests, interacting with models, and rendering views.
* **Routes:** Manages URL endpoints and maps them to specific controller actions.
* **Middleware:** Handles authentication checks, authorization (ownership), and data validation before reaching the controllers.


## Key Features

* **User Authentication:** Secure signup and login functionality using Passport.js.
* **Listing Management:** Users can create, edit, and delete their own travel listings with detailed descriptions and pricing.
* **Image Uploads:** Seamless integration with Cloudinary for uploading and hosting high-quality property images.
* **Review System:** Interactive review and rating system for listings.
* **Authorization:** Middleware ensures that only listing owners can modify or delete their posts.
* **Geospatial Integration:** Includes geometry data for mapping listings (Mapbox ready).
* **Flash Messaging:** Real-time feedback for user actions like successful login or error alerts.
* **Custom Error Handling:** A centralized error-handling system for unauthorized access and invalid routes (404), providing clear feedback through a dedicated error page with a graceful fallback to the main listings.


## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Frontend:** EJS (Embedded JavaScript templates), EJS-Mate (Layouts), Bootstrap, CSS3
* **Authentication:** Passport.js with Local Strategy
* **Cloud Storage:** Cloudinary (for image uploads via Multer)
* **Security & Validation:** Joi (Schema validation), Express-Session, Connect-Flash, Cookie-Parser


## Getting Started

### Prerequisites
* Node.js (v20.17.0 recommended)
* MongoDB Atlas account or local MongoDB instance
* Cloudinary account for image storage

### Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:** Create a `.env` file in the root directory and add:
    ```env
    ATLASDB_URL=<your-mongodb-url>
    SECRET=<your-session-secret>
    CLOUD_NAME=<your-cloudinary-name>
    CLOUD_API_KEY=<your-cloudinary-key>
    CLOUD_API_SECRET=<your-cloudinary-secret>
    ```
4.  **Run the application:**
    ```bash
    node app.js
    ```
    The server will start on port `8080`.
