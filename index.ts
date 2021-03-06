import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// import * as serviceAccount from 'functions/serviceAccountKey.json';
// const serviceAccount = require('./functions/serviceAccountKey.json');

const fuckMyLife = {
    //serviceAccountKey.json not visible because I think it holds private information
    //the import function was a pain, that I wasn't able to get going :(
};

admin.initializeApp({
    credential: admin.credential.cert(fuckMyLife as admin.ServiceAccount),
    databaseURL: "https://imagine-6214f.firebaseio.com"
});

export const changeCommunityPostCount = functions
.region("europe-west1")
.firestore
.document('/Facts/{factID}/posts/{postID}')
.onWrite((change, context) => {

    const db = admin.firestore();
    const countRef = db.collection('Facts').doc(context.params.factID);
    
    if (!change.before.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(1)
        }).catch((error: any) => {
            console.log("We have an error: ", error);
            return null;
        });
        return null;
    } else if (change.before.exists && change.after.exists) {
        return null;
    } else if (!change.after.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(-1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    }

    return null;
});

export const changeEnglishCommunityPostCount = functions
.firestore
.document('/Data/en/topics/{topicID}/posts/{postID}')
.onWrite((change, context) => {

    const db = admin.firestore();
    const countRef = db.collection('Data').doc('en').collection('topics').doc(context.params.topicID);
    
    if (!change.before.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(1)
        }).catch((error: any) => {
            console.log("We have an error: ", error);
            return null;
        });
        return null;
    } else if (change.before.exists && change.after.exists) {
        return null;
    } else if (!change.after.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(-1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    }

    return null;
});

