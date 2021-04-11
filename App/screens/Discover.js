import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import { Header, Left, Right, Drawer } from 'native-base'
import { SOngData } from './../config/service'
import { getAudios } from './../config/service'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash'

const {width, height} = Dimensions.get('window')
console.disableYellowBox = true

class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      data:'',
      completeData:'',
      query:'',
    }
  }

  componentDidMount(){
    getAudios().then(data => {
      this.setState({
        completeData: data,
      })
    })
  }

  async handleSearch(text) {
    if (text == "") {
      this.setState({
        data: {}
      })
    }
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    const data = _.filter(this.state.completeData, item => {
      const title = item.title
      if (title.includes(formatedQuery)) {
        filtered.push(item)
        return true
      }
      return false
    })
    this.setState({ data, query: text })
  }

  closeDrawer() {
    this.drawer._root.close()
  };

  openDrawer() {
    this.drawer._root.open()
  };

  search = async (text) => {
    this.setState({ searchKey: text })
  }

  render() {
    return (
      // <Drawer
      //   ref={(ref) => { this.drawer = ref; }}
      //   content={<SideBar navigator={this.navigator} />}
      //   onClose={() => this.closeDrawer()} >
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#5D3F6A' }} androidStatusBarColor="#5D3F6A" hasTabs>
          <Left>
            {/* <TouchableOpacity
              style={{ alignItems: 'flex-end', margin: 16 }}
              onPress={() => this.openDrawer()} >
              <Icon name="menu" size={24} color="#e3e3e3" />
            </TouchableOpacity> */}
          </Left>
          <Right style={{ marginRight: 10 }} >
            <Text style={styles.title}>{"مكتبة الصوتيات"}</Text>
          </Right>
        </Header>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            textAlign='right'
            placeholder="إبحث هنا ..."
            onChangeText={(text) => this.handleSearch(text)}
          />
        </View>
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={this.state.data}
              showsVerticalScrollIndicator={false}
              // ItemSeparatorComponent={() => this.separator()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <SOngData index={index} item={item} navigation={this.props.navigation} />
                );
              }}
            />
        </SafeAreaView>
      </View>
    // </Drawer >
    );
  }
}

export default Discover;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  Apptitle: {
    fontSize: 24,
    fontFamily: 'Tajawal-Regular',
    // fontWeight: 'bold',
    color: '#e3e3e3',
    marginLeft: 15,
  },
  title: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#e3e3e3',
    marginLeft: 15,
  },

  recent: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Tajawal-Regular',
    color: '#000',
    margin: 20,
    marginLeft: 15,
  },
  input: {
    width: '100%',
    height: 45,
    padding: 10,
    color: '#000',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'gray',
    marginRight: 5,
    fontSize: 18,
    fontFamily: 'Tajawal-Regular',
    backgroundColor: '#fff'
  },
  inputContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    marginTop: 10
  },
  searchBtn: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    left: 38,
  },
  songContainer: {
    width: width - 40,
    height: 70,
  },
  img: {
    backgroundColor: '#e3e3e3',
    height: 70,
    width: 70,
    borderRadius: 35,
    // borderColor: '#e3e3e3',
    // borderWidth: 1
    elevation: 5,
  },
  dataContainer: {
    paddingLeft: 10,
    width: width - 160,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Tajawal-Regular',
    // fontWeight: 'bold',
    color: '#e3e3e3',
    margin: 10,
    marginLeft: 15,
  },
  songtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#e3e3e3',
  },
  subTitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 15,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
});
