const React = require('react-native')

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const { StyleSheet } = React
export default {
	containerClassView: {
		flex: 1,
	},
	ClassContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	headerBanner: {
		width: '100%',
		height: '50%',
	},
	view1: {
		marginBottom: wp(5),
		marginTop: wp('10%'),
		marginLeft: wp(3),
	},
	textHeader: {
		fontSize: wp(4),
		fontWeight: 'bold',
	},
	viewText: {
		marginLeft: wp(10),
	},
	text: {
		fontSize: wp(3.5),
		fontWeight: 'bold',
	},
}
