import { makeAutoObservable } from "mobx";
import message from "../../models/message";
import user from "../../models/user"
import reactionAgg from "../../models/reactionAgg";

const messageCache = (session) => {
    const cache = makeAutoObservable({
        messages: <message[]>[],
        set: (messages) => {
            cache.messages = cache.messages.concat(messages);
        },
        delete: (messageObj) => {
            const message = cache.messages.find(
                (m) => m.messageid === messageObj.messageid
            );
    
            message.deletedbyid = messageObj.deletedbyid
            message.deleteddate = messageObj.deleteddate;
            message.message = null;
            message.quotedmessage = null
            message.reactions = [];
            message.attachments = [];
    
            cache.messages.filter(
                (m) => m.quotedmessage?.messageid === messageObj.messageid
            ).forEach((m) => {
                m.quotedmessage.deletedbyid = messageObj.deletedbyid;
                m.quotedmessage.message = null;
            })
        },
        add: (message: message) => {
            if (message.parentid === 0) {
                message.lastmessagecreatedbyid = cache.messages[0]?.createdbyid; //Set lastmessagecreatedbyid on the new message since it's not efficient in SQL
                cache.messages = [message].concat(cache.messages);
            }
            else {
                const mindex = cache.messages.findIndex(
                    (m) => m.messageid === message.parentid
                );
                message.lastmessagecreatedbyid = cache.messages[mindex].createdbyid;
                cache.messages.splice(mindex, 0, message);
            }
        },
        update: (message) => {
            const oldMessage = cache.messages.find(
                (m) => m.messageid === message.messageid
            );
            
            oldMessage.modifiedbyid = message.modifiedbyid;
            oldMessage.modifieddate = message.modifieddate;
            oldMessage.message = message.message;
        },
        react: (reaction) => {
            const oldMessage = cache.messages.find(
                (m) => m.messageid.toString() === reaction.messageid.toString()
            );

            const currentreaction = oldMessage.reactions.find(
                (r) => r.reactiontype === reaction.reactiontype
            );

            if (!currentreaction) {
                //if no one has reacted, add the reaction with this user
                oldMessage.reactions.push(<reactionAgg>{
                    reactiontype: reaction.reactiontype,
                    reacted: reaction.createdbyid === session.user.userid ? 1 : 0,
                    users: [{userid: reaction.createdbyid, nickname: reaction.createdbyname}],
                });
                return;
            } 
            
            const userIndex = currentreaction.users.findIndex((u) => u.userid === reaction.createdbyid) 
            if (userIndex != -1) { //if user has already reacted
                if (currentreaction.users.length === 1) {
                    //if user is the only one who has reacted, delete the whole reaction
                    oldMessage.reactions.splice(
                        oldMessage.reactions.findIndex(
                            (r) => r.reactiontype === currentreaction.reactiontype
                        ),
                        1
                    );
                } else {
                    //if other users have also reacted, remove this user from the list
                    currentreaction.users.splice(
                        userIndex,
                        1
                    );
                    currentreaction.reacted = currentreaction.users.some((u) => u.userid === session.user.userid) ? 1 : 0;
                }
            } else {
                //if the reaction exists but the user hasn't reacted yet, add them
                
                currentreaction.users.push(<user>{userid: reaction.createdbyid, nickname: reaction.createdbyname});
                currentreaction.reacted = reaction.createdbyid === session.user.userid ? 1 : 0;
            }
        },
        addRead: (messageid, user) => {            
            cache.messages.find(
                (m) => m.messageid === messageid
            )?.lastread.push(user)
        },
        removeRead: (userid) => {
            const message = cache.messages.find(
                (m) => m.lastread.find((u) => u.userid === userid)
            );

            if (message) {
                const userIndex = message.lastread.findIndex((u) => u.userid === userid)

                if (userIndex != -1) {
                    message.lastread.splice(
                        userIndex,
                        1
                    );
                }
            }
        }
    });

    return cache;
}

export default messageCache;