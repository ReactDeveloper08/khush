import React, {Component} from 'react';
import {View, StyleSheet, Image, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Components
import CustomLoader from '../../components/CustomLoader';
import showToast from '../../components/CustomToast';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import CourseListComponent from '../../components/Student/CourseListComponent';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';

export default class AllCoursesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      connectionState: true,
      courses: null,
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
          this.setState({courses, isLoading: false});
        } else {
          this.setState({courses: [], isLoading: false});
        }
      } else {
        this.setState({courses: [], isLoading: false});
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
      <CourseListComponent
        courseName={item}
        backgroundColor={backgroundColor}
        item={courseList}
        nav={this.props.navigation}
      />
    );
  };

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
            <HeaderComponent title="Courses" nav={this.props.navigation} />

            <FlatList
              data={this.state.courses}
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
