import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { saveDataRows2 } from '/Users/AlexA/Desktop/ReactAppV1/Backend.js';
import { loadSavedImages2 } from '/Users/AlexA/Desktop/ReactAppV1/Backend.js';

const YourComponent = () => {
  const [CFit, setCFit] = useState([]);
  const [BFit, setBFit] = useState([]);
  const [DFit, setDFit] = useState([]);
  
  useEffect(() => {
    const requestPermissionsAndLoadImages = () => {
      ImagePicker.requestMediaLibraryPermissionsAsync()
        .then(({ status }) => {
          if (status !== 'granted') {
            console.log('Permission to access photo library denied');
          } else {
            loadSavedImages2(LoadFits, "Fit");
          }
        })
        .catch(error => {
          console.error('Error requesting media library permissions:', error);
        });
    };
  
    requestPermissionsAndLoadImages();
  }, []);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const newItem = {
          id: (type + 'Fit').length,
          type: type,
          imageUrl: result.assets[0].uri,
        };
        if (type === "C") {
          setCFit([...CFit,newItem]);
          saveDataRows2([...CFit, newItem], BFit, DFit, () => {});
        } else if (type === "B") {
          setBFit([...BFit,newItem]);
          saveDataRows2( CFit, [...BFit, newItem],DFit, () => {});
        } else if (type === "D") {
          setDFit([...DFit,newItem]);
          saveDataRows2( CFit, BFit,[...DFit, newItem], () => {});
        } 
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const LoadFits = (C,B,D) =>{
    setCFit(C)
    setBFit(B)
    setDFit(D)
  }
  

  const removeDataRow = async (rowId, type) => {
    try {
      let newData;
        newData = CFit.filter(item => item.id !== rowId);
        setCFit(newData);
     
      // Save updated data after removal
      await saveDataRows2(CFit);
    } catch (error) {
      console.error('Error removing data row:', error);
    }
  };

  const renderDataRowItem = ({ item }) => (
    <View key={item.id} style={styles.dataRowContainer}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeDataRow(item.id, item.type)}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      // Clear the state as well if needed
      setCFit([]);
      setBFit([]);
      setDFit([]);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <ScrollView>
    <View>
      <TouchableOpacity onPress={() => pickImage("C")}>
         <Text>Select Casual Fit</Text>
      </TouchableOpacity>
      <FlatList
        data={CFit}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />
      <TouchableOpacity onPress={() => pickImage("B")}>
         <Text>Select Business Fit</Text>
      </TouchableOpacity>
      <FlatList
        data={BFit}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />

      <TouchableOpacity onPress={() => pickImage("D")}>
         <Text>Select Party Fit</Text>
      </TouchableOpacity>
      <FlatList
        data={DFit}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />

      <TouchableOpacity onPress={() => clearAsyncStorage()}>
        <Text>Remove Data</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    margin: 5,
    height: 170,
    borderRadius: 10,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 1,
    padding: 5,
    borderRadius: 5,
  },
  image: {
    padding: 10,
    margin: 5,
    width: 150,
    height: 250,
  },
});

export default YourComponent;
