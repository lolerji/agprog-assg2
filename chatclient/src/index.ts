import { ChatClient, Operation } from "./app/chat-client.app";

var message: any;
var client = new ChatClient();
client.initSocket();

client.onMessage().subscribe(s => message = s);

client.send({
    operation: Operation.REQUEST_SCOPES
});

client.send({
    operation: Operation.SEND_MESSAGE,
    data: {
        from: 'lolerji',
        scope: 'global',
        content: 'hello people'
    }
});

client.send({
    operation: Operation.SEND_MESSAGE,
    data: {
        from: 'junjun',
        scope: 'global',
        content: 'hello!'
    }
});