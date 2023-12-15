import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import InterviewBookmarkItem from '../../components/InterviewBookmarkItem';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';

export default class InterviewBookmarksScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      bookmarks: null,
      status: null,
    };

    // fetching navigation params
    this.courseName = this.props.navigation.getParam('courseName', null);
  }

  componentDidMount() {
    this.fetchQuestion();
  }

  fetchQuestion = async () => {
    try {
      // fetching userInfo from local storage
      const userInfo = await getData(KEYS.USER_INFO);

      // fetching navigation params
      const courseId = this.props.navigation.getParam('courseId', null);

      if (userInfo && courseId) {
        const {id: userId} = userInfo;
        console.log('dqrq3r', userInfo);
        // preparing params
        const params = {
          userId,
          courseId,
        };
        console.log('sar3335', params);
        // calling api
        const response = await makeRequest(
          BASE_URL + 'interviewQuestionBookmarks',
          params,
        );

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {bookmarks} = response;

            this.setState({
              bookmarks,
              status: null,
              isLoading: false,
            });
          } else {
            const {message} = response;

            this.setState({
              status: message,
              bookmarks: null,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item, index}) => (
    <InterviewBookmarkItem item={item} index={index} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {bookmarks, status} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={this.courseName}
          navAction="back"
          nav={this.props.navigation}
        />

        {bookmarks ? (
          <FlatList
            data={bookmarks}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContentContainer}
          />
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{status}</Text>
          </View>
        )}
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
  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.6),
    textAlign: 'center',
  },
});
