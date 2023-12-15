import React from 'react';
import {Text, TouchableHighlight} from 'react-native';

// Styles
import styles from '../styles/components/FreeVideoStyle';

const FreeVideoPlaylistComponent = props => {
  const {item, nav} = props;
  const {catname: categoryName, playlistid} = item;

  const handleYouTube = () => {
    nav.push('PlaylistVideos', {playlistId: playlistid, categoryName});
  };

  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={handleYouTube}
      style={styles.videoTab}>
      <Text style={styles.tabText}>{categoryName}</Text>
    </TouchableHighlight>
  );
};

export default FreeVideoPlaylistComponent;
