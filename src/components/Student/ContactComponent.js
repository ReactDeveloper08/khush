import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';

// Styles
import contactStyle from '../../styles/components/ContactStyle';

// Images
import phone from '../../assets/icons/phone.png';
import location from '../../assets/icons/location.png';

const ContactComponent = props => {
  const {item} = props;

  const handleLocation = async () => {
    try {
      const {name, Lat: latitude, Long: longitude} = item;

      const label = 'DAAC, ' + name;

      const url = Platform.select({
        ios:
          'maps:' +
          parseInt(latitude) +
          ',' +
          parseInt(longitude) +
          '?q=' +
          label,
        android:
          'geo:' +
          parseInt(latitude) +
          ',' +
          parseInt(longitude) +
          '?q=' +
          label,
      });

      Linking.openURL(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleContact = async () => {
    try {
      const {phone: phoneStr} = item;
      const phoneNumbers = phoneStr.split(',');
      const [firstPhoneNumber] = phoneNumbers;

      let url = '';

      if (Platform.OS === 'android') {
        url = 'tel:${' + firstPhoneNumber + '}';
      } else if (Platform.OS === 'ios') {
        url = 'telprompt:${' + firstPhoneNumber + '}';
      }

      Linking.openURL(url);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={contactStyle.container}>
      <View style={contactStyle.flat}>
        {/* <View style={contactStyle.nearestBranchIndicator}>
          <Text style={contactStyle.nearestBranchIndicatorText}>
            {props.item.near}
          </Text>
        </View> */}

        <View style={contactStyle.contactInfo}>
          <View style={contactStyle.view}>
            <Text style={contactStyle.location}>{props.item.name}</Text>
          </View>

          <View style={contactStyle.view}>
            <Text style={contactStyle.address}>{props.item.address}</Text>
          </View>

          <View style={contactStyle.view}>
            <Text style={contactStyle.contactNo}>{props.item.phone}</Text>
          </View>
        </View>

        <View style={contactStyle.contactButtons}>
          <TouchableOpacity
            style={contactStyle.roundViewL}
            onPress={handleLocation}>
            <Image source={location} style={contactStyle.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[contactStyle.roundViewL, contactStyle.roundViewP]}
            onPress={handleContact}>
            <Image source={phone} style={contactStyle.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ContactComponent;
