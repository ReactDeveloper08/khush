import React, {useState} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images

import ic_assignment from '../../assets/icons/ic_assignment.png';
import ic_downloading from '../../assets/icons/ic_downloading.png';
import ic_user1 from '../../assets/images/ic_user1.jpeg';

// Styles
import basicStyles from '../../styles/BasicStyles';

const SAllAssignmentComponent = props => {
  const {item, backgroundColor} = props;

  const {
    id,
    title,
    description,
    submitDate,
    studentId,
    givenDate,
    submittedOn,
    grade,
    document,
  } = item;

  const handleDownload = () => {
    try {
      Linking.openURL(document);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleViewDocument = () => {
    const ext = document.split(/[#?]/)[0].split('.').pop().trim();

    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp') {
      props.nav.push('AssignmentViewer', {info: document});
    } else {
      handleDownload();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderRadius: wp(2),
          marginBottom: wp(-2),
        },
      ]}>
      {/* <Text style={[styles.dateStyle]}>{givenDate}</Text> */}
      <View style={styles.contentContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.nameStyle}>
              {title}{' '}
              <Text
                style={{color: '#111', fontSize: wp(2.6), fontWeight: '600'}}>
                ({givenDate})
              </Text>
            </Text>
          </View>
          <View>
            {document ? (
              <TouchableOpacity onPress={handleDownload}>
                <Image
                  source={require('../../assets/icons/download.png')}
                  style={styles.dIconStyle}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {/* <View style={styles.rowStyle}>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={grade}
            fullStar={ic_star}
            halfStar={ic_half_star}
            emptyStar={no_star}
            starSize={13}
            starStyle={styles.stars}
          />
        </View> */}
        <View>
          <Text style={[styles.subTitle]}>{description}</Text>
        </View>
        {submittedOn && submittedOn !== 'Not sumitted' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.bottomTextStyle}>
              Submitted On : {submittedOn}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: wp(3),
              fontWeight: '700',
              color: '#000',
              textTransform: 'capitalize',
              marginTop: wp(2),
            }}>
            Not Submitted
          </Text>
        )}
      </View>

      {/* {document ? (
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={handleViewDocument}>
          <Image source={{uri: document}} style={styles.imageStyle} />

          <View style={styles.rowStyle2}>
          <TouchableOpacity onPress={handleDownload}>
            <Image source={ic_downloading} style={styles.dIconStyle} />
          </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : null} */}
    </View>
  );
};

export default SAllAssignmentComponent;

const styles = StyleSheet.create({
  // container: {
  //   // backgroundColor: '#e7e8e9',
  //   // borderRadius: wp(2),
  //   // padding: wp(2),
  // },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(1.2),
  },
  userImage: {
    width: hp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  statusText: {
    textAlign: 'right',
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
  },
  imageStyle: {
    width: wp(82),
    height: wp(45),
  },
  dIconStyle: {
    height: hp(3),
    aspectRatio: 1 / 1,
    backgroundColor: '#fff',
    borderRadius: wp(2),
  },
  bottomTextStyle: {
    fontSize: wp(3),
    fontWeight: '700',
    color: '#000',
    textTransform: 'capitalize',
    marginTop: wp(2),
  },
  contentContainer: {
    // backgroundColor: '#e7e8e9',
    flex: 1,
    // marginHorizontal: wp(2),
    width: wp(92),
    margin: wp(2),
    padding: wp(1.5),
  },
  rowStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: -5,
    top: -3,
  },
  rowStyle: {
    marginTop: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(3.2),
    fontWeight: '600',
  },
  headText: {
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#111',
    fontSize: wp(3.2),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  dateStyle: {
    flex: 2,
    color: '#777',
    fontWeight: '900',
    fontSize: wp(3.2),
    textAlign: 'center',
  },
  subTitle: {
    // flex: 2,
    color: '#111',
    fontSize: wp(3.2),
    marginTop: wp(2),

    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonStyle: {
    backgroundColor: '#333',
    padding: wp(1),
    borderRadius: wp(5),
    marginLeft: wp(4),

    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  bellIcon: {
    width: wp(5.4),
    aspectRatio: 1 / 1,
  },
  audioContainer: {
    // position: 'absolute',
    // right: 0,
    marginLeft: wp(1),
  },
  audioIcon: {
    height: hp(3.2),
    aspectRatio: 1 / 1,
  },
  title: {
    color: '#333',
    fontSize: wp(3.2),

    marginLeft: wp(2),
    flex: 1,
  },
  notificationBody: {
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    paddingBottom: hp(2),
    flexDirection: 'row',
  },
  dateBody: {
    paddingBottom: hp(0.8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    color: '#5a5a5a',
    fontSize: wp(3.2),
    textAlign: 'justify',
  },
  date: {
    color: '#a6a6a6',
    fontSize: wp(3.2),
    marginTop: wp(2),
  },
});

// import React, {useState} from 'react';
// import {TouchableOpacity} from 'react-native';
// import {View, Text} from 'react-native';

// const NotificationListComponent = props => {
//   let [count, setCount] = useState(0);

//   const handleCount = () => {
//     setCount(++count);
//   };

//   return (
//     <View>
//       <Text>{count}</Text>

//       <TouchableOpacity onPress={handleCount}>
//         <Text>Increment</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default NotificationListComponent;
