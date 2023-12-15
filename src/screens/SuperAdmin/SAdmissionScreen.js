import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import RegistrationInfoComponent from '../../components/SuperAdmin/RegistrationInfoComponent';
import ModalSelector from 'react-native-modal-selector';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';

export default class SAdmissionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRegistration: 0,
      registrationList: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

      isLoading: true,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchBranches();
    this.fetchRegistration();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchBranches = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getBranch', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {branch} = response;

          const branchData = branch.map(item => {
            const {id, name} = item;
            let data = {
              key: id,
              label: name,
            };

            return data;
          });

          this.setState({branchData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchRegistration = async () => {
    try {
      const {selectedBranch} = this.state;

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        branchId: selectedBranch.key,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getRegistrationList',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {studentRegister, totalRegistration} = response;

          this.setState({
            registrationList: studentRegister,
            totalRegistration,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });

          // resetting notification count
          // await this.resetNotificationCount(params);
        } else {
          const {message} = response;

          this.setState({
            status: message,
            registrationList: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
        // }
      } else {
        this.setState({
          registrationList: null,
          isLoading: false,
          isRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchRegistration();
    });
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <RegistrationInfoComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleListRefresh = () => {
    try {
      this.setState({isRefreshing: true});
      this.fetchBranches();
      this.fetchRegistration();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {
      totalRegistration,
      registrationList,
      isRefreshing,
      branchData,
      selectedBranch,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Registration" nav={this.props.navigation} />

            <View style={styles.mainContainer}>
              <Text style={styles.searchText}>Branch</Text>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  // basicStyles.marginLeft,
                  basicStyles.justifyEvenly,
                ]}>
                <ModalSelector
                  data={branchData}
                  initValue="Select Branch"
                  cancelText="Cancel"
                  animationType="fade"
                  backdropPressToClose={true}
                  onChange={this.handleBranchSelect}
                  // style={styles.pickerStyle}
                  initValueTextStyle={styles.initialTextStyle}
                  selectTextStyle={styles.selectedTextStyle}
                  optionTextStyle={styles.optionTextStyle}>
                  <View style={[styles.customPickerStyle]}>
                    <Text
                      style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                      {selectedBranch.label}
                    </Text>
                  </View>
                </ModalSelector>

                <View
                  style={[
                    basicStyles.alignCenter,
                    {
                      backgroundColor: '#00BFFF', // Deep Sky Blue color code
                      paddingHorizontal: wp(2),
                      paddingVertical: wp(0.5),
                      borderRadius: wp(1.2),
                    },
                  ]}>
                  <Text style={[basicStyles.text, {color: '#fff'}]}>
                    Total Registration
                  </Text>
                  <Text style={[basicStyles.text, {color: '#fff'}]}>
                    {totalRegistration}
                  </Text>
                </View>
              </View>

              {registrationList && registrationList.length > 0 ? (
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <Text style={styles.textStyle}>Registration List</Text>
                  <FlatList
                    data={registrationList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                </View>
              ) : (
                <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                  <Text style={basicStyles.noDataTextStyle}>
                    No Data Available...
                  </Text>
                </View>
              )}
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

  // Picker Style
  customPickerStyle: {
    width: wp(55),
    height: wp(11),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    margin: wp(2),
  },
  pickerStyle: {
    width: wp(40),
    // height: wp(12),
    margin: wp(2),
  },

  templatePickerStyle: {
    width: wp(35),
    // borderRadius: 1,
    margin: wp(2),
  },

  initialTextStyle: {
    color: '#666',
    fontSize: wp(3),
    // marginLeft: wp(2),
    marginVertical: wp(1.33),
    textAlign: 'left',
  },

  optionTextStyle: {
    color: '#111',
  },

  selectedTextStyle: {
    textAlign: 'left',
    color: '#111',
    fontSize: wp(3),
    marginLeft: wp(2),
    marginVertical: wp(1.33),
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
