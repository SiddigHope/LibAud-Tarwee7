import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import { Surface } from 'react-native-paper';
import { getCategories } from "./../config/service"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

class CatogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount() {
    getCategories().then(data => {
      this.setState({
        isLoading: false,
        data: data
      })
    }, error => {
      Alert.alert('Error', 'something whent wrong!')
    }
    )
  };

  goToDetails = item => {
    this.props.navigation.navigate('Details', { item: item, page: 'category' });
  };
  listFooter = () => {
    return <View style={{ height: 1, backgroundColor: '#fff', marginTop: 15 }} />;
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          vertical={true}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          ListFooterComponent={this.listFooter}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            let name = item.name
            let image = null
            if (!item.image == '' || !item.image == null) {
              const source = { uri: 'https://s.alrqi.net' + item.image }
              image = source
            } else {
              image = require('./../Assets/appLogo.png')
            }
            return (
              <TouchableWithoutFeedback onPress={() => this.goToDetails(item)}>
                <Surface style={styles.surface}>
                  <ImageBackground
                    source={image}
                    style={styles.img}
                    >
                    {/* <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: (width * 45) / 100, height: 150, padding: 10}}> */}
                      <Icon name="music" color="#444" size={22} />
                      <Text style={styles.name}>{name}</Text>
                    {/* </View> */}
                  </ImageBackground>
                </Surface>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    );
  }
}

export default CatogComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: width,
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  title: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#000',
    margin: 10,
    marginLeft: 15,
  },
  surface: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 3,
    height: 150,
    width: '45%',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },
  img: {
    // height: 150,
    width: (width * 45) / 100,
    borderRadius: 10,
    padding: 8
  },
  name: {
    textAlign: "center",
    backgroundColor: "rgba(143.0, 91.0, 166.0, .7)",
    width: (width * 40) / 100,
    fontFamily: 'Tajawal-Regular',
    position: 'absolute',
    bottom: 10,
    left: 7,
    borderRadius:5,
    color: '#e3e3e3',
    // fontWeight: 'bold',
    fontSize: 16,
  },
});
