import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./components/Onboarding";
import HomeScreen from "./Screens/HomeScreen";
import ModelScreen from "./Screens/ModelScreen";
import ArchiveScreen from "./Screens/ArchiveScreen";
import CropUtilsScreen from "./Screens/CropUtilsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "./CustomTabBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

enableScreens();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="barley" component={ModelScreen} />
      <Tab.Screen name="archive" component={ArchiveScreen} />
      <Tab.Screen name="camera-plus" component={CropUtilsScreen} />
    </Tab.Navigator>
  );
}

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  useEffect(() => {
    checkOnboarding();
    // AsyncStorage.clear();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");

      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (err) {
      console.log("Error @onboarding", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingCompletion = async () => {
    try {
      await AsyncStorage.setItem("@viewedOnboarding", "true");
      setViewedOnboarding(true);
    } catch (err) {
      console.log("Error @onboardingComplete", err);
    }
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {loading ? (
          <Loading />
        ) : viewedOnboarding ? (
          <MyTabs />
        ) : (
          <Onboarding onDone={handleOnboardingCompletion} />
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
