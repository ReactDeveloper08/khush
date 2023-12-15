const React = require('react-native')

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const { StyleSheet } = React

export default {
	container: {
		flex: 1,
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
		fontWeight: 'bold',
	},
	flat: {
		backgroundColor: 'white',
		borderRadius: wp(4),
		marginTop: wp(2),
		marginLeft: wp(2),
		marginRight: wp(2),
		borderWidth: wp(0.1),
	},
}
