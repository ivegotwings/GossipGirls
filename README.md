# GossipGirls
NotificationApp Using MongoDB OPLOG

RUNNING THE APP-
cd to /GossipGirls
run node server.js

ABOUT THE APP-
This is a real time notification app. The server listens to changes via the opLog mongodb url via a tailable cursor. The tailable
cursor remains open and can used to listen to changes in the db, similar to a real time web app.
More details on that here- 
https://docs.mongodb.org/v3.0/core/replica-set-oplog/
https://docs.mongodb.org/v3.0/tutorial/create-tailable-cursor/
