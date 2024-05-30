import React, { useCallback, useContext, useMemo } from 'react';
import {
	Image,
	ListRenderItem,
	FlatList,
	View,
	Text,
	Pressable,
	LogBox,
	StyleSheet,
} from 'react-native';

import Autolink from 'react-native-autolink';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer } from 'mobx-react-lite';
import moment from 'moment';
import he from 'he';

import { RouteProps } from '../../App';

import Attachment from './attachment';

import vm from '../../viewmodels/messages/messageviewmodel';

import message from '../../models/message';

type routeType = NativeStackScreenProps<RouteProps, 'Messages'>;

const Message: ListRenderItem<message> = ({ item }) => {
	const route = useRoute<routeType['route']>();
	const navigation = useNavigation<routeType['navigation']>();

	const { thread } = route.params;

	const { react } = vm(thread);

	const messageItem = item; //used to distinguish between nested items/flatlists

	return (
		<Observer>
			{() => (
				<View
					style={[
						{
							flexGrow: 1,
							flexDirection: 'row',
							marginBottom: 3,
						},
						item.parentid === 0 ? messageStyle.Parent : messageStyle.Child,
					]}
				>
					{item.lastmessagecreatedbyid != item.createdbyid ? (
						<Image
							style={messageStyle.ProfileImageStandard}
							resizeMode='cover'
							source={{
								uri: item.createdbyprofileimage
									? item.createdbyprofileimage
									: 'https://i.imgur.com/FwPobTp.png',
							}}
						/>
					) : (
						<View style={{ width: 47 }}></View>
					)}
					<View style={{ flex: 1, flexDirection: 'column' }}>
						{item.quotedmessage ? (
							<View style={{ marginBottom: 1 }}>
								{item.lastmessagecreatedbyid != item.createdbyid ? (
									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											marginBottom: 1,
											marginLeft: 10,
										}}
									>
										<Text
											style={[
												{
													color: 'white',
													fontSize: 12,
													fontWeight: 'bold',
												},
											]}
										>
											{`${
												item.quotedmessage.createdbyid === user.userid
													? 'You'
													: item.quotedmessage.createdbyname
											} replied to ${
												item.quotedmessage.createdbyid == user.userid
													? 'you'
													: item.createdbyname
											}`}
										</Text>

										<Text
											style={{ color: 'white', fontSize: 12, paddingLeft: 4 }}
										>
											{moment(item.createddate).format('h:mm a')}
										</Text>
									</View>
								) : null}
								<Text
									style={[
										messageStyle.QuoteText,
										item.quotedmessage.deletedbyid != null
											? messageStyle.Deleted
											: { color: 'white' },
									]}
								>
									{item.quotedmessage.deletedbyid != null
										? 'Deleted'
										: item.quotedmessage.message
										? he.decode(item.quotedmessage.message)
										: ''}
								</Text>
							</View>
						) : (
							<>
								{item.lastmessagecreatedbyid != item.createdbyid ? (
									<View
										style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}
									>
										<Text
											style={{
												color: 'white',
												fontSize: 12,
												fontWeight: 'bold',
											}}
										>
											{item.createdbyname}
										</Text>
										<Text
											style={{ color: 'white', fontSize: 12, paddingLeft: 4 }}
										>
											{moment(item.createddate).format('h:mm a')}
										</Text>
									</View>
								) : null}
							</>
						)}
						<Autolink //Turns URLs in text into hyperlinks. TODO: Replace this functionality
							style={[
								messageStyle.Message,
								{
									backgroundColor:
										item.createdbyid === user.userid ? '#457995' : '#374151',
								},
							]}
							stripTrailingSlash={false}
							stripPrefix={false}
							text={
								item.deletedbyid != null
									? 'Deleted'
									: item.message
									? he.decode(item.message)
									: ''
							}
						></Autolink>

						{item.attachments.length > 0 ? (
							<FlatList
								style={{ height: 300, flex: 1, width: '100%' }}
								scrollEnabled={true}
								horizontal={true}
								data={item.attachments}
								keyExtractor={(item) => item.attachmentid.toString()}
								renderItem={({ item }) => (
									<Attachment
										source={{
											uri: item.attachmentid,
											cacheKey: item.attachmentid,
										}}
									></Attachment>
								)}
							></FlatList>
						) : null}
						{item.reactions.length > 0 ? (
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									height: 28,
									marginVertical: 3,
									marginHorizontal: 5,
								}}
							>
								{item.reactions.length > 0 ? (
									<FlatList
										style={{
											flex: 1,
											maxWidth: '90%',
										}}
										scrollEnabled={false}
										horizontal={true}
										data={item.reactions}
										keyExtractor={(item) => item.reactiontype}
										renderItem={({ item }) => (
											<Observer>
												{() => (
													<Pressable
														style={[
															{
																paddingHorizontal: 6,
																marginRight: 4,
																flexDirection: 'row',
																alignItems: 'center',
																borderRadius: 10,
															},
															item.reacted
																? messageStyle.Reacted
																: messageStyle.NotReacted,
														]}
														onPress={() => {
															react(messageItem, item.reactiontype);
														}}
														onLongPress={() => {
															navigation.navigate('ReactionUsers', {
																reaction: item,
															});
														}}
													>
														<Text style={{ fontSize: 16 }}>
															{item.reactiontype}
														</Text>
														<Text
															style={{
																paddingLeft: 3,
																fontSize: 14,
																color: 'white',
															}}
														>
															{item.users.length}
														</Text>
													</Pressable>
												)}
											</Observer>
										)}
									></FlatList>
								) : null}
							</View>
						) : null}
						{item.lastread.every((lr) =>
							[user.userid, item.createdbyid].includes(lr.userid)
						) ? null : (
							<Pressable
								style={{
									height: 20,
								}}
								onPress={null}
							>
								<Observer>
									{() => (
										<FlatList
											style={{
												flex: 1,
												height: 20,
												marginTop: -20,
												marginRight: 5,
											}}
											scrollEnabled={false}
											horizontal={true}
											inverted={true}
											data={item.lastread}
											keyExtractor={(item) => item.userid.toString()}
											renderItem={({ item }) => (
												<>
													{item.userid != messageItem.createdbyid &&
													item.userid != user.userid ? (
														<Image
															style={messageStyle.ProfileImageSmall}
															source={{
																uri: item.profileimage,
															}}
														/>
													) : null}
												</>
											)}
										></FlatList>
									)}
								</Observer>
							</Pressable>
						)}
					</View>
				</View>
			)}
		</Observer>
	);
};

