import * as firebase from 'firebase';

export namespace ScopeQueries {
    export const get = (db: firebase.database.Database, onValue: (scopes: string[]) => void) => {
        db.ref('/scopes').on('value', (snapshot: firebase.database.DataSnapshot | null) => {
            if (snapshot) {
                onValue(snapshot.val());
            }
        });
    } 
}