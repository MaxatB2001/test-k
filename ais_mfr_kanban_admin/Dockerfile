#STAGE 1 (BUILD)
FROM node AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build


#STAGE 2
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/ais_mfr_kanban_admin /usr/share/nginx/html