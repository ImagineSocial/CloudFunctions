# CloudFunctions

Our cloud functions provide a small relief for the app and ensure that the database does not become too insecure.

So far we have already achieved the following: 
- CommentCount is a value that is in every post object and is incremented when a comment is added to the database.
- PostCount is a value found in User and Topic objects and is increased with each added post.
- Messages in the notification collection of users are converted to a push message if a notification token is present, also depending on the type of message, e.g. a comment or a friend request. (Upvotes are ignored)
