#./Dockerfile

# Use the official image as a parent image.
FROM node:slim

# Set the working directory.
WORKDIR /app

# Copy the file from your host to your current location.
COPY index.js .
COPY package.json .

# Run the command inside your image filesystem.
RUN npm install

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 80

# Copy the rest of your app's source code from your host to your image filesystem.

# Run the specified command within the container.
CMD node index.js
#CMD ["pm2-runtime", "start", "index.js", "--env", "production"]
