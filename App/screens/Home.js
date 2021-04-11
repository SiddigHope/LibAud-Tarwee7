import React, { Component } from 'react';
import { Alert, View, StyleSheet, BackHandler, Text, Dimensions, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Container, Body, Header, Left, Right, Drawer, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AlbumsComponent from '../Components/AlbumsComponent';
import CatogComponent from '../Components/CatogComponent';
import SideBar from './../config/SideBar'
import SongsComponent from '../Components/SongsComponent';
import BandComponent from '../Components/BandComponent';
import NetInfo from '@react-native-community/netinfo'
import Taps from './../config/taps'
import CacheImage from './../config/CacheImages'
import { getAudios } from '../config/service'
import TrackPlayer, { pause } from 'react-native-track-player';
import _ from 'lodash'

const { width, height } = Dimensions.get('window');

console.disableYellowBox = true

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      item: null,
      tab: 3,
      commig : null
    }
  }


  componentDidMount() {
    const navigation = this.props.navigation
    navigation.addListener('focus', ()=>{
      this.forceUpdate()
    })
    this.connect()
    this.checkPlayer()
    // this.gotoTab()
  }

  closeDrawer() {
    this.drawer._root.close()
  };

  openDrawer() {
    this.drawer._root.open()
  };
  async connect() {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        this.setState({
          connected: (
            <SafeAreaView style={{ backgroundColor: 'red' }}>
              <Text style={{ color: '#fff', padding: 10, textAlign: "center", fontFamily: 'Tajawal-Regular', fontSize: Platform.OS == 'android' ? 12 : 16 }}>No Internet Connection</Text>
            </SafeAreaView>
          )
        })
      } else {
        this.setState({ connected: null })
      }
    });
  }

  async checkPlayer() {
    const status = await TrackPlayer.getState()
    // for the update, to show the current playing audio
    console.log('status')
    console.log(status)
    // status must be 3 to check if the player is playing and 2 if its idle or paused
    if (status == '101010') {
      const track = await TrackPlayer.getCurrentTrack()
      getAudios().then(data => {
        const string = _.filter(data, item => {
          const id = item.nid
          if (id.match(track)) {
            this.setState({ item: (
                <>
                    <View style={{ backgroundColor: '#5D3F6A', height: 60 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => { }} style={[styles.iconBack, { backgroundColor: '#e3e3e3' }]}>
                            <Icon name='play' color='#5D3F6A' size={20} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { this.pause() }} style={[styles.iconBack, { backgroundColor: '#e3e3e3' }]}>
                            <Icon name='pause' color='#5D3F6A' size={20} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { }} style={[styles.iconBack, { backgroundColor: '#e3e3e3' }]}>
                            <Icon name='play' color='#5D3F6A' size={20} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.dataContainer}>
                          <Text style={styles.songtitle}>{item.title}</Text>
                        </View>
                        <View style={[styles.imgBack, { backgroundColor: '#5D3F6A' }]}>
                          <CacheImage url={item.field_image} name={item.title + '.jpg'} style={styles.img} />
                        </View>

                      </View>
                    </View>
                  </>)})
            console.log('******************')
            console.log(item)
          }
        })
      })
    }else{
      this.setState({
        item: (
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
        ) })
    }
  }
goGetTab =  () =>{
  const gototab = typeof(this.props.route.params.gotoTab) != 'undefined' ? this.props.route.params.gotoTab : null
  if (!gototab) {
    console.log('no no no no no no no no no ....................')
  } else {
    console.log('this.props.gotoTab')
    if (this.state.tab != gototab) {
      this.setState({
        tab: gototab
      })
    }
    console.log(gototab)
  }
}

container(){
  return(
    <Container style={{ backgroundColor: "#FFF" }} >
      <Tabs initialPage={this.state.tab} tabBarUnderlineStyle={{ height: 2, backgroundColor: '#fff' }} tabBarPosition="overlayTop">
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ color: '#e3e3e3', fontFamily: 'Tajawal-Regular', }} activeTabStyle={styles.active} heading="التصنيفات">
          <CatogComponent navigation={this.props.navigation} />
        </Tab>
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ color: '#e3e3e3', fontFamily: 'Tajawal-Regular', }} activeTabStyle={styles.active} heading="الالبومات">
          <AlbumsComponent navigation={this.props.navigation} />
        </Tab>
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ color: '#e3e3e3', fontFamily: 'Tajawal-Regular', }} activeTabStyle={styles.active} heading="الفرق">
          <BandComponent navigation={this.props.navigation} />
        </Tab>
        <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTextStyle={{ color: '#e3e3e3', fontFamily: 'Tajawal-Regular', }} activeTabStyle={styles.active} heading="الصوتيات" >
          <SongsComponent navigation={this.props.navigation} />
          {/* <BannerComponent navigation={this.props.navigation}/> */}
        </Tab>
      </Tabs>
      {this.state.connected}
    </Container>
  )
}
  render() { 
    if(this.state.tab !=this.state.commig){
      // this.goGetTab()
    }
    return (
      // <Drawer
      //   ref={(ref) => { this.drawer = ref; }}
      //   content={<SideBar navigator={this.navigator} />}
      //   onClose={() => this.closeDrawer()} >
      <View style={styles.container}>
        {this.state.item}
          {this.container()}
        </View>
    );
    {/* </Drawer> */}
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // height: height
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal-Regular',
    // fontWeight: 'bold',
    color: '#e3e3e3',
    marginLeft: 15,
  },
  tabStyle: {
    backgroundColor: '#5D3F6A',
  },
  active: {
    fontFamily: 'Tajawal-Regular',
    // backgroundColor: '#8f5ba6', 
    backgroundColor: '#5D3F6A',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    color: '#e3e3e3'
  },
  imgBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginHorizontal: 5
  },
  iconBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginLeft: 5,
    justifyContent: "center",
    alignItems:"center"
  },
  img: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  dataContainer: {
    paddingHorizontal: 10,
    width: width - 160,
    // backgroundColor: 'red',
    justifyContent: "center"
  },
  songtitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 20,
    color: '#e3e3e3',
    marginTop: 5
  }
});
