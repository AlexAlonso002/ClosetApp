import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveDataRows3 } from '/Users/AlexA/Desktop/ReactAppV1/Backend.js';
import { loadSavedImages2 } from '/Users/AlexA/Desktop/ReactAppV1/Backend.js';

const YourComponent = () => {
  const [tshirts, setTshirts] = useState([]);
  const [pants, setPants] = useState([]);

  useEffect(() => {
    const requestPermissionsAndLoadImages = () => {
      ImagePicker.requestMediaLibraryPermissionsAsync()
        .then(({ status }) => {
          if (status !== 'granted') {
            console.log('Permission to access photo library denied');
          } else {
            loadSavedImages2(LoadImages, "Closet");
          }
        })
        .catch(error => {
          console.error('Error requesting media library permissions:', error);
        });
    };
  
    requestPermissionsAndLoadImages();
  }, []);

  const pickImage = (type) => {
    ImagePicker.launchImageLibraryAsync().then((result) => {
      if (!result.cancelled) {
        const newItem = {
          id: `${type}${type === 'T' ? tshirts.length + 1 : pants.length + 1}`,
          type: type,
          imageUrl: result.assets[0].uri,
        };
        if (type === 'T') {
          setTshirts([...tshirts, newItem]);
          saveDataRows3([...tshirts, newItem], pants, () => {}); // Saving both T-shirts and Pants data
        } else if (type === 'P') {
          setPants([...pants, newItem]);
          saveDataRows3(tshirts, [...pants, newItem], () => {}); // Saving both T-shirts and Pants data
        }
      }
    }).catch((error) => {
      console.error('Error picking image:', error);
    });
  };

  const LoadImages = (tees,pants) =>{
    setTshirts(tees)
    setPants(pants)
  }

  const removeDataRow = (rowId, type) => {
    let newData;
    if (type === 'T') {
      newData = tshirts.filter(item => item.id !== rowId);
      setTshirts(newData);
    } else if (type === 'P') {
      newData = pants.filter(item => item.id !== rowId);
      setPants(newData);
    }
    // Save updated data after removal
    saveDataRows3(tshirts, pants, () => {});
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

  const clearAsyncStorage = () => {
    AsyncStorage.clear((error) => {
      if (error) {
        console.error('Error clearing AsyncStorage:', error);
      } else {
        // Clear the state as well if needed
        setTshirts([]);
        setPants([]);
      }
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={() => pickImage("T")}>
         <Text>Select Tee</Text>
      </TouchableOpacity>

      <FlatList
        data={tshirts}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />
      <TouchableOpacity onPress={() => pickImage("P")}>
        <Text>Select Pants</Text>
      </TouchableOpacity>

      <FlatList
        data={pants}
        keyExtractor={(item) => item.id}
        renderItem={renderDataRowItem}
        horizontal={true}
      />

      <TouchableOpacity onPress={clearAsyncStorage}>
        <Text>Remove Data</Text>
      </TouchableOpacity>
    </View>
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
