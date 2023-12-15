import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import TeamComponent from '../../components/TeamComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

export default class OurTeamScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      ourTeam: null,
      status: null,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchOurTeam();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchOurTeam = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'our_team');

      if (response.success) {
        const {output} = response;

        this.setState({
          ourTeam: output,
          status: null,
          isLoading: false,
          isRefreshing: false,
        });
      } else {
        const {message} = response;
        this.setState({
          status: message,
          ourTeam: null,
          isLoading: false,
          isRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => <TeamComponent item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchOurTeam();
    });
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Our Team" nav={this.props.navigation} />
            <FlatList
              data={this.state.ourTeam}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleRefresh}
            />
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
  listContentContainer: {
    padding: 8,
  },
  separator: {
    height: 8,
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
