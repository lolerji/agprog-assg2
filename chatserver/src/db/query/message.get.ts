import * as firebase from 'firebase';

import { Message } from '../../model/message.model';

export namespace MessageQueries {
    export const observe  = (db: firebase.database.Database, scope: string, onValue: (data: Message[]) => void) => {
        db.ref('/scopes').child(scope).on('value', (snapshot: firebase.database.DataSnapshot | null) => {
            if (snapshot) {
                onValue(snapshot.val());
            }
        });
    }
}