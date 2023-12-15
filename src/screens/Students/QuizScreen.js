import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
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
import CourseTileComponent from '../../components/CourseTileComponent';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';

export default class QuizScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      quiz: null,
      status: null,
      connectionState: true,
      isRefreshing: false,
      role: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchQuiz();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchQuiz = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const {role, s_id} = userInfo;

      let params = null; // Declare params variable here

      if (role === 'Student') {
        params = {
          student_id: s_id,
        };
      }

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getQuizQuestionCategory',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {output} = response;

          this.setState({
            quiz: output,
            status: null,
            isLoading: false,
            isRefreshing: false,
            role: role,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            quiz: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <CourseTileComponent
      item={item}
      nav={this.props.navigation}
      course_name={item.course_name}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchQuiz();
    });
  };
  handlenav = () => {
    this.props.navigation.navigate('Marks');
  };
  handlenavigate = () => {
    this.props.navigation.navigate('SearchStudent');
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    // Assuming you have a function called getData() to get data from storage
    const {role} = this.state;

    console.log('#!#!!#!#!##', role);
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Quiz"
              nav={this.props.navigation}
              // navAction="file"
            />
            {role === 'Student' ? (
              <TouchableOpacity
                onPress={this.handlenav}
                style={{position: 'absolute', top: wp(3), right: wp(2)}}>
                <Image
                  source={require('../../assets/icons/file.png')}
                  style={{
                    aspectRatio: 1 / 1,
                    height: wp(5),
                    marginRight: wp(3),
                  }}
                />
              </TouchableOpacity>
            ) : null}

            <FlatList
              data={this.state.quiz}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
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
        {/* <FooterComponent nav={this.props.navigation} tab="Quiz" /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  separator: {
    height: wp(2),
  },
  listContentContainer: {
    padding: wp(2),
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
