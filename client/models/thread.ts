export default interface thread {
	threadid: number;
	name: string;
	description: string;
	iconurl: string;
	backgroundurl: string;
	themeid: number;
	createddate: Date;
	createdbyid: number;
	createdbyName: string;
	modifieddate: Date;
	modifiedbyid: number;
	modifiedbyname: string;
	deleteddate: Date;
	deletedbyid: number;
	deletedbyname: string;
	unreadcount: number;
}
