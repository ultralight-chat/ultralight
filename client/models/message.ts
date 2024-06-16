import { DocumentPickerAsset } from 'expo-document-picker';

import attachment from '../models/attachment';
import tag from './reactionAgg';
import { user } from './user';

export interface message {
  messageid: number;
  threadid: number;
  parentid: number;
  message: string;
  quotedmessage: message;
  reactions: {
    reactiontype: string;
    reactioncount: number;
    reacted: boolean;
  }[];
  attachments: attachment[];
  tags: tag[];
  createddate: Date;
  createdby: number;
  createdbyname: string;
  profileimageuri: string;
  modifieddate: Date;
  modifiedby: number;
  deleteddate: Date;
  deletedby: number;
  lastreadusers: user[];
  lastmessagecreatedby: number;
  lastmessagecreateddatediff: number;
}

export interface draftMessage extends Omit<message, 'attachments'> {
  updatedMessage: string;
  attachments: DocumentPickerAsset[];
}
