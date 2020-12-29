# Simple chat #

This is a real-time group chat communication powered by socket.io

## How it works

- Users visit the app on the hosted URL and a unique username is generated to identify th user
- Users are presented with a nice and interactive interface with a text input for typing and button to send chat messages
- Users can type in text and can also paste in image link and the image is generated and displayed in chat
- There is an option to change the default username to the user's desired username; And also options to change the time display (12h or 24h)
- Users can turn on the option to send message with ctrl/CMD + Enter

## Development Environment
Ensure you have the following softwares installed:
- [Node](https://nodejs.org)
- [Nodemon](https://github.com/remy/nodemon)
- [Git](https://www.atlassian.com/git/tutorials/install-git)

Clone the [repository](https://github.com/SimeonDominiq/simple_chat.git) and proceed with the instructions below.

### Socket.io

This chat application was written with socket.io version `3.0.4` both on the client and on the server

## Setting up the App

### Installing project dependencies

To install the dependencies, from within the application's root directory:

```sh
npm install
```

### Starting the App

This project has been setup to use nodemon to keep the application running. The README assumes that you have nodemon installed.

To start up the application, From the application's root directory run `npm start`; This will start the application on http://localhost:2021 (2021 is the pre-configured PORT). Point to this URL and you will be presented with the chat interface.

```sh
npm start
```

## Viewing the App
To load the app, visit the url below in a browser:

    http://localhost:2021

Voila... The project is up and running.

## Task checklist
- [x] Chat message box to list messages
- - [x] The user’s messages should be on the right and the other user’s messages should be on the left
- - [x] Each message should display the time it was sent
- [x] Input field where I can type and send messages
- [x] Users can send pictures via URL. When sent, this URL is rendered on the message box as an image
- [x] Next to the input field it is expected a button to send the message
- [x] Clicking on the “Settings” button on the top right corner of the page, the app should open a settings overlay/modal
- - [x] All the settings should be consumed and saved on the LocalStorage
- - [x] Change username input field
- - [x] Change clock display radio inputs
- - [x] Send messages with Ctrl/Cmd + ENTER toggle
- - [x] Have a text/link to reset all the settings back to its defaults
- [x] Display a typing icon when a user on the chat is typing