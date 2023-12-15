import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Components
import showToast from '../../components/CustomToast';
import HeaderComponent from '../../components/HeaderComponent';
import ProcessingLoader from '../../components/ProcessingLoader';

// Images
import {TouchableOpacity} from 'react-native-gesture-handler';

//User Preference
import {getData, KEYS} from '../../api/UserPreference';

export default class CourseDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.info = props.navigation.getParam('info', null);

    this.state = {
      isProcessing: false,
    };
  }

  // componentDidMount = async () => {
  //   const {apiCall} = this.info;

  //   if (apiCall === true) {
  //     this.handleEnrollNow();
  //   }
  // };

  handleEnrollNow = () => {
    let courseItems = this.info;

    this.props.navigation.navigate('EnquireNow', {courseItems});
  };

  render() {
    const {info} = this;

    if (!info) {
      return null;
    }

    const {courseName, image, description, nameCourse} = info;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title={courseName}
          navAction="back"
          nav={this.props.navigation}
        />

        <View style={styles.courseDetailContainer}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.courseBanner}
          />

          <View style={styles.courseView}>
            <Text style={styles.courseVIewText}>{nameCourse}</Text>
          </View>

          {/* <View style={styles.enrollVIew}> */}
          {/* <Text style={styles.enrollVIewText}>
              Click Enroll Now to Register
            </Text> */}
          {/* <TouchableOpacity
            style={styles.enrollButton}
            onPress={this.handleEnrollNow}>
            <Text style={styles.enrollButtonText}>Send Enquiry</Text>
          </TouchableOpacity> */}
          {/* </View> */}

          <WebView
            originWhitelist={['*']}
            textZoom={240}
            source={{html: description}}
            style={styles.webView}
          />
        </View>

        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  courseDetailContainer: {
    flex: 1,
    marginTop: hp(0.1),
  },
  courseBanner: {
    width: '100%',
    height: wp(30),
  },
  courseView: {
    height: hp(6),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 0.5,
    // borderColor: '#1d99d2',
  },
  enrollVIew: {
    height: hp(6),
    backgroundColor: '#f1f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseVIewText: {
    flex: 1,
    paddingHorizontal: wp(2),
    color: '#1d99d2',
    textAlign: 'center',
    fontSize: wp(3.8),
    fontWeight: '700',
  },
  enrollVIewText: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  enrollButton: {
    height: hp(6),
    paddingHorizontal: wp(2),
    backgroundColor: '#1d99d2',
    justifyContent: 'center',
  },
  enrollButtonText: {
    fontSize: wp(3.6),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  courseContent: {
    padding: wp(2),
  },
  moduleContainer: {
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f2',
    marginBottom: hp(1),
  },
  moduleTitle: {
    fontSize: wp(4),
    fontWeight: '700',
  },
  moduleDetailContainer: {
    paddingLeft: wp(3),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    marginRight: wp(2),
  },
  webView: {
    marginTop: hp(2),
    margin: 8,
  },
});
