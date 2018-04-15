import { ChatServer } from "./app/chat-server.app";

var app = new ChatServer().port(1337).listen().app();
export { app };