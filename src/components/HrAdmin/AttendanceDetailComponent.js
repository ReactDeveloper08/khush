import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';
// Styles
import basicStyles from '../../styles/BasicStyles';

import ic_user1 from '../../assets/images/ic_user1.jpeg';

export default class AttendanceDetailComponent extends Component {
  constructor(props) {
    super(props);

    const {item, backgroundColor} = props;
    this.item = item;

    this.state = {
      isAbsent: false,
    };
  }

  componentWillMount() {
    const {ispresent} = this.props.item;

    ispresent === 'N' && this.setState({isAbsent: true});
  }

  handleCheckUnCheck = async () => {
    try {
      const {studentId} = this.props.item;

      this.setState({isAbsent: !this.state.isAbsent}, () => {
        // Calling callback to mark attendance
        this.props.handleMarkAttendance(this.state.isAbsent, studentId);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {studentEnroll, studentName, ispresent} = this.item;
    const {isAbsent} = this.state;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: isAbsent ? '#cc000065' : '#9998'},
        ]}>
        <View style={styles.mainContainer}>
          <CheckBox
            style={styles.checkBoxStyle}
            value={isAbsent}
            onValueChange={() => this.handleCheckUnCheck()}
            boxType="square"
            tintColors={{true: '#333', false: '#444'}}
            onFillColor="#fff"
          />

          <View style={styles.contentContainer}>
            <View style={styles.rowStyle}>
              <Text style={[styles.headText, {color: '#111', flex: 0.43}]}>
                {studentEnroll}
              </Text>
              <Text style={styles.nameStyle}>{studentName} </Text>
              <Text style={styles.statusStyle}>
                {isAbsent ? 'Absent' : 'Present'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#e7e8e9',
    // borderRadius: wp(0.5),
    padding: wp(2),
  },
  checkBoxStyle: {
    height: hp(2),
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(1.2),
  },
  userImage: {
    width: hp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  statusText: {
    textAlign: 'right',
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
  },
  contentContainer: {
    // borderWidth: 2,
    flex: 1,
    marginLeft: wp(6),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    marginLeft: wp(4),
    textTransform: 'capitalize',
    // fontWeight: '700',
  },
  statusStyle: {
    flex: 0.4,
    color: '#111',
    fontSize: wp(3),
    // fontWeight: '700',
  },
  headText: {
    color: '#111',
    fontSize: wp(3),
    marginLeft: wp(2),
    textTransform: 'uppercase',
  },
  midText: {
    color: '#111',
    fontSize: wp(2.9),
    fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  subTitle: {
    flex: 2,
    color: '#111',
    fontSize: wp(2.9),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
