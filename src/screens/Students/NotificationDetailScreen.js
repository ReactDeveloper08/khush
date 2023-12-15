import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../../components/HeaderComponent';

export default class NotificationDetailScreen extends Component {
  constructor(props) {
    super(props);
    const item = props.navigation.getParam('item', null);

    this.state = {
      ...item,
    };
  }

  render() {
    const {title, message, date} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent
            title="Notification Detail"
            nav={this.props.navigation}
          />
        </View>
        <View style={styles.mainContainer}>
          <Text>{title}</Text>
          <View style={styles.messageContainer}>
            <Text>{message}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  mainContainer: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: '#fff',
  },
});
