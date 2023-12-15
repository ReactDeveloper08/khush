import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const CustomStatusBar = ({backgroundColor, ...props}) => {
  const {top} = useSafeAreaInsets();
  console.log(
    parseInt(StatusBar.currentHeight || top),
    top,
    StatusBar.currentHeight,
  );
  return (
    <SafeAreaView
      style={{
        height: heightPercentageToDP(3),
        backgroundColor,
      }}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        animated={true}
        {...props}
      />
    </SafeAreaView>
  );
};

export default CustomStatusBar;
