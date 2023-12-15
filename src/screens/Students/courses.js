import React, {Component} from 'react';
import styles from '../../styles/screens/coursestyle';

import {Text, View, Image, ScrollView, FlatList} from 'react-native';

// Icons
import cPlus from '../assets/icons/c++.png';
import php from '../assets/icons/cakephp.png';
import cp from '../assets/icons/cprogramming.png';
import java from '../assets/icons/java.png';
import web from '../assets/icons/web.png';

// Components
import CourseTileComponent from '../../components/CourseTileComponent';

export default class Courses extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.CView}>
          <CourseTileComponent icon={cPlus} color={'blue'} />
          <CourseTileComponent icon={php} />
          <CourseTileComponent icon={cp} />
          <CourseTileComponent icon={java} />
          <CourseTileComponent icon={web} />
          <CourseTileComponent />
          <CourseTileComponent />
          <CourseTileComponent />
        </View>
      </ScrollView>
    );
  }
}
