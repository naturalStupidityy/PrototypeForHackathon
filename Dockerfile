# Use the official nginx image as the base
FROM nginx:alpine

# Copy your static site files to nginx's public directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
