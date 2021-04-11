import React, { Component } from 'react';
import { BackHandler, Alert, View, StyleSheet, Text, ScrollView, Dimensions, StatusBar } from 'react-native';
import BannerComponent from '../Components/BannerComponent';
import CatogComponent from '../Components/CategoryHome';
import SongsComponent from '../Components/SongsHome';
import BandHome from '../Components/BandHome';

const { width, height } = Dimensions.get('window');

// StatusBar.setBarStyle("light-content");
// if (Platform.OS === "android") {
//     StatusBar.setBackgroundColor("rgba(0,0,0,0)");
//     StatusBar.setTranslucent(true);
// }

class Home extends Component {
    constructor(props) {
        super(props);
    }

    
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {

    if (this.props.navigation.isFocused()) {
      Alert.alert(
        "Exit App",
        "Do you want to exit?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
      );
      return true;
    }

    // return true;  // Do nothing when back button is pressed
  }

    render() {
        return (
            <View style={styles.container}>
            <StatusBar backgroundColor="#5D3F6A" />
                <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center"}} showsVerticalScrollIndicator={false} style={{ height: '100%', width: width}}>
                    <BannerComponent navigation={this.props.navigation} />
                {/* <Text style={styles.title}>Music App</Text> */}
                    {/* <View style={{ height: 20, elevation: 15, marginHorizontal: 50 }} />
                    <BandHome navigation={this.props.navigation} /> */}
                    <View style={{ height: 20, elevation: 15, }} />
                    <CatogComponent navigation={this.props.navigation} />
                    <View style={{ height: 20, elevation: 15, marginHorizontal: 50 }} />
                    <SongsComponent navigation={this.props.navigation} />
                </ScrollView>
            </View>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        // backgroundColor: '#392643',
        // paddingHorizontal: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
        marginLeft: 15,
    },
});