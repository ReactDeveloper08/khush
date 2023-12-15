import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import InterviewQuestionItem from '../../components/InterviewQuestionItem';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
export default class InterviewQuestionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      questions: null,
      showProcessingLoader: false,
      connectionState: true,
    };

    // fetching navigation params
    this.courseName = this.props.navigation.getParam('courseName', null);
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchQuestion();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchQuestion = async () => {
    try {
      // fetching userInfo from local storage
      const userInfo = await getData(KEYS.USER_INFO);

      // fetching navigation params
      const courseId = this.props.navigation.getParam('courseId', null);

      if (userInfo && courseId) {
        const {id} = userInfo;

        // preparing params
        const params = {
          userId: id,
          course_id: courseId,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'fetch_interview_question',
          params,
        );

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {output} = response;

            this.setState({
              questions: output,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  bookmarkQuestionCallback = async questionId => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // fetching userInfo from local storage
      const userInfo = await getData(KEYS.USER_INFO);

      // fetching navigation params
      const courseId = this.props.navigation.getParam('courseId', null);

      if (userInfo && courseId) {
        const {id: userId} = userInfo;

        // preparing params
        const params = {
          userId,
          courseId,
          questionId,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'bookmarkInterviewQuestion',
          params,
        );
        // console.log('4444', response);
        // processing response
        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success} = response;

          if (success) {
            return true;
          }

          return false;
        }

        return false;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  removeBookmarkedQuestionCallback = async questionId => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // fetching userInfo from local storage
      const userInfo = await getData(KEYS.USER_INFO);

      // fetching navigation params
      const courseId = this.props.navigation.getParam('courseId', null);

      if (userInfo && courseId) {
        const {id: userId} = userInfo;

        // preparing params
        const params = {
          userId,
          courseId,
          questionId,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'removeBookmarkedInterviewQuestion',
          params,
        );

        // processing response
        if (response) {
          // stopping loader
          this.setState({showProcessingLoader: false});

          const {success} = response;

          if (success) {
            return true;
          }

          return false;
        }

        return false;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  renderItem = ({item, index}) => (
    <InterviewQuestionItem
      item={item}
      index={index}
      bookmarkQuestionCallback={this.bookmarkQuestionCallback}
      removeBookmarkedQuestionCallback={this.removeBookmarkedQuestionCallback}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title={this.courseName}
              navAction="back"
              nav={this.props.navigation}
            />

            <FlatList
              data={this.state.questions}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContentContainer}
            />
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {this.state.showProcessingLoader && <ProcessingLoader />}
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
