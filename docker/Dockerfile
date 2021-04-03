# Builder
FROM node:14.11.0 as builder
WORKDIR /opt/app
COPY package.json package-lock.json /opt/app/
RUN npm install
COPY src /opt/app/src

# Runner
FROM node:14.11.0
WORKDIR /opt/app
COPY --from=builder /opt/app /opt/app
CMD ["node", "src/index.js"]
