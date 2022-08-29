FROM golang:1.18-alpine

# Installing ffmpeg
RUN apk add ffmpeg

# Create a directory for the app
RUN mkdir /app
 
# Copy all files from the current directory to the app directory
COPY . /app
 
# Set working directory
WORKDIR /app/server

# Set prod config env variables
ENV APP_MODE=prod

RUN mkdir -p cmd/bin
# go build will build an executable file named server in the current directory
RUN go build -o ./cmd/bin ./cmd/api

# Run the server executable
CMD [ "/app/cmd/bin/api" ]