import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as serviceAccount from '/Users/DonnyM/Documents/SwiftProjects/Imagine/cloudfunctions/functions/serviceAccountKey.json';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://imagine-6214f.firebaseio.com"
});


export const wildcard = functions.firestore
.document('/Users/{userUID}/notifications/{document}')
.onCreate(async (snapshot, context) => {
        if (snapshot && snapshot.data) {

            
        const document = snapshot.data()!;
        const type = document.type;
        const userID = context.params.userUID;
        let title:string;
        let message: string;

        ///get fcmToken
        admin.firestore()
            .collection("Users").doc(userID).get()
            .then(result => {
                    const token = result.data()!.fcmToken;
                
            //   const results = await Promise.all([getDeviceTokensPromise]);
            //   const tokenSnapshot = results[0];

            console.log("Das sind die results: ", token)
            if (!token) {
                console.log('There are no notification tokens to send to.');
                return null;
            } 
            //   const token = tokenSnapshot.val();
        // console.log(type);
            switch (type) {
                case "friend": {
                    console.log("send friend notification");
                    title = "Freundschaftsanfrage";
                    const name = document.name;
                    message = `${name} möchte mit dir befreundet sein`;

                    console.log(`title: ${title}, name: ${name}, token: ${token}`);
                    return sendMessage(title,message, token)
                    .catch(err => handle(err))
                    .then(() => console.log('this will succeed'))
                    ;
                    
                    break;
                }
                case "message": {
                    console.log("send message notification");
                     
                    title = document.name;
                    message = document.message;

                    console.log(`title: ${title}, name: ${name}, token: ${token}`);
                    return sendMessage(title, message, token)
                    .catch(err => handle(err))
                    .then(() => console.log('this will succeed'))
                    ;

                    break;
                }
                case "comment": {
                    console.log("send comment notification");
                     
                    const name = document.name;
                    title = `${name} hat kommentiert:`
                    message = document.comment;

                    console.log(`title: ${title}, name: ${name}, token: ${token}`);
                    return sendMessage(title,message, token)
                    .catch(err => handle(err))
                    .then(() => console.log('this will succeed'))
                    ;
                    break;
                }
                default: {
                    console.log("Could not identify the type")
                    return null;
                }
            }
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
    };
});


function sendMessage(title:string, message: string, token:string) {
    const payload = {
        notification: {
          title: title,
          body: message,
          badge:"1"
        }
      };
      
      return admin.messaging().sendToDevice(token,payload);
};

function handle(err:any) {
    console.log("We have an error", err)
    try {
        throw new RangeError();
    }
    catch (e) {
        switch (e.constructor) {
            case Error:       console.log('generic');
            return;
            case RangeError:  console.log('range');
            return;
            default:          console.log('unknown');
            return;
        };
    };
};

export const fuck = functions.firestore
.document('/Users/{userUID}')
.onCreate((snapshot, context) => {
    console.log("Neuer User");
});