import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../../components/CustomLoader';

import PendingFeeInfoComponent from '../../../components/SuperAdmin/PendingFeeInfoComponent';
import PickerModal from 'react-native-picker-modal-view';

// API
import {makeRequest, BASE_URL} from '../../../api/ApiInfo';

// Styles
import basicStyles from '../../../styles/BasicStyles';

export default class SFeeCollectionTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batchList: [
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '15-Dec-2021',
          pendingFee: '8000',
        },
        {
          id: 0,
          name: 'Randeep Singh',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Vidhyadhar Nagar',
          enrollNo: 'DM1529',
          date: '15-Dec-2021',
          pendingFee: '8000',
        },
        {
          id: 0,
          name: 'Govind Singh',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'C - Scheme',
          enrollNo: 'DM1529',
          date: '15-Dec-2021',
          pendingFee: '8000',
        },
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '15-Dec-2021',
          pendingFee: '8000',
        },
      ],

      branchData: [
        {
          Id: 0,
          Name: 'All Branch',
          Value: 'All Branch',
        },
        {
          Id: 1,
          Name: 'Vidhyadhar Nagar',
          Value: 'Vidhyadhar Nagar',
        },
        {
          Id: 2,
          Name: 'Mansarover',
          Value: 'Mansarover',
        },
        {
          Id: 2,
          Name: 'C - Scheme',
          Value: 'C - Scheme',
        },
      ],
      selectedBranch: {
        Id: 0,
        Name: 'All Branch',
        Value: 'All Branch',
      },

      isLoading: false,
    };
  }

  renderBranchView = (disabled, selected, showModal) => {
    const {selectedBranch} = this.state;
    const {Name} = selectedBranch;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'All Branch') {
      labelStyle.color = '#666';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleSelectedBranch = selectedBranch => {
    this.setState({selectedBranch});
    return selectedBranch;
  };

  handleSelectedBranchClose = () => {
    const {selectedBranch} = this.state;
    this.setState({selectedBranch});
  };

  renderBatchTypeView = (disabled, selected, showModal) => {
    const {selectedBatchType} = this.state;
    const {Name} = selectedBatchType;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Batch Type') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleBatchType = selectedBatchType => {
    this.setState({selectedBatchType});
    return selectedBatchType;
  };

  handleBatchTypeClose = () => {
    const {selectedBatchType} = this.state;
    this.setState({selectedBatchType});
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <PendingFeeInfoComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    // if (this.state.isLoading) {
    //   return <CustomLoader />;
    // }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.searchText}>Branch</Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              // basicStyles.marginLeft,
              basicStyles.justifyEvenly,
            ]}>
            <View style={styles.fromDateFieldContainer}>
              <PickerModal
                items={this.state.branchData}
                requireSelection={true}
                selected={this.state.selectedBranch}
                onSelected={this.handleSelectedBranch}
                onClosed={this.handleSelectedBranchClose}
                // backButtonDisabled
                showToTopButton={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={false}
                searchPlaceholderText="Search"
                renderSelectView={this.renderBranchView}
              />
            </View>
            <View
              style={[
                basicStyles.alignCenter,
                {
                  backgroundColor:
                    '#' +
                    (0x1000000 + Math.random() * 0xffffff)
                      .toString(16)
                      .substr(1, 6) +
                    55,
                  paddingHorizontal: wp(2),
                  paddingVertical: wp(0.5),
                  borderRadius: wp(1),
                },
              ]}>
              <Text style={[basicStyles.text, {color: '#111'}]}>
                Grand Total
              </Text>
              <Text style={[basicStyles.text, {color: '#111'}]}>
                {' '}
                Rs. 32000
              </Text>
            </View>
          </View>

          <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
            <Text style={styles.textStyle}>Students List</Text>
            <FlatList
              data={this.state.batchList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  separator: {
    height: wp(2),
  },
  notesListContent: {
    padding: wp(2),
    // flex: 1,
    // marginTop: wp(1),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchText: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
    marginBottom: wp(-4),
  },
  fromDateFieldContainer: {
    // flex: 1,
    height: hp(5),
    width: wp(60),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: wp(3),
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#1d99d2',
    width: wp(20),
    alignSelf: 'center',
    marginTop: hp(2),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
});
