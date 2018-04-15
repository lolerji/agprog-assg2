import * as firebase from 'firebase';

import { UserScope } from '../../model/user-scope.model';

export namespace UserScopeQueries {
    export const observe  = (db: firebase.database.Database, onValue: (data: UserScope) => void) => {
        db.ref('/user-scopes').on('value', (snapshot: firebase.database.DataSnapshot | null) => {
            if (snapshot) {
                onValue(snapshot.val());
            }
        });
    }
}