import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import crops from "../crops"; // Ensure this path is correct
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CropSelect = ({ selectedCrops, onCropSelection }) => {
  const onMultiChange = (item) => {
    if (selectedCrops.includes(item.id)) {
      onCropSelection(selectedCrops.filter((id) => id !== item.id));
    } else {
      onCropSelection([...selectedCrops, item.id]);
    }
  };

  const onRemoveItem = (item) => {
    onCropSelection(selectedCrops.filter((cropId) => cropId !== item.id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>2. Select Crops</Text>
      <View style={styles.selectBoxWrapper}>
        <SelectBox
          label="" // Remove label to show only the count
          options={crops.map((crop) => ({
            item: crop.name,
            id: crop.id,
          }))}
          inputPlaceholder="                                                                                                                                               "
          selectedValues={selectedCrops.map((id) => {
            const crop = crops.find((crop) => crop.id === id);
            return { id: crop.id, item: crop.name };
          })}
          onMultiSelect={onMultiChange}
          onTapClose={onRemoveItem}
          isMulti
          hideInputFilter={false}
          containerStyle={styles.selectBoxContainer}
          optionsLabelStyle={styles.optionsLabel}
          multiOptionContainerStyle={styles.multiOptionContainer}
          searchInputProps={{
            placeholder: "Search for crops or scroll...",
            placeholderTextColor: "#858585",
            style: styles.searchInput,
          }}
          arrowIconColor="#4CAF50"
          listEmptyLabelStyle={styles.listEmptyLabel}
          selectIcon={
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="archive-outline"
                size={28}
                color="#333"
              />
            </View>
          }
          searchIconColor="black"
          toggleIconColor="black"
          dropdownStyle={styles.dropdownStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
    width: "95%",
    marginTop: 30,
  },
  titleText: {
    fontSize: 28,
    width: "100%",
    color: "#555",
    marginBottom: 10,
  },
  selectBoxWrapper: {
    width: "100%",
    alignSelf: "center",
  },
  selectBoxContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    justifyContent: "flex-start",
    minHeight: 80,
    paddingHorizontal: 10,
    alignSelf: "center",
    borderColor: "#d3d3d3",
    elevation: 5, // Matching elevation
    shadowColor: "#000", // Same shadow color
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  optionsLabel: {
    color: "black",
  },
  multiOptionContainer: {
    backgroundColor: "#e6b517",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 2,
  },
  listEmptyLabel: {
    color: "#888",
  },
  dropdownStyle: {
    maxHeight: 300,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    paddingVertical: 8,
    marginTop: 10,
  },
  iconContainer: {
    position: "absolute",
    right: -10,
    top: "50%",
    transform: [{ translateY: -14 }],
  },
});

export default CropSelect;
