FROM node:lts-alpine3.18 as build

# Set the working directory
WORKDIR /usr/app

# Install all the dependencies
COPY ./package.json /usr/app/package.json
RUN npm install

# Add the source code to app
COPY ./src /usr/app/src

# Generate the build of the application
RUN npm run build
  
FROM nginx:stable-alpine  
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]