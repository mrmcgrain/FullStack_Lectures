# Image Upload Demo (MERN Stack)

This project demonstrates how to build a fullstack MERN (MongoDB, Express, React, Node.js) application for uploading and managing image files. It is designed as an educational tool for students to learn how to:

- Upload image files from a React frontend using `express-fileupload`.
- Store image metadata in a MongoDB database using Mongoose.
- Serve and retrieve uploaded images from an Express server.
- Implement CRUD operations for posts containing images.

## Features

- **Image Upload**: Users can upload image files via the React frontend.
- **Post Management**: Users can create, view, and delete posts with associated images.
- **File Storage**: Uploaded images are stored on the server, and their paths are saved in MongoDB.
- **Responsive Design**: The frontend is styled for a clean and user-friendly experience.

## Project Structure

```
imageUpload_demo/
├── client/                # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Global styles
│   │   ├── main.jsx       # React entry point
│   └── package.json       # Client dependencies
├── server/                # Express backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded image files
│   ├── index.js           # Main server file
│   └── package.json       # Server dependencies
└── README.md              # Project documentation
```

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd imageUpload_demo
```

### 2. Set Up the Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/image-upload-demo
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Set Up the Client

1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm run dev
   ```

### 4. Access the Application

- Open your browser and navigate to `http://localhost:5173` to access the React frontend.
- The Express server runs on `http://localhost:5000`.

## API Endpoints

### Upload Routes

- `POST /api/uploads`: Upload an image file.
  - Request Body: FormData with an `image` field.
  - Response: `{ message, imagePath, filename }`

### Post Routes

- `GET /api/posts`: Retrieve all posts.
- `GET /api/posts/:id`: Retrieve a single post by ID.
- `POST /api/posts`: Create a new post.
  - Request Body: `{ title, description, imagePath, imageFilename }`
- `DELETE /api/posts/:id`: Delete a post by ID.

## Frontend Components

### `PostList`
- Displays all posts with their images and descriptions.
- Allows users to navigate to individual post details or delete posts.

### `PostForm`
- Provides a form for creating new posts with image uploads.
- Includes image preview functionality.

### `PostDetail`
- Displays detailed information about a single post, including the full image and description.
- Allows users to delete the post.

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime.
- **Express**: Web framework for building the API.
- **Mongoose**: ODM for MongoDB.
- **express-fileupload**: Middleware for handling file uploads.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Router**: For routing and navigation.
- **CSS**: For styling components.

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Create Post
![Create Post](screenshots/create-post.png)

### Post Detail
![Post Detail](screenshots/post-detail.png)

## License

This project is licensed under the MIT License. Feel free to use and modify it for educational purposes.

---

Happy coding! 🎉