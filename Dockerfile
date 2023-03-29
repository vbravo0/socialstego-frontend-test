FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Rust
RUN apt-get update
RUN apt-get -y install make build-essential curl 
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | bash -s -- -y

# Bundle app source
COPY . .

# Build wasm module
RUN npm run build:wasm

# Nano para git
RUN apt install nano

EXPOSE 3000

CMD [ "npm", "start" ]
