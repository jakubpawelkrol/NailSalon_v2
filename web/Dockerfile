# Angular Frontend Dockerfile
FROM node:22-alpine as build

WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Debug: Show what was built
RUN echo "=== Build output ===" && ls -la dist/
RUN echo "=== Contents of nail-salon-scheduler ===" && ls -la dist/nail-salon-scheduler/

# Production stage
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from the correct subdirectory
COPY --from=build /app/dist/nail-salon-scheduler/browser /usr/share/nginx/html/

# Debug: Show what was copied
RUN echo "=== Nginx html directory after copy ===" && ls -la /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]