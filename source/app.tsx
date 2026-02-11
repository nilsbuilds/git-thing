import React from 'react';
import {Text, useApp, useInput} from 'ink';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	const {exit} = useApp();

	useInput((input, key) => {
		if (key.escape || (key.ctrl && input === 'c')) {
			exit();
		}
	});

	return (
		<Text>
			Hello, <Text color="green">{name}</Text>
			{'\n'}
			<Text dimColor>Press ESC or Ctrl+C to exit</Text>
		</Text>
	);
}
