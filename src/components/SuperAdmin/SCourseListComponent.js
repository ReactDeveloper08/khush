import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import SSingleCourseTileComponent from './SSingleCourseTileComponent';

export default class SCourseListComponent extends PureComponent {
  constructor(props) {
    super(props);

    const {item} = this.props;

    this.state = {
      courseList: item,
    };
  }

  renderItem = ({item}) => {
    const {courseName, nav, backgroundColor} = this.props;

    return (
      <SSingleCourseTileComponent
        item={item}
        nav={nav}
        courseName={courseName}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {backgroundColor, courseName} = this.props;
    const titleContainerStyle = [styles.titleContainer, {backgroundColor}];

    return (
      <View style={styles.container}>
        <View style={titleContainerStyle}>
          <Text style={styles.title}>{courseName}</Text>
        </View>

        <FlatList
          horizontal
          data={this.state.courseList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={this.itemSeparator}
          snapToInterval={2 * (wp(33.3) + wp(0.6))}
          snapToAlignment="center"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    width: wp(33.3),
    height: hp(18.2),
    marginRight: wp(0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#222',
    fontWeight: '700',
    // backgroundColor: '#33333320',
    textAlign: 'center',
    padding: wp(2),
  },
  separator: {
    width: wp(0.6),
  },
});
