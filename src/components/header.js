import React from 'react';
import {Text, View} from 'react-native';

// styles
import styles from '../styles/components/headerStyle';

const Header = props => (
  <View style={styles.headerContainer}>
    <View style={styles.textView}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  </View>
);

export default Header;
