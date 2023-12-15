import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../../../styles/BasicStyles';

// Icons
import ic_close from '../../../assets/icons/ic_close.png';

// API
import {makeRequest, BASE_URL} from '../../../api/ApiInfo';
import showToast from '../../CustomToast';

class SAssignmentPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    };

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleClose = () => {
    this.props.closePopup();
  };

  handleTitleChange = changedText => {
    this.setState({
      title: changedText,
    });
  };

  handleMessageChange = changedText => {
    this.setState({
      description: changedText,
    });
  };

  handleAddTemplate = async () => {
    const {title, description} = this.state;

    // validations
    if (title.trim() === '') {
      Alert.alert('', 'Please enter title', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (description.trim() === '') {
      Alert.alert('', 'Please enter message', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        title,
        description,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'addTemplate', params);

      // processing response
      if (response) {
        await this.props.fetchTemplates();
        this.props.resetState();
        this.props.closePopup();
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          // message
          showToast(message);
        }
      } else {
        this.setState({isProcessing: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyCenter,
              basicStyles.marginBottomHalf,
            ]}>
            <Text style={styles.popHead}>Add Template</Text>
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              {marginTop: wp(3)},
            ]}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.title}
              onChangeText={this.handleTitleChange}
            />
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              {alignSelf: 'center', marginTop: wp(3)},
            ]}>
            <TextInput
              placeholder="Message"
              placeholderTextColor="#666"
              style={styles.loginFormTextArea}
              value={this.state.description}
              multiline={true}
              numberOfLines={6}
              onChangeText={this.handleMessageChange}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.handleAddTemplate}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(90),
    backgroundColor: 'white',
    padding: wp(5),
  },
  popHead: {
    fontSize: wp(4.5),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  loginFormTextInput: {
    height: hp(5),
    flex: 1,
    fontSize: wp(3),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
  },
  loginFormTextArea: {
    height: hp(10),
    flex: 1,
    fontSize: wp(3),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
  },
  searchButton: {
    backgroundColor: '#1d99d2',
    width: wp(20),
    alignSelf: 'center',
    marginTop: hp(2),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(3.2),
  },
});

export default SAssignmentPopUp;
