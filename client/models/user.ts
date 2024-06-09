export interface user {
  userid: number;
  firstname: string;
  lastname: string;
  emailaddress: string;
  createddate: Date;
  deleteddate: Date;
  profileimageuri: string;
}

export interface threadmember extends user {
  addeddate: Date;
  addedby: number;
  removeddate: Date;
  removedby: number;
  nickname: string;
  lastreadmessageid: number;
}