const messageStyle = StyleSheet.create({
	Message: {
		alignSelf: 'flex-start',
		flexWrap: 'wrap',
		fontSize: 14,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	Parent: {
		paddingLeft: 5,
	},
	Child: {
		marginLeft: 53,
		paddingLeft: 10,
		borderLeftColor: '#80ffff',
		borderLeftWidth: 0.5,
	},
	ParentQuote: {
		paddingLeft: 5,
		marginLeft: 48,
		marginRight: 5,
	},
	ChildQuote: {
		marginLeft: 101,
		marginRight: 5,
		paddingLeft: 10,
	},
	QuoteText: {
		backgroundColor: '#3F3E49',
		alignSelf: 'flex-start',
		flexWrap: 'wrap',
		opacity: 0.5,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
	},
	Deleted: {
		color: 'red',
		fontWeight: 'bold',
	},
	Reacted: {
		borderColor: '#363636',
		backgroundColor: '#457995',
	},
	NotReacted: {
		backgroundColor: '#374151',
	},
	DateHeader: {
		color: 'white',
		fontSize: 14,
		fontWeight: 'bold',
		alignSelf: 'center',
		backgroundColor: '#3F3E49',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	ProfileImageStandard: {
		height: 35,
		width: 35,
		marginHorizontal: 6,
		marginTop: 6,
		borderRadius: 40,
		overflow: 'hidden',
	},
	ProfileImageSmall: {
		height: 18,
		width: 18,
		marginHorizontal: 1,
		borderRadius: 10,
		overflow: 'hidden',
		resizeMode: 'cover',
		alignSelf: 'center',
	},
});

export default Message;
