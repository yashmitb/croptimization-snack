import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Animated,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CropSelect from '../components/CropSelect'; // Adjust the path as necessary
import { ThemedButton } from 'react-native-really-awesome-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_KEY = 'b3e96d2d66b34476960e508649ecc65f'; // OpenCage API key
const generateDummyReport = () => {
  const dummyData = [
    {
      crop: 'Cucumbers and gherkins',
      id: 32,
      predicted_yield: 1692968839179.2405,
    },
    { crop: 'Tomatoes', id: 112, predicted_yield: 1075851298796.5234 },
    {
      crop: 'Chillies and peppers, green (Capsicum spp. and Pimenta spp.)',
      id: 26,
      predicted_yield: 806100251198.3422,
    },
    { crop: 'Strawberries', id: 102, predicted_yield: 195464447066.66428 },
    { crop: 'Sour cherries', id: 131, predicted_yield: 102580867681.57909 },
  ];

  return {
    location: location,
    date: new Date().toLocaleString(),
    crops: dummyData,
  };
};

const ModelScreen = () => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [weatherData, setWeatherData] = useState(null);
  const [predictedData, setPredictedData] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' or 'error'
  const navigation = useNavigation(); // Hook to access navigation

  const handleCropSelection = (crops) => {
    setSelectedCrops(crops);
    console.log('Selected Crops: ', crops);
  };

  const handleSearchAndSubmit = async (release) => {
    if (location.trim() === '') {
      showModal('error', 'Please enter a ZIP code or city.');
      setTimeout(release, 300);
      return;
    }
    setTimeout(release, 3000);

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          location
        )}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setCoordinates({ lat, lng });
        console.log('Fetched Latitude: ', lat);
        console.log('Fetched Longitude: ', lng);

        const weatherUrl = `http://yashmitbhaverisetti.pythonanywhere.com/future_weather?latitude=${lat}&longitude=${lng}`;

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          setTimeout(release, 300);
          throw new Error(`HTTP error! status: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData);
        console.log('Weather Data: ', weatherData);

        const predictionData = {
          temp: weatherData.average_temperature,
          precip: weatherData.average_precipitation * 1000,
          soil_tmp: weatherData.average_soil_temperature,
          soil_moist: weatherData.average_soil_moisture * 100,
        };

        const predictionUrl =
          'https://yashmitbhaverisetti.pythonanywhere.com/predict';
        const predictionResponse = await fetch(predictionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(predictionData),
        });

        if (!predictionResponse.ok) {
          setTimeout(release, 300);
          throw new Error(`HTTP error! status: ${predictionResponse.status}`);
        }

        const predictedData = await predictionResponse.json();
        setPredictedData(predictedData);
        console.log('Predicted Data: ', predictedData);

        // Store the report along with selected crops in AsyncStorage
        const report = {
          location: location,
          date: new Date().toLocaleString(),
          crops: predictedData,
          selectedCrops: selectedCrops, // Store selected crops
        };

        const storedReports = await AsyncStorage.getItem('@cropReports');
        const reports = storedReports ? JSON.parse(storedReports) : [];
        reports.push(report);
        await AsyncStorage.setItem('@cropReports', JSON.stringify(reports));
        console.log('report', report);
        // Show success modal after generating the report
        showModal('success', `Report generated successfully!`);

        // Navigate to ArchiveScreen with the new report
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ArchiveScreen', { reports: report }); // Pass the new report
        }, 2000);
      } else {
        setTimeout(release, 300);
        showModal('error', 'Location not found.');
      }
    } catch (error) {
      console.error('Error:', error);
      showModal('error', 'Failed to fetch data. Please try again later.');
    }
  };

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.titleText}>Croptimization</Text>
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
        <Text style={styles.inputLabel}>1. Input Zipcode/City</Text>
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim, marginTop: 10 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="12345/New York...."
            value={location}
            onChangeText={(text) => setLocation(text)}
            placeholderTextColor="#858585"
          />
        </View>
        <CropSelect
          selectedCrops={selectedCrops}
          onCropSelection={handleCropSelection}
        />
      </Animated.View>

      <ThemedButton
        onPress={handleSearchAndSubmit}
        progress
        name="rick"
        type="primary"
        style={styles.submitButton}
        backgroundColor="#0b7d73"
        borderColor="#0a5952 "
        backgroundDarker="#0d6e65"
        textColor="white"
        backgroundProgress="#1590bd">
        Search & Submit
      </ThemedButton>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name={modalType === 'success' ? 'check-circle' : 'alert-circle'}
              size={48}
              color={modalType === 'success' ? 'green' : 'red'}
            />
            <Text style={styles.modalText}>{modalMessage}</Text>

            <ThemedButton
              onPress={() => setModalVisible(false)}
              name="rick"
              type="primary"
              style={styles.modalButton}
              backgroundColor="#0b7d73"
              borderColor="#0a5952 "
              backgroundDarker="#0d6e65"
              textColor="white"
              backgroundProgress="#1590bd">
              Close
            </ThemedButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  inputLabel: {
    fontSize: 28,
    width: '100%',
    color: '#555',
    marginBottom: 10,
    marginTop: '10%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderWidth: 2,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderColor: '#d3d3d3',
    elevation: 5, // Matching elevation
    shadowColor: '#000', // Same shadow color
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    height: 65,
    borderRadius: 55,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 30,
    textColor: '#858585',
  },
  submitButton: {
    marginVertical: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default ModelScreen;
