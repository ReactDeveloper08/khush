import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import Header from '../../components/header';
import styles from '../../styles/screens/topicstyle';

export default class TopicScreen extends Component {
  renderSeparator = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="SELECT TOPIC" />

        <FlatList
          data={[{key: 'Android'}, {key: 'iOS'}]}
          renderItem={({item}) => (
            <View style={styles.flat}>
              <Text style={styles.item}>{item.key}</Text>
            </View>
          )}
          // ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
