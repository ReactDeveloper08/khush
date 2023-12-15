import React, {Component} from 'react';
import {
  View,
  Image,
  Linking,
  ScrollView,
  TouchableHighlight,
  AppState,
  Alert,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImageSlider from 'react-native-image-slider';
import SafeAreaView from 'react-native-safe-area-view';

// Styles
import homeStyles from '../../styles/screens/HomeStyles';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import HomeTileComponent from '../../components/HomeTileComponent';

// Icons
import ic_courses from '../../assets/icons/ic_courses.png';
import ic_login from '../../assets/icons/ic_login.png';
import ic_video from '../../assets/icons/ic_video.png';
import ic_quiz from '../../assets/icons/ic_quiz.png';
import ic_job_fiend from '../../assets/icons/ic_job_fiend.png';
import ic_team from '../../assets/icons/ic_team.png';
import ic_gallery_dr from '../../assets/icons/ic_gallery_dr.png';
import ic_contact from '../../assets/icons/ic_contact.png';
import offline from '../../assets/icons/internetConnectionState.gif';
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// network alert
import NetInfo from '@react-native-community/netinfo';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      connectionState: true,
      sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
      blogs: null,
      notificationCount: 0,
      appState: AppState.currentState,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchSliderImages();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  fetchSliderImages = async () => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'getHomeSlider',
        null,
        false,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {sliderImage} = response;
          this.setState({sliderImage, isLoading: false});
        } else {
          this.setState({
            sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
            isLoading: false,
          });
        }
      } else {
        this.setState({
          sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {sliderImage} = this.state;
    const {navigation} = this.props;

    return (
      <SafeAreaView style={homeStyles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Home" nav={navigation} />
            <View style={homeStyles.sliderContainer}>
              <ImageSlider
                loop
                // loopBothSides
                autoPlayWithInterval={4000}
                images={sliderImage}
              />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={homeStyles.contentContainer}>
              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Courses"
                  tileIcon={ic_courses}
                  title="Courses"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Free Videos"
                  tileIcon={ic_video}
                  title="Free Videos"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Gallery"
                  tileIcon={ic_gallery_dr}
                  title="Gallery"
                  nav={navigation}
                />

                <HomeTileComponent
                  route="Our Team"
                  tileIcon={ic_team}
                  title="Our Team"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Contact Us"
                  tileIcon={ic_contact}
                  title="Contact Us"
                  nav={navigation}
                />

                <HomeTileComponent
                  route="Login"
                  tileIcon={ic_login}
                  title="Login"
                  nav={navigation}
                />
              </View>

              {/* <View style={homeStyles.blogContainer}> */}
              {/* <TouchableHighlight
            underlayColor="transparent"
            onPress={this.handleBlog}
            style={homeStyles.blog}>
            <Image
              source={{uri: blogs[0].image}}
              resizeMode="cover"
              style={homeStyles.blogImage}
            />
          </TouchableHighlight> */}
              {/* </View> */}
            </ScrollView>
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
  },
  imageSliderContainer: {
    height: wp(50),
    width: wp(100),
  },
  tilesContainer: {
    flex: 1,
    padding: wp(0.5),
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  tilesRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
