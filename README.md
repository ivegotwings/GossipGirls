GossipGirls

NotificationApp Using MongoDB OPLOG

RUNNING THE APP- 

run mongod.exe which can be located in bin folder of your mongodb installation.
cd to /GossipGirls 
run node server.js 
open the browser of your choice 
browse to http://localhost:3000

ABOUT THE APP- 

This is a real time notification app. The server listens to changes via the opLog mongodb url via a tailable cursor. The tailable cursor remains open and can used to listen to changes in the db, similar to a real time web app. More details on that here- https://docs.mongodb.org/v3.0/core/replica-set-oplog/ https://docs.mongodb.org/v3.0/tutorial/create-tailable-cursor/


JOURNEY SO FAR-

I started with the idea of Tailable cursors in mongoDB. But discarded it as it only listens for inserts that
too only in capped collections.

I soon realised that MongoDB maintains an operation log also known as oplog. This maintains a list of changes on the database. It returns a tailable cursor, which does not close after returning the query
and waits for new operations on the database. This is what I used.

WHAT I HAVE NOT BUILT-

User subscription model. Write now all changes are broadcasted to the client, however we get the all the details of the document modified and the collection to which the change has
been made. This can be further be used to only inform users which have subscribed to changes in particular
fields or documents.

Write now I am not managing errors. If you can't see the set up working, make sure internet connectivity is there.

