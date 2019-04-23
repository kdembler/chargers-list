FROM node:9.6.1 as builder
COPY . /app
WORKDIR /app
RUN npm install --silent
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
