import React, {PureComponent} from 'react';
import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_bookmarked_star from '../assets/icons/ic_bookmarked_star.png';
import ic_unbookmarked_star from '../assets/icons/ic_unbookmarked_star.png';

export default class InterviewQuestionItem extends PureComponent {
  constructor(props) {
    super(props);

    const {item} = this.props;
    const {isBookmarked} = item;

    this.state = {
      showAnswer: false,
      isBookmarked,
    };
  }

  handleShowAnswer = () => {
    this.setState(prevState => ({showAnswer: !prevState.showAnswer}));
  };

  handleQuestionBookmark = async () => {
    try {
      const {isBookmarked} = this.state;
      const {item, bookmarkQuestionCallback, removeBookmarkedQuestionCallback} =
        this.props;
      const {ques_id} = item;

      if (isBookmarked) {
        const response = await removeBookmarkedQuestionCallback(ques_id);

        if (response) {
          this.setState({isBookmarked: false});
        }
      } else {
        const response = await bookmarkQuestionCallback(ques_id);

        if (response) {
          this.setState({isBookmarked: true});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {item, index} = this.props;
    const {ques, ans} = item;
    const {isBookmarked, showAnswer} = this.state;

    const questionNumber = index + 1;
    const correctAnswer = item['op' + ans];

    const bookmarkImage = isBookmarked
      ? ic_bookmarked_star
      : ic_unbookmarked_star;

    return (
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text onPress={this.handleShowAnswer} style={styles.question}>
            Q{questionNumber}. {ques}
          </Text>

          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.handleQuestionBookmark}
            style={styles.bookmarkButton}>
            <Image
              source={bookmarkImage}
              resizeMode="cover"
              style={styles.bookmark}
            />
          </TouchableHighlight>
        </View>

        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answer}>{correctAnswer}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: wp(2),
  },
  questionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    color: '#000',
    fontSize: wp(3.4),
  },
  bookmarkButton: {
    marginLeft: wp(2),
  },
  bookmark: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  answerContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 2,
    marginTop: hp(2),
    padding: wp(2),
  },
  answer: {
    flex: 1,
    color: '#000',
    fontSize: wp(3.4),
  },
});
