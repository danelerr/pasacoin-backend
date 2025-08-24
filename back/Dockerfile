# Use the official Node.js 22 Alpine image as a base
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3002

# Command to run the application
CMD ["npm", "run", "start:prod"]
