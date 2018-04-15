import * as firebase from 'firebase';

import { Message } from '../../model/message.model';

export namespace MessageQueries {
    export const create  = (db: firebase.database.Database, message: Message) => {
        db.ref('/scopes/' + message.scope).push({
            from: message.from,
            content: message.content
        });
    }
}