import React, { useEffect, useRef, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Attachment = (props: { source: { uri: any; cacheKey: number } }) => {
	const {
		source: { uri, cacheKey },
	} = props;

	const isMounted = useRef(true);
	const [imgUri, setUri] = useState('');

	useEffect(() => {
		isMounted.current = true;
		loadImage(uri);
		return () => {
			isMounted.current = false;
		};
	}, []);

	const loadImage = async (uri: string) => {
		const extension = uri.substring(uri.lastIndexOf('.') + 1, uri.length) || '';

		if (/png|jpg|jpeg|bmp|gif|webp/.test(extension)) {
			//If attachment is image, check cache

			const cacheURI = `${FileSystem.cacheDirectory}${cacheKey}.${extension}`;
			let cachedImage = await findInCache(cacheURI);

			if (cachedImage.exists) {
				setUri(cacheURI);
			} else {
				let cached = await cacheImage(cacheURI);
				if (cached.cached && cached.path) {
					setUri(cached.path);
				} else {
					//if download fails
				}
			}
		} else {
			//Set image to generic file image
		}
	};

	async function findInCache(cacheURI: string) {
		try {
			let info = await FileSystem.getInfoAsync(cacheURI);
			return { ...info, err: false };
		} catch (error) {
			return {
				exists: false,
				err: true,
				msg: error,
			};
		}
	}

	const cacheImage = async (cacheURI: string) => {
		try {
			const image = FileSystem.createDownloadResumable(uri, cacheURI, {});

			const downloaded = await image.downloadAsync();
			return {
				cached: true,
				err: false,
				path: downloaded?.uri,
			};
		} catch (error) {
			return {
				cached: false,
				err: true,
				msg: error,
			};
		}
	};

	return (
		<>
			{imgUri ? (
				<Image
					source={{ uri: imgUri }}
					style={{
						flex: 1,
						width: 200,
						height: undefined,
						resizeMode: 'center',
						marginLeft: 8,
						marginRight: 8,
					}}
				/>
			) : (
				<View
					style={{
						flex: 1,
						width: 200,
						height: 50,
						marginLeft: 8,
						marginRight: 8,
					}}
				>
					<ActivityIndicator hidesWhenStopped={true} size={33} />
				</View>
			)}
		</>
	);
};
export default Attachment;
