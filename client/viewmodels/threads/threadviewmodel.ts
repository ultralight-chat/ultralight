// import { observable, computed } from 'mobx';
import axios from 'axios';

import { RouteProps } from '../../App';
import thread from '../../models/thread';
import { LogBox } from 'react-native';
import { useThreadStore } from '../../components/contextproviders';

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);

const threadViewModel = (session) => {
	const threadStore = useThreadStore();

	const getThreads = async () => {
		await axios
			.get(`${process.env.dev_api_server}/threads/users/${session.user.userid}`)
			.then((response) => {
				// setError(error);
				threadStore.set(response.data);
			})
			.catch((error) => console.log(error));
	};

	const createThread = async (name: string, description: string) => {
		var formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		//formData.append("iconurl", iconurl);

		await axios({
			method: 'post',
			url: `${process.env.dev_api_server}/threads?createdby=${session.user.userid}`,
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then((response) => {
				// setError(error);
				threadStore.add(response.data);
			})
			.catch((error) => console.log(error));
	};

	const deleteThread = async (threadid: number) => {
		await axios
			.patch(
				`${process.env.dev_api_server}/threads/${threadid}&deletedby=${session.user.userid}`
			)
			.then((response) => {
				// setError(error);
				threadStore.delete(response.data);
			})
			.catch((error) => console.log(error));
	};

	return {
		getThreads,
		createThread,
		deleteThread,
	};
};

export default threadViewModel;
