import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, TextInput,Button,TouchableOpacity,BackHandler  } from 'react-native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

 
const App = () => {

  const [myarrayData,setMyarraydata] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
  
loadData()

  }, []);

  async function loadData() {
    try {
      const response = await axios.get('https://saichinmayi.herokuapp.com/api/v1/rcnumber/read');
   
      datas = response.data
      var unsortrcnum = [];
      for (let index = 0; index < datas.length; index++) {
                   for (let i = 0; i < datas[index].number.length; i++) {             
                       var rc= (datas[index].number[i])
                       unsortrcnum.push(rc);
                   }
                  }
   let myarrayData = unsortrcnum.map((str, index) => ({ title: str, id: index + 1 }));
   setMyarraydata(myarrayData)
   setFilteredDataSource(myarrayData);
   setMasterDataSource(myarrayData);
   storeData();
    } 
    catch (error) {
      console.log(error)
      if(!error.response.status==0)
      Snackbar.show({
        text: 'Something went wrong, offline mode',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#FF6263"
      });

    }
    finally {
      console.log("in finaly");
      async () => {
        try {
          const value = await AsyncStorage.getItem('offfdata');
          if (value !== null) {
            // We have data!!
            console.log("get is done");
            console.log(value);
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
      };
      console.log("in finaly");
    }
  }


  storeData = async () => {
     const myoffdata = JSON.stringify(myarrayData);
     
    try {
    await AsyncStorage.setItem('offfdata', myoffdata)
    console.log("set done")
    }
    catch (e){
    console.error(e);
    }
   }




 
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text.length==4) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.title;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
 
  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <Text
        style={styles.itemStyle}>
        {item.title.toUpperCase()}
      </Text>
    );
  };
 
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#242B2E',
        }}
      />
    );
  };
  

  const logOff = async () => {
    AsyncStorage.clear();
    BackHandler.exitApp();
}
  const inputRef = React.useRef();
    setTimeout(() => inputRef.current.focus(), 1000);

    return ( 
   
    <SafeAreaView style={{flex: 1, backgroundColor: '#D9D55B',}}>
       <View style={styles.alternativeLayoutButtonContainer}>
      <Text style={styles.headingtext}>Sai Chinmayi Investigators</Text>
      <Icon name="power-off" size={25} color="#0D0D0D" style={{ padding:10}} onPress={() => logOff()}/>
      </View>
      <View style={styles.container}>
      <View style={styles.alternativeLayoutButtonContainer}>
          <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search with 4 digit number "
          keyboardType='numeric'  
          ref={inputRef}
        />
        <TouchableOpacity
         onPress={() => searchFilterFunction("")}>
        <Text style={{margin:13}}>Reset</Text>
        </TouchableOpacity>
        </View>
        <View style={{
          width: '100%',
          height: '0.5%',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity:  0.4,
          shadowRadius: 3,
          elevation: 15,
        }} />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
      );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8BD0D',
  },
  headingtext: {
    color: '#0D0D0D',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#E8BD0D',
    padding:10
  },
  itemStyle: {
    padding: 10,
    fontWeight: 'bold',
    color: '#BF3312',
    backgroundColor: '#D9D55B',
  },
  textInputStyle: {
    // height: 40,
    borderWidth: 0,
    fontWeight: 'bold',
    paddingLeft: 10,
    // margin: 5,
    borderColor: '#009688',
    backgroundColor: '#E8BD0D',
  },
  loadingcontainer: {
    flex: 1,
    justifyContent: "center"
  },
  loadinghorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  alternativeLayoutButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E8BD0D',
  },
});
 
export default App;
