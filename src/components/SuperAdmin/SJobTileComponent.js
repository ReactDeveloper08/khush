import React from 'react';
import {Text, View, Image, TouchableOpacity, Alert} from 'react-native';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// UserPreference
import {getData, KEYS} from '../../api/UserPreference';

// Styles
import findJobStyles from '../../styles/screens/FindJobStyle';

// Icons
import location1 from '../../assets/icons/location1.png';
import phone1 from '../../assets/icons/phone1.png';
import calendar from '../../assets/icons/calendar.png';

// Components
import showToast from '../../components/CustomToast';

const SJobTileComponent = props => {
  const {item, toggleProcessingLoader} = props;
  const {
    job_id,
    company,
    location,
    contactInfo,
    contactPerson,
    posting_date,
    logo,
    vacancy,
  } = item;

  const handleApplyJob = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        props.nav.navigate('Enquire');
        // Alert.alert(
        //   'Alert!',
        //   'You Need to Login/Register First.\nPress Enquiry to Continue!',
        //   [
        //     {text: 'NO', style: 'cancel'},
        //     {text: 'Enquiry', onPress: handleLogin},
        //   ],
        //   {
        //     cancelable: false,
        //   },
        // );
        return;
      }
      // starting loader
      toggleProcessingLoader(true);

      if (userInfo) {
        const {id: userId} = userInfo;

        // preparing params
        const params = {
          userId,
          jobId: job_id,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'job_application',
          params,
        );

        // processing response
        if (response) {
          // stopping loader
          toggleProcessingLoader(false);

          const {success, message} = response;

          if (success) {
            showToast(message);
          } else {
            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleLogin = () => {
  //   this.props.navigation.navigate('Enquiry');
  // };
  return (
    <View style={findJobStyles.container}>
      <View style={findJobStyles.viewTop}>
        <View style={findJobStyles.viewTop2}>
          <Text style={findJobStyles.item}>{company}</Text>

          <View style={findJobStyles.iconView}>
            <Image source={location1} style={findJobStyles.viewTop2Image} />
            <Text style={findJobStyles.iconText}>{location}</Text>
          </View>

          <View style={findJobStyles.iconView}>
            <Image source={phone1} style={findJobStyles.viewTop2Image} />
            <Text style={findJobStyles.iconText}>{contactPerson}</Text>
          </View>

          <View style={findJobStyles.iconView}>
            <Image source={calendar} style={findJobStyles.viewTop2Image} />
            <Text style={findJobStyles.iconText}>{posting_date}</Text>
          </View>
        </View>

        <View style={findJobStyles.viewTop3}>
          <Image source={{uri: logo}} style={findJobStyles.viewTop3Image} />

          {/* <TouchableOpacity
            style={findJobStyles.button}
            onPress={handleApplyJob}>
            <Text style={findJobStyles.touchText}>Apply</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <View style={findJobStyles.line} />

      <Text style={findJobStyles.requirementTitle}>Requirements</Text>
      <View style={findJobStyles.requirementContainer}>
        <Text style={findJobStyles.requirements}>{vacancy}</Text>
      </View>
    </View>
  );
};

export default SJobTileComponent;
