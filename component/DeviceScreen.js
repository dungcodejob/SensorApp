
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ReactNativePickerModule from "react-native-picker-module"
import Feather from "react-native-vector-icons/Feather";
import firestore from '@react-native-firebase/firestore';
import * as Animetable from "react-native-animatable";


function DeviceScreen({ navigation }) {

  let pickerRef = null
  const [valueText, setValueText] = useState("Tất cả");
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [refresh, setRefresh] = useState(true);
  const refDevice = firestore().collection('Devices');
  const [deviceList, setDeviceList] = useState([]);

  const refArea = firestore().collection('AreaPlant');
  const [areaList, setAreaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [areaNameText, setAreaNameText] = useState([]);
  const getNameArea = (list) => {
    const nameList = [];
    nameList.push("Tất cả")
    list.forEach(item => {
      nameList.push(item.AreaId);
    });
    setAreaNameText(nameList);
  }

  // const getDevices = async (index) => {


  //   var query = refDevice;

  //   console.log(index);
  //   if(index != 0){
  //     query = query.where("AreaId", "==", areaList[index - 1].AreaId);
  //     setDeviceList([]);
  //     await query.onSnapshot((querySnapshot) => {
  //       var list = [];
  //       querySnapshot.forEach(doc => {
  //         const { AID, type, status } = doc.data();
  //         // console.log(doc)
  //         list.push({
  //           id: doc.id,
  //           AID,
  //           type,
  //           status,
  //         });
  //       });

  //       setDeviceList(list);
  //     });
  //   }else{
  //     setDeviceList([]);
  //   }

  //   setRefresh(!refresh);
  // }

  const getDevices = async (index) => {


    var query = refDevice;

    console.log(index);
    if (index != 0) {
      query = query.where("AreaId", "==", areaList[index - 1].AreaId);
    }
    setDeviceList([]);
    query.onSnapshot((querySnapshot) => {
      var list = [];
      querySnapshot.forEach(doc => {
        const { AID, type, status, Name } = doc.data();
        // console.log(doc)
        list.push({
          id: doc.id,
          AID,
          type,
          status,
          Name,
        });
      });

      setDeviceList(list);
    });
    // setRefresh(!refresh);
  }

  useEffect(() => {
    console.log("getArea");
    refArea.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { location, quantityofplant, typeplant } = doc.data();
        // console.log(doc)
        list.push({
          AreaId: doc.id,
          location,
          quantityofplant,
          typeplant,
        });
      });

      getNameArea(list);
      setAreaList(list);
    });

    if (loading) {
      setLoading(false);
    }

  }, []);


  // useEffect(() => {

  //   refDevice.onSnapshot((querySnapshot) => {
  //     var list = [];
  //     querySnapshot.forEach(doc => {
  //       const { AreaId, type, status } = doc.data();
  //       // console.log(doc)
  //       list.push({
  //         id: doc.id,
  //         AreaId,
  //         type,
  //         status,
  //       });
  //     });
  //     console.log(list);
  //     if(list){
  //       list.forEach(device=>{
  //         console.log(device.id)
  //         var newref = firestore().collection('Devices/' + device.id + '/logStatus')
  //         newref.orderBy("Time",'desc').onSnapshot((querySnapshot) => {
  //           doc = querySnapshot.docs[0];
  //           console.log(doc.data())
  //           const { status, Time } = doc.data();
  //           console.log(status);
  //           refDevice.doc(device.id).update({
  //             status: status
  //           }).then(function () {
  //             console.log("Devices status successfully updated!");
  //           })
  //             .catch(function (error) {
  //               // The document probably doesn't exist.
  //               console.error("Error updating document: ", error);
  //             });
  //         });
  //       });
  //     }
  //     setDeviceList([]);

  //     if (loading) {
  //       setLoading(false);
  //     }
  //   });


  // }, []);


  if (loading) {
    return null;
  }

  const renderListView = () => {
    var animationDuration = 0;
    var i = 1000;
    return (
      <FlatList

        data={deviceList}
        extraData={deviceList}
        renderItem={({ item }) => {
          i -= 200;
          return <Animetable.View
            animation="fadeInLeft"
            duration={animationDuration += i}
            style={styles.card}>

            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeIntensity', { id : item.id })}>
              <View style={[{ flexDirection: "row" }, { display: "flex" }, { justifyContent: "space-between" }]}>
                <View>
                  <Text style={styles.card_title}>{item.Name}</Text>
                  <Text style={[{ fontSize: 16 }, { marginTop: 5 }]}>{"Loại : " + item.type}</Text>

                </View>
                <View>
                  <Text style={[{ color: "#7d8a9a" }, { marginRight: 5 }, { marginBottom: 10 }, { textAlign: "right" }]}>Trạng thái</Text>
                  {
                    item.status == true ? (
                      <View style={[{ backgroundColor: "#67b373" }, styles.status_card]}>
                        <Text style={styles.status_cardText}>HOẠT ĐỘNG</Text>
                      </View>
                    ) : (
                        <View style={[{ backgroundColor: "#f79229" }, styles.status_card]}>
                          <Text style={styles.status_cardText}>KHÔNG HOẠT ĐỘNG</Text>
                        </View>
                      )

                  }
                </View>
              </View>

            </TouchableOpacity>
          </Animetable.View>
        }

        }
      />
    )
  }


  // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  // const [dataSource, setDataSource] = useState(ds.cloneWithRows(['row 1', 'row 2']));

  return (

    <View style={styles.container}>
      <TouchableOpacity
        style={{
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "rgba(0,0,0,.32)",
        }}
        onPress={() => {
          pickerRef.show();
        }}>
        <View style={styles.selectBox}>
          <Text style={styles.selectBox_text}>Khu Vực: {valueText}</Text>
          <Feather style={styles.selectBox_icon} name="chevron-down" size={25} />
        </View>
      </TouchableOpacity>
      {/* <Text>Selected Item Text: {valueText}</Text>
      <Text>Selected Item ID: {selectedIndex}</Text> */}

      <ReactNativePickerModule
        pickerRef={e => (pickerRef = e)}
        selectedValue={selectedIndex}
        title={"Select a Area"}
        items={areaNameText}
        onDismiss={() => {
          console.log("onDismiss")
        }}
        onCancel={() => {
          console.log("Cancelled")
        }}
        onValueChange={(valueText, index) => {
          // console.log("value: ", valueText)
          // console.log("index: ", index)
          setValueText(valueText)
          setSelectedIndex(index)
          getDevices(index)
        }}
      />
      {
        renderListView()
      }

    </View>
  );
}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#EDF0F8"
  },

  selectBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6aa8fd",
    backgroundColor: "#fff",
    marginHorizontal: 8,
    borderRadius: 4,
  },

  selectBox_text: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  selectBox_icon: {
    paddingHorizontal: 8,
  },

  card: {
    display: "flex",

    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,.32)",
    justifyContent: "space-between",
    padding: 12,
    height: "auto",
    margin: 16,
  },

  card_title: {
    fontSize: 18,
  },

  status_card: {
    borderRadius: 30,
  },

  status_cardText: {
    color: "#fff",
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,


  }


});

export default DeviceScreen


