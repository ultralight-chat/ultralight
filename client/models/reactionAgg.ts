import user from './user';

export default interface reactionAgg {
	reactiontype: string;
	reacted: number;
	users: user[];
}
