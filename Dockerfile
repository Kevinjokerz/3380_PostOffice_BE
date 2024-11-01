# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7
FROM node:20.18.0-alpine


WORKDIR /kevin/backend

COPY package.json ./
COPY tsconfig.json ./

RUN yarn

# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=yarn.lock,target=yarn.lock \
#     --mount=type=cache,target=/root/.yarn \
#     yarn install --production=false --frozen-lockfile
COPY . .


# Run the application.

CMD ["yarn", "start"]
