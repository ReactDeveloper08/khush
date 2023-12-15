import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../../../styles/BasicStyles';

// Icons
import ic_close from '../../../assets/icons/ic_close.png';

class SAssignmentPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      amount: '',
      selectedFile: null,
      imageName: 'Upload File',
      comment: '',
    };

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleClose = () => {
    this.props.closePopup();
  };

  renderStudentOff = ({item}) => {
    const {id, description, total, obtained} = item;
    return (
      <View
        style={[
          styles.mainContainer,
          // basicStyles.paddingHalfHorizontal,
          basicStyles.justifyBetween,
        ]}>
        <Text style={styles.serialText}>1</Text>
        <Text style={[styles.midText2, {flex: 2, paddingLeft: wp(4)}]}>
          Ajay Maheshwari
        </Text>
        <Text style={[styles.midText2, {flex: 0, paddingLeft: wp(10)}]}>
          16-12-2021
        </Text>
        <Text
          style={[styles.midText2, {textAlign: 'right', paddingRight: wp(2)}]}>
          A+
        </Text>
      </View>
    );
  };

  renderFacultyOff = ({item}) => {
    return (
      <View
        style={[
          styles.mainContainer,
          // basicStyles.paddingHalfHorizontal,
          // basicStyles.justifyBetween,
        ]}>
        <Text style={[styles.serialText]}>1</Text>
        <Text style={[styles.midText2, {flex: 0.4}]}>Vijay Agarwal</Text>
        {/* <Text style={[styles.midText2]}>Vijay Agarwal</Text> */}
        {/* <Text style={[styles.midText2, {flex: 0, paddingLeft: wp(10)}]}>
          16-12-2021
        </Text>
        <Text
          style={[styles.midText2, {textAlign: 'right', paddingRight: wp(2)}]}>
          A+
        </Text> */}
      </View>
    );
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.marginBottomHalf,
            ]}>
            <Text style={styles.popHead}>Assignment</Text>
            <Text style={styles.popHeadSub}>15 - Dec - 2021</Text>
          </View>
          <Text style={styles.popupHeading}>Submitted</Text>
          <View
            style={[
              styles.rowStyle,
              // basicStyles.paddingHalfHorizontal,
              basicStyles.justifyBetween,
            ]}>
            <Text style={[styles.headText, {flex: 0, textAlign: 'center'}]}>
              SrNo
            </Text>
            <Text style={[styles.headText2, {flex: 1, textAlign: 'center'}]}>
              Student
            </Text>
            <Text
              style={[
                styles.headText2,
                {flex: 1, textAlign: 'center', marginLeft: wp(10)},
              ]}>
              Date
            </Text>
            <Text style={[styles.headText2, {flex: 1, textAlign: 'right'}]}>
              Grade
            </Text>
          </View>

          <FlatList
            data={[{key: 'val'}, {key: 'val'}]}
            renderItem={this.renderStudentOff}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.itemSeparator}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feePlanContent}
          />

          <Text style={[styles.popupHeading, {marginTop: wp(8)}]}>
            Not Submitted
          </Text>

          <FlatList
            data={[{key: 'val'}]}
            renderItem={this.renderFacultyOff}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.itemSeparator}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feePlanContent}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={this.handleClose}
            underlayColor="#transparent">
            <Image
              source={ic_close}
              resizeMode="cover"
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(90),
    backgroundColor: 'white',
    padding: wp(5),
  },
  popHead: {
    fontSize: wp(4.5),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  popHeadSub: {
    fontSize: wp(4),
    // fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  closeButton: {
    position: 'absolute',
    top: wp(-3),
    right: wp(-3),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: wp(3.2),
  },
  input: {
    height: hp(5.5),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    // textAlignVertical: 'top',
    fontSize: wp(3),
    marginBottom: wp(2),
  },
  textArea: {
    height: hp(10),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
    fontSize: wp(3),
    marginBottom: wp(2),
  },
  submitButton: {
    backgroundColor: '#0077a2',
    alignSelf: 'center',
    paddingVertical: wp(2),
    paddingHorizontal: wp(8),
    marginTop: wp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '700',
  },
  popupHeading: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(1.5),
    // textAlign: 'center',
  },
  closeIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headText: {
    flex: 1,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  headText2: {
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  serialText: {
    color: '#333',
    fontSize: wp(3.2),

    width: wp(5),
    textAlign: 'center',
    // fontWeight: '700',
    // marginLeft: wp(2),
  },
  midText2: {
    flex: 1,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // fontWeight: '700',
    // marginLeft: wp(2),
  },

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SAssignmentPopUp;
