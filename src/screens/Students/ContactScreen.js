import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import ContactComponent from '../../components/Student/ContactComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: null,
      isLoading: true,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchContacts();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchContacts = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'contact_us');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {branches} = response;

          this.setState({
            contacts: branches,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => <ContactComponent item={item} />;

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.contactContainer}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Contact Us" nav={this.props.navigation} />

            <FlatList
              data={this.state.contacts}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
            />
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {/* <FooterComponent nav={this.props.navigation} /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    backgroundColor: '#e6e7e8',
  },
  separator: {
    height: wp(2),
  },
  notesListContent: {
    padding: wp(2),
  },
});
