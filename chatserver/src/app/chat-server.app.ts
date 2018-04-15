import * as express from 'express';
import * as socketio from 'socket.io';

import { Server, createServer } from 'http';
import { messageGetResolver, messageSendResolver, userScopePushResolver, getAllScopesResolver } from './chat-server.resolvers';
import { Message } from '../model/message.model';


export class ChatServer {
    private portno: number;
    private express: express.Application;
    private server: Server;
    private io: socketio.Server;
    private scopeNames: string[];
    private scopes: Pair<string, (data: Message[]) => void>[];

    constructor() {
        this.createApp();
        this.createServer();
        this.createSockets();
        this.getAllScopes();
    }

    public app(): express.Application {
        return this.express;
    }

    public port(portno: number): ChatServer {
        this.portno = portno;
        return this;
    }

    public listen(): ChatServer {
        this.server.listen(this.portno, () => {
            console.log('Server listening on %s\r\n', this.portno);
        });

        this.io.on('connect', (socket: socketio.Socket) => {
            console.log('Client connected on %s\r\n', this.portno);
            socket.on('message', (message: any) => {
                console.log('<SERVER>(received): %s\r\n', JSON.stringify(message, null, 4));
                try {
                    var operation = message['operation'];
                    switch (operation) {
                        case Operation.REQUEST_SCOPES: {
                            console.log('batching response...');
                            var resp = {
                                result: Result.SuccessResult,
                                type: ResponseType.SCOPE_LIST,
                                data: {
                                    scopes: this.scopeNames
                                }
                            };
                            console.log('<SERVER>(send): %s\r\n', JSON.stringify(resp, null, 4));
                            this.io.emit('message', resp);
                        }break;

                        case Operation.SEND_MESSAGE: {
                            var msg = new Message();
                            msg.from = message['data']['from'];
                            msg.scope = message['data']['scope'];
                            msg.content = message['data']['content'];
                            messageSendResolver(msg);
                            this.getAllScopes();
                        }break;

                        case Operation.CREATE_SCOPE: {
                            var scopeInfo = {
                                scope: message['data']['scope'],
                                users: message['data']['users']
                            };
                            for (var i = 0; i < scopeInfo.users.length; i++) {
                                userScopePushResolver(scopeInfo.users[i], scopeInfo.scope);
                            }
                        }break;

                        case Operation.JOIN_SCOPE: {
                            userScopePushResolver(message['data']['user'], message['data']['scope']);
                        }break;
                    }
                }
                catch (error) {
                    console.log('error: %s\r\n', error.message);
                    this.io.emit('message', {
                        result: Result.ErrorResult,
                        type: ResponseType.ERROR_MESSAGE,
                        data: {
                            error: error.message
                        }
                    });
                }
            });

            this.io.on('disconnect', () => {
                console.log('Client disconnected!');
            });
        });

        return this;
    }

    private createApp(): void {
        this.express = express();
    }

    private createServer(): void {
        this.server = createServer(this.express);
    }

    private createSockets(): void {
        this.io = socketio(this.server);
    }

    private getAllScopes(): void {
        getAllScopesResolver((data: string[]) => {
            if (!data) {
                return;
            }
            this.scopeNames = Array.from(Object.keys(data));
            if (!this.scopes) {
                this.scopes = [];
            }
            for (var i = 0; i < data.length; i++) {
                if (this.scopes.find(s => s.key == data[i])) {
                    continue;
                }
                else {
                    var scopeInfo = new Pair<string, (data: Message[]) => void>();
                    scopeInfo.key = data[i];
                    scopeInfo.value = (data: Message[]) => {
                        var obj ={
                            result: Result.SuccessResult,
                            data: {
                                messages: data
                            }
                        };
                        this.io.emit('message', obj);
                        console.log('<SERVER>(send): %s\r\n', JSON.stringify(obj));
                    };
                    this.scopes.push(scopeInfo);
                    if (scopeInfo.value) {
                        messageGetResolver(scopeInfo.key, scopeInfo.value);
                    }
                }
            }
        });
    }
}

class Pair<T, V> {
    key: T;
    value: V;
}

enum Operation {
    SEND_MESSAGE,
    REQUEST_SCOPES,
    CREATE_SCOPE,
    JOIN_SCOPE
}

enum Result {
    ErrorResult = -1,
    SuccessResult = 1
}

enum ResponseType {
    SCOPE_LIST,
    SCOPE_MESSAGES,
    ERROR_MESSAGE
}