import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDataRows2 = async (cas, bus, dress, callback) => {
  AsyncStorage.setItem('SaveCas', JSON.stringify(cas), (error) => {
    if (error) {
      console.error('Error saving data rows:', error);
    } else {
      AsyncStorage.setItem('SaveBus', JSON.stringify(bus), (error) => {
        if (error) {
          console.error('Error saving data rows:', error);
        } else {
          AsyncStorage.setItem('SaveDress', JSON.stringify(dress), (error) => {
            if (error) {
              console.error('Error saving data rows:', error);
            } else {
              callback();
            }
          });
        }
      });
    }
  });
};

export const saveDataRows3 = (dataTshirts, dataPants, callback) => {
    AsyncStorage.setItem('savedDataRowsTshirts', JSON.stringify(dataTshirts), (error) => {
      if (error) {
        console.error('Error saving data rows:', error);
      } else {
        AsyncStorage.setItem('savedDataRowsPants', JSON.stringify(dataPants), (error) => {
          if (error) {
            console.error('Error saving data rows:', error);
          } else {
            callback();
          }
        });
      }
    });
  };


  export const loadSavedImages2 = (callback, type, month,day) => {
    if(type === "Closet"){
      AsyncStorage.getItem('savedDataRowsTshirts')
        .then(savedDataRowsJsonTshirts => {
          return AsyncStorage.getItem('savedDataRowsPants')
            .then(savedDataRowsJsonPants => {
              const savedTshirts = savedDataRowsJsonTshirts ? JSON.parse(savedDataRowsJsonTshirts) : [];
              const savedPants = savedDataRowsJsonPants ? JSON.parse(savedDataRowsJsonPants) : [];
              callback(savedTshirts, savedPants);
            })
            .catch(error => {
              console.error('Error loading saved data rows:', error);
            });
        })
        .catch(error => {
          console.error('Error loading saved data rows:', error);
        });
    }
    else if (type === "Fit"){
      AsyncStorage.getItem('SaveCas', (error, cas) => {
        if (error) {
          console.error('Error loading saved data rows:', error);
        } 
        else {
          AsyncStorage.getItem('SaveBus', (error, bus) => {
            if (error) {
              console.error('Error loading saved data rows:', error);
            } 
            else {
              AsyncStorage.getItem("SaveDress",(error,dress) =>{
                if(error){
                  console.error('Error loading saved data rows:', error);
                }
                else{
                  const C = cas ? JSON.parse(cas) : [];
                  const B = bus ? JSON.parse(bus) : [];
                  const D = dress ? JSON.parse(dress) : [];
                  callback(C,B,D)
                }
              })
            }
          });
        }
      });
    }

    else if(type==="Calander"){
      AsyncStorage.getItem(date, (error, day1) => {
        if (error) {
          console.error('Error loading saved data rows:', error);
        } 
        else {
          console.log("Date call")
          let day = day1 ? JSON.parse(day1) : [];
          callback(day)
    }
  })
}

  };