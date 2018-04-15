import * as firebase from 'firebase';

export class FirebaseContext {
    private fbApp: firebase.app.App;

    private constructor(config: any) {
        this.fbApp = firebase.initializeApp(config);
    }

    public static create(config: any): FirebaseContext {
        return new FirebaseContext(config);
    }

    public db(): firebase.database.Database {
        return this.fbApp.database();
    }

    public app(): firebase.app.App {
        return this.fbApp;
    }
}