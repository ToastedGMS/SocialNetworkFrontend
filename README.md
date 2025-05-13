# Social Network Frontend

Welcome to the frontend of the Social Network application, built with React. This frontend interacts with a backend API built using Express.js and Prisma, providing users with an intuitive platform to create, share, and interact with content in real-time. The app includes features like liking posts, commenting, creating posts with images, updating profiles, and managing friends. It also uses Socket.IO for live notifications and updates.

You can test the live demo of the app here: [Live Frontend Demo](socialnetworkfrontend-production.up.railway.app)
You can take a look at the backend API here: [Backend Repo](https://github.com/ToastedGMS/SocialNetworkBackend)

## Features

### User Features:
- **User Authentication**: Login with email/username and password using JWT-based authentication.
- **Profile Management**: Create, update, and view your profile.
- **Friend Management**: Send, accept, and remove friend requests.
- **Post Creation**: Create, update, and delete posts.
- **Commenting**: Add, update, and delete comments on posts.
- **Liking System**: Like and unlike posts and comments.
- **Image Upload**: Post images alongside your content.

### Real-Time Features:
- **Live Notifications**: Receive real-time notifications for friend requests, new posts, comments, and likes using Socket.IO.
- **Live Updates**: See new posts and interactions in real-time.

## Tech Stack

- **React.js**: For building the user interface.
- **TanStack Query**: For data fetching and caching.
- **Socket.IO**: For real-time notifications and live updates.
- **JWT**: For user authentication and maintaining session.
- **CSS**: For styling the frontend.
- **Vite**: For fast build and development environment.

## Getting Started

To run this frontend locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/socialnetworkfrontend.git
   cd socialnetworkfrontend
   ```
2. **Install Dependencies**
Make sure you have Node.js installed. Then, run the following command to install the required dependencies:

```bash
npm install
```
3. **Set Up Environment Variables**
Create a .env file in the root directory and populate it with the following variable:

```env
VITE_SERVER_URL="http://localhost:4000"  # Or your live backend URL
```
4. **Start the Development Server**
Run the following command to start the app locally:

```bash
npm run dev
```
The app will be running at http://localhost:5173.

## API Integration
The frontend integrates with the backend API for performing actions such as user authentication, managing posts, comments, likes, and friends. Here's a quick overview of how API interactions work:

- Authentication: The app sends the login credentials to /api/users/login and stores the JWT token for authentication.

- Profile Management: Fetch and update user profiles using the /api/users/read/:id and /api/users/update/:id endpoints.

- Posts: Create, read, update, and delete posts via the /api/posts/new, /api/posts/read/:id, /api/posts/update/:id, and /api/posts/delete/:id endpoints.

- Comments: Add, update, and delete comments on posts using the /api/comments/new, /api/comments/update/:id, and /api/comments/delete/:id endpoints.

- Likes: Like and unlike posts/comments with /api/likes/new and /api/likes/remove.

- Friends: Send and manage friend requests through /api/friends endpoints.

The app uses TanStack Query for data fetching. This helps to automatically manage caching, background data syncing, and more. Each API request is made via the query hooks provided by TanStack Query.

## Real-Time Features
Socket.IO is used to handle live updates for notifications, messages, and interactions with other users in real-time.

## Manual Integration Tests
For integration tests, you can use your browser or Postman to test the actual API routes.

## Contributing
We welcome contributions! If you’d like to improve the project or add new features, feel free to fork the repository and submit a pull request.

- Fork the repository.

- Create a new branch (git checkout -b feature/your-feature).

- Make your changes.

- Commit your changes (git commit -am 'Add new feature').

- Push to the branch (git push origin feature/your-feature).

- Create a new pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- React.js: A JavaScript library for building user interfaces.

- TanStack Query: Powerful data-fetching and caching library.

- Socket.IO: Real-time communication library.

- Vite: Fast build tool for modern web development.
