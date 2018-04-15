import * as firebase from 'firebase';
import { UserScope } from '../../model/user-scope.model';

export namespace UserScopeQueries {
    export const create = (db: firebase.database.Database, userScope: UserScope) => {
        db.ref('/user-scopes').child(userScope.user).set(userScope.scopes);
    };

    export const push = (db: firebase.database.Database, user: string, scope: string) => {
        db.ref('/user-scopes').child(user).push(scope);
    };
}