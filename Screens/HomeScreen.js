import React, { useEffect, useState, useRef, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Modal,
  Image,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { WebView } from "react-native-webview";

const HomeScreen = ({ navigation }) => {
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const welcomeAnimation = useRef(new Animated.Value(0)).current;
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const { width } = useWindowDimensions();

  const handlePress = () => {
    if (!isAnimating) {
      setModalVisible1(true);
    }
  };

  const restartApp = () => {
    if (!isAnimating) {
      AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  };

  const closeModal1 = () => {
    setModalVisible1(false);
  };

  const handlePress1 = () => {
    if (!isAnimating) {
      setModalVisible2(true);
    }
  };

  const closeModal2 = () => {
    setModalVisible2(false);
  };

  const cards = [
    {
      title: "Read Paper",
      icon: "book-open",
      iconColor: "#00bfa6",
      onPress: handlePress,
    },
    {
      title: "Predictions",
      icon: "chart-line",
      iconColor: "#0b7d73",
      onPress: () => !isAnimating && navigation.navigate("barley"),
    },
    {
      title: "View Reports",
      icon: "archive-eye",
      iconColor: "#178731",
      onPress: () => !isAnimating && navigation.navigate("archive"),
    },
    {
      title: "Reset App",
      icon: "refresh",
      iconColor: "#e6b517",
      onPress: handlePress1,
    },
  ];

  const cardAnimations = cards.map(() => useRef(new Animated.Value(0)).current);

  const animateText = () => {
    setIsAnimating(true);
    Animated.timing(titleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(welcomeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.stagger(
          500,
          cardAnimations.map((animation) =>
            Animated.timing(animation, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          )
        ).start(() => setIsAnimating(false));
      });
    });
  };

  useEffect(() => {
    animateText();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={modalVisible1}
        onRequestClose={closeModal1}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.webviewContainer}>
            <WebView
              style={styles.container}
              source={{
                uri: "https://www.journalresearchhs.org/_files/ugd/ebf144_ac0d6e5d6b61481d8a54a6c1377a8a84.pdf",
              }}
            />
            <TouchableOpacity onPress={closeModal1} style={styles.closeButton}>
              <MaterialCommunityIcons
                name={"window-close"}
                size={35}
                color={"black"}
                style={{ marginLeft: "45%" }}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={modalVisible2}
        onRequestClose={closeModal2}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.warningContainer}>
            <View style={{ flex: 0.1 }}>
              <Text style={styles.titleTextForModal}>Reset Croptimization</Text>
            </View>
            <Image
              source={require("../assets/reset.png")}
              style={styles.image}
            />
            <View
              style={{
                flex: 0.7,
                width: "90%",
                alignSelf: "center",
                paddingTop: "5%",
              }}
            >
              <Text style={styles.warningTitleTextForModal}>
                Are you sure you want to reset the app?
              </Text>
              <Text style={styles.warningTextForModal}>
                You will no longer be able to access{" "}
                <Text style={{ fontWeight: "bold", color: "#90caf9" }}>
                  app statistics, reports, and data
                </Text>
                . This action will permanently erase all recorded{" "}
                <Text style={{ fontWeight: "bold", color: "#ffcc80" }}>
                  information, including progress, reports, and saved settings
                </Text>
                . Once reset, the data cannot be recovered, and the app will
                return to its{" "}
                <Text style={{ fontWeight: "bold", color: "#90caf9" }}>
                  default state
                </Text>
                . Please confirm only if you’re{" "}
                <Text style={{ fontWeight: "bold", color: "#ffcc80" }}>
                  certain
                </Text>
                , as this action cannot be undone. Click the{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#ffab91",
                    fontSize: 20,
                  }}
                >
                  X
                </Text>{" "}
                to cancel this action.
              </Text>
              <Button
                title="Reset App"
                buttonStyle={{ backgroundColor: "#E83A3A" }}
                containerStyle={{
                  height: 40,
                  width: "95%",
                  alignSelf: "center",
                  marginTop: "10%",
                  borderRadius: 10,
                }}
                titleStyle={{ color: "white" }}
                onPress={restartApp}
              />
            </View>
            <View style={{ flex: 0.1 }}>
              <TouchableOpacity
                onPress={closeModal2}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name={"window-close"}
                  size={35}
                  color={"black"}
                  style={{ marginLeft: "45%" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Animated.View style={{ opacity: titleAnimation }}>
        <Text style={styles.titleText}>Croptimization</Text>
      </Animated.View>
      <Animated.View style={{ opacity: welcomeAnimation }}>
        <Text style={styles.welcomeText}>Welcome...</Text>
      </Animated.View>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: cardAnimations[index],
              transform: [
                {
                  translateY: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              marginBottom: 20,
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={[styles.card, isAnimating && { opacity: 0.5 }]}
              onPress={card.onPress}
              disabled={isAnimating}
            >
              <MaterialCommunityIcons
                name={card.icon}
                size={50}
                color={card.iconColor}
                style={styles.icon}
              />
              <Text style={styles.cardText}>{card.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  image: {
    flex: 0.4,
    borderRadius: 10000,
    alignSelf: "center",
    width: "100%",
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "20%",
    textAlign: "center",
    width: "100%",
  },
  titleTextForModal: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: "5%",
    textAlign: "center",
    width: "100%",
    color: "#ff6961",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    width: "100%",
    marginLeft: 10, // Gap on the left
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 150,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  cardText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  warningTextForModal: {
    color: "gray",
    fontSize: 17,
    textAlign: "left",
  },
  warningTitleTextForModal: {
    textAlign: "left",
    color: "#121212",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "5%",
  },
  icon: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  webviewContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
  },
  warningContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
  },
  closeButton: {
    borderRadius: 90,
    width: "100%",
    alignSelf: "right",
    backgroundColor: "white",
  },
});

export default HomeScreen;
