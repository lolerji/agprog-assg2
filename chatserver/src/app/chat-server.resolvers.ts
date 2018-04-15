import context from './chat-server.db';
import { Message } from '../model/message.model';
import { UserScope } from '../model/user-scope.model';
import * as UserScopeSet from '../db/query/user-scope.set';
import * as UserScopeGet from '../db/query/user-scope.get';
import * as MessageSet from '../db/query/message.set';
import * as MessageGet from '../db/query/message.get';
import { ScopeQueries } from '../db/query/scope.get';

export const userScopeCreateResolver = (userScope: UserScope) => {
    UserScopeSet.UserScopeQueries.create(context.db(), userScope);
}

export const userScopePushResolver = (user: string, scope: string) => {
    UserScopeSet.UserScopeQueries.push(context.db(), user, scope);
}

export const userScopeGetResolver = (onValue: (data: UserScope) => void) => {
    UserScopeGet.UserScopeQueries.observe(context.db(), onValue);
}

export const messageSendResolver = (message: Message) => {
    MessageSet.MessageQueries.create(context.db(), message);
}

export const messageGetResolver = (scope: string, onValue: (data: Message[]) => void) => {
    MessageGet.MessageQueries.observe(context.db(), scope, onValue);
}

export const getAllScopesResolver = (onValue: (data: string[]) => void) => {
    ScopeQueries.get(context.db(), onValue);
}