declare module '*.svg' {
	import React from 'react';
	import { SvgProps } from 'react-native-svg';

	const content: React.FC<SvgProps>;

	declare module 'emoji-mart-native';

	export default content;
}
