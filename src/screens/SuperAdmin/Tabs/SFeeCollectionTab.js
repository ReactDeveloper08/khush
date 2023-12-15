import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  processColor,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {BarChart} from 'react-native-charts-wrapper';
// Components
import CustomLoader from '../../../components/CustomLoader';

// API
import {makeRequest, BASE_URL} from '../../../api/ApiInfo';

// Styles
import basicStyles from '../../../styles/BasicStyles';

// Images
import ic_fee from '../../../assets/icons/ic_fee.png';
import ic_fee_black from '../../../assets/icons/ic_fee_black.png';
import CollectionComponent from '../../../components/SuperAdmin/CollectionComponent';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const isPortrait = () => {
  const dim = Dimensions.get('screen');

  return dim.height >= dim.width;
};
export default class SFeeCollectionTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      batchList: [
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '09-Dec-2021',
          referBy: 'Nirmal (9876543210)',
        },
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '09-Dec-2021',
          referBy: 'Nirmal (9876543210)',
        },
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '09-Dec-2021',
          referBy: 'Nirmal (9876543210)',
        },
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '09-Dec-2021',
          referBy: 'Nirmal (9876543210)',
        },
        {
          id: 0,
          name: 'Deepak Dhaka',
          mobile: '9876543210',
          course: 'Photoshop',
          branch: 'Mansarover',
          enrollNo: 'DM1529',
          date: '09-Dec-2021',
          referBy: 'Nirmal (9876543210)',
        },
      ],

      branchList: [
        {
          id: 0,
          branchName: 'Vidhyadhar Nagar',
          totalCollection: '30000',
        },
        {
          id: 0,
          branchName: 'Mansarover',
          totalCollection: '30000',
        },
        {
          id: 0,
          branchName: 'C - Scheme',
          totalCollection: '30000',
        },
      ],

      legend: {
        enabled: true,
        textSize: 12,
        form: 'SQUARE',
        formSize: 12,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true,
      },
      data: {
        dataSets: [
          {
            values: [
              {y: 256550},
              {y: 251500},
              {y: 102950},
              {y: 17500},
              {y: 3000},
              {y: 38550},
              {y: 0},
              {y: 72250},
              {y: 128350},
              {y: 13000},
              {y: 19000},
              {y: 16000},
            ],
            label: 'Last Year(923,650)',
            config: {
              drawValues: false,
              colors: [processColor('yellow')],
            },
          },
          {
            values: [
              {y: 76500},
              {y: 226350},
              {y: 293349},
              {y: 149000},
              {y: 82900},
              {y: 39000},
              {y: 92550},
              {y: 47550},
              {y: 207150},
              {y: 226550},
              {y: 370700},
              {y: 108500},
            ],
            label: 'Current Year(1,920,096)',
            config: {
              drawValues: false,
              colors: [processColor('green')],
            },
          },
          {
            values: [
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
              {y: 0},
            ],
            label: 'Current Year Target(0)',
            config: {
              drawValues: false,
              colors: [processColor('red')],
            },
          },
        ],
        config: {
          barWidth: 0.2,
          group: {
            fromX: 0,
            groupSpace: 0.1,
            barSpace: 0.1,
          },
        },
      },
      xAxis: {
        valueFormatter: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Nov',
          'Dec',
        ],
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 12,
        axisMinimum: 0,
        centerAxisLabels: true,
      },

      marker: {
        enabled: true,
        markerColor: processColor('#333333'),
        textColor: processColor('white'),
        markerFontSize: 14,
      },
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
      });
    });
  }

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <CollectionComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleCollectionDetail = () => {
    this.props.navigation.navigate('SCollectionDetail');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.feeInnerContent}
          showsVerticalScrollIndicator={false}>
          <View
            style={[styles.totalPaidFeeDisplay, {backgroundColor: '#fff'}]}
            onPress={this.handleTotalCollection}>
            <TouchableOpacity
              style={styles.feeBoxContainer}
              onPress={this.handleCollectionDetail}>
              <Text style={styles.paidFeeTitle}>Total Collection</Text>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.marginLeft,
                  basicStyles.alignCenter,
                ]}>
                <Text style={styles.headTextStyle}>Today</Text>
                <View style={styles.totalPaidFeeAmount}>
                  <Image
                    style={styles.totalPaidFeeIcon}
                    source={ic_fee_black}
                    resizeMode="cover"
                  />
                  <Text style={styles.valueTextStyle}>0.00/-</Text>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.marginLeft,
                  basicStyles.alignCenter,
                ]}>
                <Text style={styles.headTextStyle}>This Week</Text>
                <View style={styles.totalPaidFeeAmount}>
                  <Image
                    style={styles.totalPaidFeeIcon}
                    source={ic_fee_black}
                    resizeMode="cover"
                  />
                  <Text style={styles.valueTextStyle}>150000/-</Text>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.marginLeft,
                  basicStyles.alignCenter,
                ]}>
                <Text style={styles.headTextStyle}>This Month</Text>
                <View style={styles.totalPaidFeeAmount}>
                  <Image
                    style={styles.totalPaidFeeIcon}
                    source={ic_fee_black}
                    resizeMode="cover"
                  />
                  <Text style={styles.valueTextStyle}>108,499/-</Text>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.marginLeft,
                  basicStyles.alignCenter,
                ]}>
                <Text style={styles.headTextStyle}>Last 3 Months</Text>
                <View style={styles.totalPaidFeeAmount}>
                  <Image
                    style={styles.totalPaidFeeIcon}
                    source={ic_fee_black}
                    resizeMode="cover"
                  />
                  <Text style={styles.valueTextStyle}>765,248/-</Text>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.marginLeft,
                  basicStyles.alignCenter,
                ]}>
                <Text style={styles.headTextStyle}>Year Total</Text>
                <View style={styles.totalPaidFeeAmount}>
                  <Image
                    style={styles.totalPaidFeeIcon}
                    source={ic_fee_black}
                    resizeMode="cover"
                  />
                  <Text style={styles.valueTextStyle}>1,920,096/-</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: wp(3.5),
              textAlign: 'center',
              color: '#666',
              fontWeight: '700',
              marginTop: wp(3),
              marginBottom: wp(1.5),
            }}>
            * Rotate Your Phone to View Graph *
          </Text>

          <View
            style={{
              // height: wp(98),
              // width: wp(98),
              marginTop: hp(1),
              transform: [{rotate: '90deg'}],
            }}>
            <BarChart
              style={{
                width: wp(120),
                height: hp(48),
              }}
              xAxis={this.state.xAxis}
              data={this.state.data}
              legend={this.state.legend}
              drawValueAboveBar={false}
              // onSelect={this.handleSelect.bind(this)}
              // onChange={event => console.log(event.nativeEvent)}
              highlights={this.state.highlights}
              marker={this.state.marker}
            />
          </View>

          {/* <View style={[basicStyles.paddingHalf]}>
            <Text style={[styles.paidFeeTitle]}>Last 5 Registration</Text>
            <FlatList
              data={this.state.batchList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
            />
          </View> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  feeInnerContent: {
    flex: 1,
    // height: hp(85),
  },
  totalPaidFeeDisplay: {
    // flex: 2,
    backgroundColor: '#ffffff',
    // justifyContent: 'center',
    paddingBottom: wp(2),
    // alignItems: 'center',
  },
  totalPaidFeeIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
  },
  feeBoxContainer: {
    // alignItems: 'center',
    padding: wp(2),
    borderBottomWidth: 0.7,
  },
  totalPaidFeeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headTextStyle: {
    flex: 1,
    fontSize: wp(3.5),
    // fontWeight: 'bold',
    color: '#333',
  },
  valueTextStyle: {
    // flex: 2,
    fontSize: wp(3.5),
    // fontWeight: 'bold',
    color: '#333',
  },
  paidFeeTitle: {
    fontSize: wp(5),
    paddingTop: hp(1),
    color: '#333',
    fontWeight: 'bold',
  },
  chart: {
    width: ScreenWidth,
    height: ScreenHeight / 2,
    // backgroundColor: 'blue',
  },
  separator: {
    height: wp(2),
  },
});
