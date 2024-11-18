# Backend Project - Local Setup
This repository contains a Node.js backend project. Follow the steps below to set up and run the application locally.

# Prerequisites
Before starting, make sure you have the following installed:
- Node.js (version 20 or higher): Download Node.js
- Yarn: Install Yarn
- Git: Install Git

# Installation and Setup
1. Clone the Repository
- Clone the repository to your local machine:
```
git clone <repository-url>
cd <repository-directory>
```
2. Install Dependencies
Run the following command to install all project dependencies:
```
yarn install
```

3. Configure the Application
Ensure all necessary environment variables (if applicable) are properly configured in a .env file. Example:
```
PORT=3000
MYSQL_USER=root
MYSQL_PASSWORD=abc123
MYSQL_HOST=localhost
MYSQL_DATABASE=mydb
MYSQL_PORT=3306
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_SECRET=secretkey
```
# Running the Application
1. Start the Development Server
To start the application in development mode:
```
yarn start
```
By default, the application will run on http://localhost:3000.

2. Access the API
Once the application is running, you can access the API at:
- http://localhost:3000

# Project Structure
```
.
├── package.json        # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── src/                # Application source code
├── .env                # Environment variables (optional)
└── README.md           # Project documentation
```

