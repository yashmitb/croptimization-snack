import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedButton } from 'react-native-really-awesome-button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeColors = ['#e6b517', '#1590bd', '#178731', '#0b7d73', '#00bfa6'];

const ArchiveScreen = () => {
  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardAnimations, setCardAnimations] = useState([]);

  const fetchReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem('@cropReports');
      const reportsData = storedReports ? JSON.parse(storedReports) : [];
      setReports(reportsData);

      // Log the selectedCrops for each report
      reportsData.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, report.selectedCrops);
      });
    } catch (error) {
      console.error('Error fetching reports from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchReports(); // Initial fetch
  }, []);

  useEffect(() => {
    const animations = reports.map(() => new Animated.Value(0));
    setCardAnimations(animations);
  }, [reports]);

  const toggleReports = (release) => {
    setTimeout(release, 300);
    if (showReports) {
      hideReportsInReverse();
    } else {
      setShowReports(true);
      showReportsInSequence();
    }
  };

  const showReportsInSequence = () => {
    cardAnimations.forEach((animation, index) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: index * 300,
      }).start();
    });
  };

  const hideReportsInReverse = () => {
    const animations = [...cardAnimations].reverse();
    animations.forEach((animation, index) => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        delay: index * 300,
      }).start(() => {
        if (index === animations.length - 1) {
          setShowReports(false);
          fetchReports(); // Refresh reports when hiding them
        }
      });
    });
  };

  const toggleModal = (report) => {
    console.log('Selected Crops List from dropdown:', report.selectedCrops); // Log the selected crops list

    // Assuming report.selectedCrops is an array of IDs
    const selectedCropIDs = report.selectedCrops;

    // Find common crops based on IDs
    const commonCrops = report.crops.filter((crop) =>
      selectedCropIDs.includes(crop.id)
    );

    // Log the common crops
    console.log('Common Crops:', commonCrops);

    setSelectedReport({ ...report, commonCrops }); // Pass common crops to the selected report
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const renderCrops = (crops, commonCrops) => {
    if (commonCrops.length === 0) {
      return (
        <View style={styles.cropsContainer}>
          {crops.map((crop, index) => (
            <Text key={index} style={styles.cropText}>
              {`${crop.crop}: ${
                Math.ceil(crop.predicted_yield / 1000)
                  ? Math.ceil(crop.predicted_yield.toFixed(2) / 1000)
                  : 'N/A'
              } kg/ha`}
            </Text>
          ))}
          <Text style={styles.noCropsText}>
            The crops you selected are unfortunately not in the top 10.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.cropsContainer}>
        {crops.map((crop, index) => {
          const isCommon = commonCrops.some(
            (commonCrop) => commonCrop.id === crop.id
          );
          return (
            <View>
              <Text
                key={index}
                style={[
                  styles.cropText,
                  isCommon ? styles.commonCropText : null, // Apply different style for common crops
                ]}>
                {`${crop.crop}: ${
                  Math.ceil(crop.predicted_yield / 1000)
                    ? Math.ceil(crop.predicted_yield.toFixed(2) / 1000)
                    : 'N/A'
                }k kg/ha`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textcontainer}>
        <Text style={styles.titleText}>Croptimization</Text>
        <Text style={styles.subtitleText}>Viewing your reports:</Text>
        <Text style={styles.subText}>
          1. Tap the{' '}
          <Text style={{ fontWeight: 'bold' }}>Show All Reports</Text> button on
          this screen to view saved reports
        </Text>
        <Text style={styles.subText}>
          2. Tap any report card to view crop details and predicted yields.
        </Text>
        <Text style={styles.subText}>
          3.{' '}
          <Text style={{ fontWeight: 'bold', color: '#e6b517' }}>
            Highlighted Crops:
          </Text>{' '}
          Crops you selected will appear in{' '}
          <Text style={{ fontWeight: 'bold', color: '#e6b517' }}>
            bold gold.
          </Text>
        </Text>
        <Text style={styles.subText}>
          4.{' '}
          <Text
            style={{
              color: '#1590bd',
            }}>
            No Common Crops{' '}
          </Text>
          : A message will show if there are no common crops
        </Text>
        <Text style={styles.subText}>
          5. Refreshing Reports: Tap{' '}
          <Text style={{ fontWeight: 'bold' }}>Hide/Refresh Reports</Text> to
          reload the latest data, then{' '}
          <Text style={{ fontWeight: 'bold' }}>Show All Reports</Text> to view
          them again.
        </Text>
      </View>
      <ThemedButton
        onPress={toggleReports}
        progress
        name="rick"
        type="primary"
        style={styles.button}
        backgroundColor="#0b7d73"
        borderColor="#0a5952"
        backgroundDarker="#0d6e65"
        textColor="white"
        backgroundProgress="#1590bd">
        {showReports ? 'Hide/Refresh Reports' : 'Show All Reports'}
      </ThemedButton>

      {showReports && Array.isArray(reports) && reports.length > 0 && (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.cardsContainer}>
            {reports.map((report, index) => (
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
                  width: '48%',
                  marginBottom: 10,
                  marginHorizontal: '1%',
                }}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => toggleModal(report)}>
                  <MaterialCommunityIcons
                    name="file-document"
                    size={50}
                    color={themeColors[index % themeColors.length]}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>{report.location}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{`Report Details`}</Text>
            {selectedReport &&
              renderCrops(selectedReport.crops, selectedReport.commonCrops)}

            <ThemedButton
              onPress={closeModal}
              name="rick"
              type="primary"
              style={styles.button}
              backgroundColor="#0b7d73"
              borderColor="#0a5952"
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
  textcontainer: {
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    width: '95%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 150, // Set a minimum height
    flex: 1, // Allow card to grow
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20, // Adjusted margin,
    minWidth: 150,
  },
  cardText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  cropsContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 5,
  },
  cropText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
  },
  noCropsText: {
    fontSize: 16,
    color: '#1590bd', // You can change this to whatever color you prefer
    textAlign: 'center',
    marginTop: 10,
  },
  commonCropText: {
    fontWeight: 'bold',
    color: '#e6b517', // Highlight color for common crops
  },
});

export default ArchiveScreen;
