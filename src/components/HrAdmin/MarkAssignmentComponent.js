/* eslint-disable react-native/no-inline-styles */
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

import ic_check from '../../assets/icons/ic_check.png';
import ic_close from '../../assets/icons/ic_close.png';
import ic_user1 from '../../assets/images/ic_user1.jpeg';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PickerModal from 'react-native-picker-modal-view';

export default class MarkAssignmentComponent extends Component {
  constructor(props) {
    super(props);

    const {item, backgroundColor, givenDate} = props;
    this.item = item;

    const {studentGrade, submitedOn} = item;

    this.state = {
      isPresent: false,
      isSubmitted: submitedOn && studentGrade ? true : false,
      isVisible: false,
      selectedDate: submitedOn ? submitedOn : null,
      selectedDateText: submitedOn ? submitedOn : 'Select Date',
      givenDate,
      gradeData: [
        {
          Id: 1,
          Name: '5',
          Value: '5',
        },
        {
          Id: 2,
          Name: '4',
          Value: '4',
        },
        {
          Id: 3,
          Name: '3',
          Value: '3',
        },
        {
          Id: 4,
          Name: '2',
          Value: '2',
        },
        {
          Id: 5,
          Name: '1',
          Value: '1',
        },
      ],

      selectedGrade: {
        Id: '',
        Name: studentGrade ? studentGrade : 'Select Grade',
        Value: studentGrade ? studentGrade : 'Select Grade',
      },

      testArray: [{studentId: 1, name: 'tester', date: 'tester'}],
    };
  }

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePickerConfirm = dateObj => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;

    this.setState(
      {
        selectedDateText: selectedDate,
        selectedDate,
        isVisible: false,
      },
      () => {
        this.handleConfirmSubmit();
      },
    );
  };
  renderBranchView = (disabled, selected, showModal) => {
    const {selectedGrade} = this.state;
    const {Value} = selectedGrade;

    const labelStyle = {
      color: '#222',
      fontSize: wp(2.8),
      textAlign: 'center',
      paddingRight: wp(2),
    };

    if (Value === 'All Branch') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={
            [
              // basicStyles.directionRow,
              // basicStyles.alignCenter,
              // basicStyles.justifyBetween,
            ]
          }>
          <Text style={labelStyle}>{Value}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleBranchSelect = selectedGrade => {
    this.setState({selectedGrade}, () => {
      this.handleConfirmSubmit();
    });
    return selectedGrade;
  };

  handleBranchSelectClose = () => {
    const {selectedGrade} = this.state;
    this.setState({selectedGrade});
  };

  handleConfirmSubmit = () => {
    const {selectedDate, selectedGrade} = this.state;
    const {studentId} = this.item;
    const {handleUpdateAssignment} = this.props;

    if (selectedDate === null || selectedGrade.Value === 'Select Grade') {
      return;
    }

    let data = {
      studentId: studentId,
      selectedDate: selectedDate,
      grade: selectedGrade.Name,
    };

    if (this.state.isSubmitted) {
      return;
    }
    this.setState({isSubmitted: true});

    handleUpdateAssignment(true, data);
  };

  handleConfirmRemove = () => {
    const {selectedDate, selectedGrade} = this.state;
    const {studentId} = this.item;
    const {handleUpdateAssignment} = this.props;

    let data = {
      studentId: studentId,
      selectedDate: selectedDate,
      garde: selectedGrade.Name,
    };

    handleUpdateAssignment(false, data);

    this.setState({
      isSubmitted: false,
      selectedDate: null,
      selectedDateText: 'Select Date',
      selectedGrade: {
        Id: '',
        Name: 'Select Grade',
        Value: 'Select Grade',
      },
    });
  };

  render() {
    const {id, studentName, studentEnroll} = this.item;
    const {isSubmitted, isVisible, selectedDateText, givenDate} = this.state;

    let minimumDate = givenDate.split('-').reverse().join('-');

    return (
      <View
        style={[
          styles.container,
          {backgroundColor: this.props.backgroundColor},
        ]}>
        <View style={styles.mainContainer}>
          <Text style={[{color: '#111', paddingLeft: wp(0), fontSize: wp(3)}]}>
            {studentEnroll}
          </Text>

          {/* </TouchableOpacity> */}
          <View style={styles.contentContainer}>
            <View style={styles.rowStyle}>
              <Text
                style={[
                  {
                    color: '#111',
                    flex: 1,
                    textTransform: 'capitalize',
                    fontSize: wp(3),
                  },
                ]}>
                {studentName}
              </Text>
              <View style={styles.fromDateFieldContainer}>
                <TouchableOpacity
                  underlayColor="transparent"
                  onPress={this.showPicker}>
                  <Text style={styles.selectedDateStyle}>
                    {selectedDateText}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isVisible}
                  mode="date"
                  minimumDate={new Date(minimumDate)}
                  maximumDate={
                    new Date(
                      new Date().setDate(new Date(minimumDate).getDate() + 7),
                    )
                  }
                  onConfirm={this.handlePickerConfirm}
                  onCancel={this.hidePicker}
                />
              </View>
              <View style={styles.fromDateFieldContainer2}>
                <PickerModal
                  items={this.state.gradeData}
                  requireSelection={true}
                  selected={this.state.selectedGrade}
                  onSelected={this.handleBranchSelect}
                  onClosed={this.handleBranchSelectClose}
                  // backButtonDisabled
                  showToTopButton={true}
                  showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={false}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderBranchView}
                />
              </View>
              {isSubmitted ? (
                <TouchableOpacity onPress={this.handleConfirmRemove}>
                  <Image
                    source={ic_close}
                    resizeMode="cover"
                    style={[basicStyles.iconColumn]}
                  />
                </TouchableOpacity>
              ) : null}
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
    // borderWidth: 1,
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
    marginLeft: wp(5),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    flex: 0.5,
    color: '#111',
    fontSize: wp(3.5),
    marginLeft: wp(5),
    // fontWeight: '700',
  },
  statusStyle: {
    // flex: 0.4,
    color: '#111',
    fontSize: wp(3.5),
    textAlign: 'right',
    // borderWidth: 1,
    // fontWeight: '700',
  },
  headText: {
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle: {
    flex: 2,
    color: '#111',
    fontSize: wp(3),

    textAlign: 'right',
  },
  fromDateFieldContainer: {
    flex: 0.6,
    // height: hp(5),
    // borderWidth: 1,
    // paddingHorizontal: wp(4),
    fontSize: wp(3),
    color: '#333',

    marginVertical: wp(3),
    justifyContent: 'center',
  },
  fromDateFieldContainer2: {
    // flex: 0.6,
    // height: hp(5),
    // borderWidth: 1,
    // paddingHorizontal: wp(4),
    fontSize: wp(3),
    color: '#333',
    width: wp(20),
    marginVertical: wp(3),
    // justifyContent: 'flex-end',
  },
  selectedDateStyle: {
    fontSize: wp(3),
  },
});