export const changeUserPostCount = functions
.region("europe-west1")
.firestore
.document('/Users/{userID}/posts/{postID}')
.onWrite((change, context) => {

    const db = admin.firestore();
    const countRef = db.collection('Users').doc(context.params.userID);
    
    if (!change.before.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    } else if (change.before.exists && change.after.exists) {
        return null;
    } else if (!change.after.exists) {
        countRef.update({
            postCount: admin.firestore.FieldValue.increment(-1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    }
    return null;
});

export const changePostCommentCount = functions
.region("europe-west1")
.firestore
.document('/Comments/{postID}/threads/{commentID}')
.onWrite((change, context) => {

    console.log("onUpdate called in commentCount")
    const db = admin.firestore();  
    let isEnglish = false;
    let isTopicPost = false;
    
    if (!change.before.exists) {
        const data = change.after.data();

        if (data == null) {
            console.log("no data in after")
           return;
         }

         const topicPost = data.isTopicPost;
         const language = data.language;

         if (language != null) {
            if (language == 'en') {
               isEnglish = true;
            }
        }

        if (topicPost != null) {
            if (topicPost == true) {
               isTopicPost = true;
            }
        }

        let countRef: FirebaseFirestore.DocumentReference;

        if (isTopicPost) {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('topicPosts').doc(context.params.postID);
            } else {
                countRef = db.collection('TopicPosts').doc(context.params.postID);
            }
        } else {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('posts').doc(context.params.postID);
            } else {
                countRef = db.collection('Posts').doc(context.params.postID);
            }
        }

        countRef.update({
            commentCount: admin.firestore.FieldValue.increment(1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    } else if (change.before.exists && change.after.exists) {
        return null;
    } else if (!change.after.exists) {
        const data = change.before.data()

        if (data == null) {
            console.log("no data in before")
            return;
        }

        const topicPost = data.isTopicPost;
         const language = data.language;

         if (language != null) {
            if (language == 'en') {
               isEnglish = true;
            }
        }

        if (topicPost != null) {
            if (topicPost == true) {
               isTopicPost = true;
            }
        }

        let countRef: FirebaseFirestore.DocumentReference;

        if (isTopicPost) {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('topicPosts').doc(context.params.postID);
            } else {
                countRef = db.collection('TopicPosts').doc(context.params.postID);
            }
        } else {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('posts').doc(context.params.postID);
            } else {
                countRef = db.collection('Posts').doc(context.params.postID);
            }
        }

        countRef.update({
            commentCount: admin.firestore.FieldValue.increment(-1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    }
    return null;
});

export const changePostCommentCountForChildren = functions
.region("europe-west1")
.firestore
.document('/Comments/{postID}/threads/comment/children/{child}')
.onWrite((change, context) => {

    const db = admin.firestore();
    let isTopicPost = false;
    let isEnglish = false;
    
    if (!change.before.exists) {

        const data = change.after.data()

        if (data == null) {
            console.log("no data in after")
            return;
        }

        const topicPost = data.isTopicPost;
         const language = data.language;

         if (language != null) {
            if (language == 'en') {
               isEnglish = true;
            }
        }

        if (topicPost != null) {
            if (topicPost == true) {
               isTopicPost = true;
            }
        }

        let countRef: FirebaseFirestore.DocumentReference;

        if (isTopicPost) {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('topicPosts').doc(context.params.postID);
            } else {
                countRef = db.collection('TopicPosts').doc(context.params.postID);
            }
        } else {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('posts').doc(context.params.postID);
            } else {
                countRef = db.collection('Posts').doc(context.params.postID);
            }
        }

        countRef.update({
            commentCount: admin.firestore.FieldValue.increment(1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    } else if (change.before.exists && change.after.exists) {
        return null;
    } else if (!change.after.exists) {
        const data = change.before.data()

        if (data == null) {
            console.log("no data in before")
            return;
        }

        const topicPost = data.isTopicPost;
         const language = data.language;

         if (language != null) {
            if (language == 'en') {
               isEnglish = true;
            }
        }

        if (topicPost != null) {
            if (topicPost == true) {
               isTopicPost = true;
            }
        }

        let countRef: FirebaseFirestore.DocumentReference;

        if (isTopicPost) {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('topicPosts').doc(context.params.postID);
            } else {
                countRef = db.collection('TopicPosts').doc(context.params.postID);
            }
        } else {
            if (isEnglish) {
                countRef = db.collection('Data').doc('en').collection('posts').doc(context.params.postID);
            } else {
                countRef = db.collection('Posts').doc(context.params.postID);
            }
        }
        
        countRef.update({
            commentCount: admin.firestore.FieldValue.increment(-1)
        }).catch((error: any) => {
            console.log("We have an error: ", error)
            return null;
        });
        return null;
    }
    return null;
});

export const wildcard = functions
.region("europe-west1")
.firestore
.document('/Users/{userUID}/notifications/{document}')
.onCreate(async (snapshot, context) => {
        if (snapshot && snapshot.data) {

            
        const document = snapshot.data();
        if (document == null) { 
            return;
        }
        const type = document.type;
        const userID = context.params.userUID;
        let title:string;
        let message: string;
        let isEnglish = false;

        const language = document.language;

        if (language != null) {
            if (language == "en") {
                isEnglish = true;
            }
        }

        ///get fcmToken
        admin.firestore()
            .collection("Users").doc(userID).get()
            .then(result => {
                    const token = result.data()!.fcmToken;

            if (!token) {
                console.log('There are no notification tokens to send to.');
                return null;
            } 

            switch (type) {
                case "friend": {
                    const name = document.name;

                    if (isEnglish) {
                        title = "Friend request";
                        message = `${name} want's to add you as a friend`;
                    } else {
                        title = "Freundschaftsanfrage";
                        message = `${name} möchte mit dir befreundet sein`;
                    }
                    

                    return sendMessage(title,message, token)
                    .catch(err => handle(err))
                    .then(() => console.log('this will succeed'))
                    ;
                    
                    break;
                }
                case "message": {
                     
                    title = document.name;
                    message = document.message;

                    return sendMessage(title, message, token)
                    .catch(err => handle(err))
                    .then(() => console.log('this will succeed'))
                    ;

                    break;
                }
                case "comment": {
                     
                    const name = document.name;
                    if (isEnglish) {
                        title = `${name} commented:`
                    } else {
                        title = `${name} hat kommentiert:`
                    }
                    
                    message = document.comment;

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
