/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import HeaderComponent from '../../components/HeaderComponent';
import HrCollectionDetailComponent from '../../components/HrAdmin/HrCollectionDetailComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_fee_black from '../../assets/icons/ic_fee_black.png';
import CustomLoader from '../../components/CustomLoader';

export default class SFeeCollectionTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      collectionList: null,
      connectionState: true,
      today: '0',
      thisWeek: '0',
      thisMonth: '0',
      last3Months: '0',
      thisYear: '0',
      isRefreshing: false,
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
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchFeeData();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchFeeData = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params

      // calling api
      const response = await makeRequest(BASE_URL + 'fee', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {
            today,
            thisWeek,
            thisMonth,
            last3Months,
            thisYear,
            collectionList,
          } = response;

          this.setState({
            today,
            thisWeek,
            thisMonth,
            last3Months,
            thisYear,
            collectionList,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            collectionList: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <HrCollectionDetailComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchFeeData();
    });
  };
  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {today, thisWeek, thisMonth, last3Months, thisYear} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Fees Summary" nav={this.props.navigation} />
            <View style={styles.feeInnerContent}>
              <View
                style={[
                  styles.totalPaidFeeDisplay,
                  {
                    backgroundColor: '#fff',
                  },
                ]}
                onPress={this.handleTotalCollection}>
                <View style={styles.feeBoxContainer}>
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
                      <Text style={styles.valueTextStyle}>{today}/-</Text>
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
                      <Text style={styles.valueTextStyle}>{thisWeek}/-</Text>
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
                      <Text style={styles.valueTextStyle}>{thisMonth}/-</Text>
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
                      <Text style={styles.valueTextStyle}>{last3Months}/-</Text>
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
                      <Text style={styles.valueTextStyle}>{thisYear}/-</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  basicStyles.flexOne,
                  basicStyles.paddingBottom,
                  basicStyles.marginTop,
                  {backgroundColor: '#f1f1f1'},
                ]}>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.marginBottomHalf,
                    {
                      backgroundColor: '#fff',
                    },
                  ]}>
                  <Text style={styles.textStyle}>Collection List</Text>
                  {/* <Text style={styles.textStyle}>Rs. 40000</Text> */}
                </View>
                <FlatList
                  data={this.state.collectionList}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.notesListContent}
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.handleRefresh}
                />
              </View>
            </View>
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },

  feeInnerContent: {
    flex: 1,
    // height: hp(85),
  },
  totalPaidFeeDisplay: {
    // flex: 2,
    backgroundColor: '#ffffff',
    // justifyContent: 'center',
    // marginBottom: wp(4),
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
    paddingBottom: wp(4),
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
    fontSize: wp(4.5),
    paddingTop: hp(1),
    color: '#333',
    fontWeight: 'bold',
  },
  textStyle: {
    padding: wp(3.5),
    fontSize: wp(4),
    fontWeight: '700',
    color: '#222',
  },
  separator: {
    height: wp(3),
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
