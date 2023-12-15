import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Components
import CustomLoader from '../../components/CustomLoader';
import showToast from '../../components/CustomToast';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import SCourseListComponent from '../../components/SuperAdmin/SCourseListComponent';

export default class AllCoursesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      courses: null,
      connectionState: true,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchCourses();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchCourses = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'all_courses');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {body} = response;
          this.coursesDetail = body;

          const courses = Object.keys(body);
          this.setState({courses, isLoading: false, isRefreshing: false});
        } else {
          this.setState({courses: [], isLoading: false, isRefreshing: false});
        }
      } else {
        this.setState({courses: [], isLoading: false, isRefreshing: false});
        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => {
    const courseList = this.coursesDetail[item];
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      80;

    return (
      <SCourseListComponent
        courseName={item}
        backgroundColor={backgroundColor}
        item={courseList}
        nav={this.props.navigation}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchCourses();
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
            <HeaderComponent title="Courses" nav={this.props.navigation} />

            <FlatList
              data={this.state.courses}
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
        {/* <FooterComponent nav={this.props.navigation} tab="Courses" /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: wp(0.6),
  },
  listContentContainer: {
    padding: wp(0.6),
  },
});
