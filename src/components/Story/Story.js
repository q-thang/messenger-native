import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Animated,
  StatusBar,
  Button,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Video } from "expo-av";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
const screenRatio = height / width;

const Story = ({ navigation, route }) => {
  // THE CONTENT
  const { user, image, contentStory } = route.params;
  const story = useSelector((state) => state.story.stories);
  const [content, setContent] = useState(contentStory);
  console.log(content);
  // i use modal for opening the instagram stories
  const [modalVisible, setModalVisible] = useState(true);
  // for get the duration
  const [end, setEnd] = useState(0);
  // current is for get the current content is now playing
  const [current, setCurrent] = useState(0);
  // if load true then start the animation of the bars at the top
  const [load, setLoad] = useState(false);
  // progress is the animation value of the bars content playing the current state
  const progress = useRef(new Animated.Value(0)).current;

  //  I WAS THINKING TO GET THE VIDEO THUMBNAIL BEFORE THE VIDEO LOADS UP

  // const [thumbnail, setThumbnail] = useState('');
  // useEffect(() => {
  // 	generateThumbnail();
  // }, []);
  // generateThumbnail = async () => {
  // 	for (let i = 0; i < content.length; i++) {
  // 		if (content[i].type == 'video') {
  // 			try {
  // 				const { uri } = await VideoThumbnails.getThumbnailAsync(
  // 					content[i].content,
  // 					{
  // 						time: 0,
  // 					}
  // 				);
  // 				console.log(i + ' ' + content[i].content);
  // 				console.log(i + ' ' + uri);
  // 				let story = [...content];
  // 				content[i].thumbnail = uri;
  // 				setContent(story);
  // 			} catch (e) {
  // 				console.log(i + ' ' + e);
  // 			}
  // 		}
  // 	}
  // };

  // start() is for starting the animation bars at the top
  function start(n) {
    // checking if the content type is video or not
    if (content[current].type === "video") {
      // type video
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
        }).start(({ finished }) => {
          if (finished) {
            next();
          }
        });
      }
    } else {
      // type image
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
      }).start(({ finished }) => {
        if (finished) {
          next();
        }
      });
    }
  }

  // handle playing the animation
  function play() {
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function next() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      let story = [...content];
      story[current].finish = 1;
      setContent(story);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      close();
      console.log(story);
      const nextStory = story.findIndex((e) => e.user === user);
      const nextUser = story[nextStory + 1];
      console.log(nextUser);
      navigation.navigate("Story", {
        user: nextUser.user,
        image: nextUser.image,
        contentStory: nextUser.contentStory,
      });
    }
  }

  // previous() is for changing the content of the current content to -1
  function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let story = [...content];
      story[current].finish = 0;
      setContent(story);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      close();
      const previousStory = story.findIndex((e) => e.user === user);
      const previousUser = story[previousStory - 1];
      console.log(previousUser);
      navigation.navigate("Story", {
        user: previousUser.user,
        image: previousUser.image,
        contentStory: previousUser.contentStory,
      });
    }
  }

  // closing the modal set the animation progress to 0
  function close() {
    progress.setValue(0);
    setLoad(false);
    setModalVisible(false);
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      {/* MODAL */}
      <Modal animationType="fade" transparent={false} visible={modalVisible}>
        <View style={styles.containerModal}>
          <View style={styles.backgroundContainer}>
            {/* check the content type is video or an image */}
            {content[current].type === "video" ? (
              <Video
                source={{
                  uri: content[current].content,
                }}
                rate={1.0}
                volume={1.0}
                resizeMode="cover"
                shouldPlay={true}
                positionMillis={0}
                // I WAS THINKING TO GET THE VIDEO THUMBNAIL BEFORE THE VIDEO LOADS UP
                // posterSource={{
                // 	uri: content[current].thumbnail,
                // }}
                // posterStyle={{
                // 	width: width,
                // 	height: height,
                // }}
                // usePoster
                onReadyForDisplay={play()}
                onPlaybackStatusUpdate={(AVPlaybackStatus) => {
                  setLoad(AVPlaybackStatus.isLoaded);
                  setEnd(AVPlaybackStatus.durationMillis);
                }}
                style={{ height: height, width: width }}
              />
            ) : (
              <Image
                onLoadEnd={() => {
                  progress.setValue(0);
                  play();
                }}
                source={{
                  uri: content[current].content,
                }}
                style={{ width: width, height: height, resizeMode: "cover" }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,1)", "transparent"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 100,
              }}
            />
            {/* ANIMATION BARS */}
            <View
              style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingHorizontal: 10,
              }}
            >
              {content.map((index, key) => {
                return (
                  // THE BACKGROUND
                  <View
                    key={key}
                    style={{
                      height: 2,
                      flex: 1,
                      flexDirection: "row",
                      backgroundColor: "rgba(117, 117, 117, 0.5)",
                      marginHorizontal: 2,
                    }}
                  >
                    {/* THE ANIMATION OF THE BAR*/}
                    <Animated.View
                      style={{
                        flex: current === key ? progress : content[key].finish,
                        height: 2,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      }}
                    ></Animated.View>
                  </View>
                );
              })}
            </View>
            {/* END OF ANIMATION BARS */}

            <View
              style={{
                height: 50,
                flexDirection: "row",

                justifyContent: "space-between",
                paddingHorizontal: 15,
              }}
            >
              {/* THE AVATAR AND USERNAME  */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 30, width: 30, borderRadius: 25 }}
                  source={image}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    paddingLeft: 10,
                  }}
                >
                  {user}
                </Text>
              </View>
              {/* END OF THE AVATAR AND USERNAME */}
              {/* THE CLOSE BUTTON */}
              <TouchableOpacity
                onPress={() => {
                  close();
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    height: 50,
                    paddingHorizontal: 15,
                  }}
                >
                  <Ionicons name="ios-close" size={28} color="white" />
                </View>
              </TouchableOpacity>
              {/* END OF CLOSE BUTTON */}
            </View>
            {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableWithoutFeedback onPress={() => previous()}>
                <View style={{ flex: 1 }}></View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => next()}>
                <View style={{ flex: 1 }}></View>
              </TouchableWithoutFeedback>
            </View>
            {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  containerModal: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundContainer: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Story;