FROM node:20-slim

WORKDIR /app

# sqlite3 needs these to build its native binding
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Force sqlite3 to compile from source instead of using a possibly-incompatible prebuilt binary
ENV npm_config_build_from_source=true

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]