import reaction from './reactionAgg';
import attachment from '../models/attachment';
import tag from './reactionAgg';
import thread from './thread';
import user from './user';
import reactionAgg from './reactionAgg';

export default interface message {
  messageid: number;
  threadid: number;
  parentid: number;
  message: string;
  reactions: reactionAgg[];
  attachments: attachment[];
  tags: tag[];
  createddate: Date;
  createdby: number;
  modifieddate: Date;
  modifiedby: number;
  deleteddate: Date;
  deletedby: number;
  lastmessagecreatedbyid: number;
  lastmessagecreateddatediff: number;
  quotedmessage: message;
}
