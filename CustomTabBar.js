import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const CustomTabBar = (props) => {
  const rotation = useSharedValue(0);
  const width = useSharedValue(0);
  
  // Use ref to track animation state
  const isAnimating = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const handleNavigations = (routeName) => {
    // Prevent new animations if one is already running
    if (isAnimating.current) return;

    // Set animation state to true
    isAnimating.current = true;

    // Start animations
    rotation.value = withRepeat(
      withTiming(20, { duration: 300 }), // Adjust duration as needed
      2,
      true
    );
    width.value = withRepeat(
      withTiming(30, { duration: 300 }), // Adjust duration as needed
      2,
      true
    );

    props.navigation.navigate(routeName);

    // Reset animation state after animations are complete
    setTimeout(() => {
      rotation.value = 0; // Reset rotation
      width.value = 0; // Reset width
      isAnimating.current = false; // Allow new animations
    }, 500); // Adjust this to match the total duration of your animations
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 15,
        backgroundColor:"#fff"
      }}>
      {props.state.routeNames.map((name, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => handleNavigations(name)}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              padding: 10,
              paddingHorizontal: 52,
            }}>
            <Animated.View
              style={[{}, props.state.index === index && animatedStyle]}>
              <MaterialCommunityIcons
                style={{
                  color: props.state.index === index ? '#0b7d73' : '#8EA1A7',
                  fontSize: 30,
                }}
                name={name.toLowerCase()} // Ensure the name matches the icon name in MaterialCommunityIcons
              />
            </Animated.View>

            <Animated.View
              style={[
                { height: 4, backgroundColor: '#1590BD' },
                props.state.index === index && animatedBorderStyle,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({});
