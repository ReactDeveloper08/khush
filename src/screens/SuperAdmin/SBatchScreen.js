import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import CustomLoader from '../../components/CustomLoader';
import showToast from '../../components/CustomToast';
import HeaderComponent from '../../components/HeaderComponent';
import BatchInfoComponent from '../../components/SuperAdmin/BatchInfoComponent';
import PickerModal from 'react-native-picker-modal-view';
import ModalSelector from 'react-native-modal-selector';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';

export default class SFeesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      batchList: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

      batchTypeData: [
        {
          Id: '',
          Name: 'All',
          Value: '',
        },
        {
          Id: 1,
          Name: 'Running',
          Value: 'N',
        },
        {
          Id: 2,
          Name: 'Completed',
          Value: 'Y',
        },
      ],
      selectedBatchType: {
        Id: '',
        Name: 'Select Batch Type',
        Value: 'N',
      },
      batchCount: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchBatches();
    this.fetchBranches();
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

          this.setState({branchData, isLoading: false, isRefreshing: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          branchData: [],
          isLoading: false,
          isRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchBatches = async () => {
    const {selectedBranch, selectedBatchType} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      const params = {
        branch_id: selectedBranch.key,
        status: selectedBatchType.Value,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'batchList', params, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {batchList} = response;

          let batchCount = 0;

          if (batchList.length > 0) {
            batchCount = batchList.length;
          }

          this.setState({
            batchList,
            batchCount,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            batchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          batchData: [],
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchBatches();
    });
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
    this.setState({selectedBatchType}, () => {
      this.fetchBatches();
    });
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
      <BatchInfoComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // updating list
        this.componentDidMount();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {batchCount, branchData, selectedBranch} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Batch" nav={this.props.navigation} />
            <View style={styles.mainContainer}>
              <Text style={styles.searchText}>Batch</Text>

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

                <View style={styles.fromDateFieldContainer}>
                  <PickerModal
                    items={this.state.batchTypeData}
                    requireSelection={true}
                    selected={this.state.selectedBatchType}
                    onSelected={this.handleBatchType}
                    onClosed={this.handleBatchTypeClose}
                    // backButtonDisabled
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={false}
                    searchPlaceholderText="Search"
                    renderSelectView={this.renderBatchTypeView}
                  />
                </View>
              </View>

              {this.state.batchList ? (
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.justifyBetween,
                      basicStyles.alignCenter,
                    ]}>
                    <Text style={styles.textStyle}>Batches List</Text>
                    <Text style={[styles.textStyle, {fontSize: wp(4.0)}]}>
                      Total : {batchCount}
                    </Text>
                  </View>

                  <FlatList
                    data={this.state.batchList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                </View>
              ) : (
                <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                  <Text style={basicStyles.noDataTextStyle}>No Batches</Text>
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
    width: wp(40),
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
    width: wp(40),
    height: wp(11),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    margin: wp(2),
    // marginTop: wp(3),
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
