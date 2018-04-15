import * as socketio from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export class ChatClient {
    private socket: any;

    public initSocket(): void {
        this.socket = socketio('http://localhost:1337');
    }

    public send(message: any): void {
        this.socket.emit('message', message);
        console.log('<CLIENT>(send): %s\r\n', JSON.stringify(message, null, 4));
    }
    
    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('message', (data: string) => {
                console.log('<CLIENT>(received): %s\r\n', JSON.stringify(data, null, 4));
                observer.next(data);
            });
        });
    }
}

export enum Operation {
    SEND_MESSAGE,
    REQUEST_SCOPES,
    CREATE_SCOPE,
    JOIN_SCOPE
}