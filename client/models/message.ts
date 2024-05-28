import reaction from './reactionAgg';
import attachment from '../models/attachment';
import tag from './reactionAgg';
import thread from './thread';
import user from './user';
import reactionAgg from './reactionAgg';

export default interface message {
	messageid: number;
	message: string;
	quotedmessage: message;
	reactions: reactionAgg[];
	attachments: attachment[];
	tags: tag[];
	createddate: Date;
	createdbyid: number;
	createdbyname: string;
	createdbyprofileimage: string;
	modifieddate: Date;
	modifiedbyid: number;
	modifiedbyname: string;
	deleteddate: Date;
	deletedbyid: number;
	deletedbyname: string;
	threadid: number;
	parentid: number;
	lastread: user[];
	lastmessagecreatedbyid: number;
	lastmessagecreateddatediff: number;
}
