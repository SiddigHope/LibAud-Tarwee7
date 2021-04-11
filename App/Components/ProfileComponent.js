import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator, FlatList, Dimensions, Linking, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Content, Accordion } from "native-base";
import { Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob'
import SongsComponent from './SongsComponent';
import CacheImage from './../config/CacheImages'
import AsyncStorage from '@react-native-community/async-storage';
import TrackPlayer from 'react-native-track-player'
import _ from 'lodash'
import { getAudios } from '../config/service'
import { download } from './../config/service'


const { width, height } = Dimensions.get('window');

export class SOngData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      audio: null,
      liked: false,
      completeData: this.props.songs,
      searchKey: this.props.searchKey,
      item: this.props.item,
      downloaded: false,

    };
  }
  componentDidMount = async () => {
    this.handleDownloads()

    try {
      let value = await AsyncStorage.getItem('liked');
      if (value != null) {
        let result = JSON.parse(value);
        result.forEach(element => {
          if (element.nid == this.props.item.nid) {
            this.setState({
              liked: true
            })
          }
        });
      }
      else {
        // do something else
      }
    } catch (error) {
      // Error retriev-ing data
    }
    const navigation = this.props.navigation
    navigation.addListener('focus', () => {
      this.setState(this.state)
    })
  }

  componentDidMount(){
    const navigation = this.props.navigation
    navigation.removeListener('focus', () => {
      this.setState(this.state)
    })
  }

  playSong = item => {
    this.props.navigation.navigate('PlayerComponent', { item: item, page: 'profile' });
  };

  async handleDownloads() {
    try {
      const files = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir + '/LibAud/');
      files.forEach(element => {
        const item = this.props.item
        if (element !== 'Cache') {
          if (item.title.match(element.replace('.mp3', ''))) {
            this.setState({
              downloaded: true,
            })
          }
        }
      })
      // console.log(files)
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    let item = this.state.item;
    let index = this.props.index + 1;
    var songStyle = null
    if (index % 2 == 0) {
      songStyle = "#1212"
    } else {
      songStyle = "#fff"
    }
    let image = null
    if (!item.field_image[0] == [] || !item.field_image == null) {
      image = <CacheImage url={item.field_image} name={item.title + '.jpg'} style={styles.img} />
    }
    return (
      <View style={{ backgroundColor: songStyle, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginBottom: 2 }}>
        <TouchableWithoutFeedback
          style={[styles.songContainer, { borderRadius: 10, }]}
          onPress={() => this.playSong(item)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={styles.iconContainer}>
              {this.props.page == 'profile' ? null : (<TouchableOpacity
                onPress={() => { this.state.downloaded ? null : download("https://s.alrqi.net" + this.state.item.field_audio, item.title + ".mp3") }}>
                <Icon
                  name={this.state.downloaded ? "music-off" : 'download-outline'}
                  color="gray"
                  size={20}
                />
              </TouchableOpacity>)}
            </View>
            <View style={styles.dataContainer1}>
              {/* <Text style={styles.subTitle}>{item.field_music_band}</Text> */}
              <Text style={styles.songtitle}>{item.title}</Text>
            </View>
            <View style={[styles.imgBack, { backgroundColor: '#5D3F6A' }]}>
              <CacheImage url={item.field_image} name={item.title + '.jpg'} style={styles.img} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: null,
      playlists: null,
      array: [],
      asignPlaylists: JSON.parse('[]'),
      playlist: null,
      data: [],
      isLoading: true,
      completeData: [],
      title: false,
    }
  }

  componentDidMount() {
    getAudios().then(data => {
      this.setState({
        isLoading: false,
        // data: data,
        completeData: data
      })
    })
    const navigation = this.props.navigation
    this.list = [
      navigation.addListener('focus', () => {
        this.getFavorite()
        this.getPlaylists()
      })
    ]
    this.getFavorite()
    this.getPlaylists()
  }

  componentWillUnmount() {
    const navigation = this.props.navigation
    navigation.removeListener('focus')
  }

  _flatlist = (data) => {

    let track = '[]'
    let tracks = JSON.parse(track)

    let view = this.state.isLoading ? (
      <View style={{ alignItems: "center" }} >
        <ActivityIndicator animating={this.state.isLoading} />
        <Text style={{ marginTop: 10 }}> {'انتظر من فضلك ...'} </Text>
      </View>
    ) : data == '' && this.props.page != 'discover' ? (<View style={{ alignItems: "center" }}><Text> {'هذة الجزئية خالة من الصوتيات ..!'} </Text></View>) : (

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          // adding tracks to queue
          tracks.push({
            id: item.nid,
            url: "https://s.alrqi.net" + item.field_audio,
            title: item.title,
            artist: item.field_music_band,
            artwork: "https://s.alrqi.net" + item.field_image
          });
          // finished adding the tracks            

          // saving tracks to async
          AsyncStorage.setItem('tracks', JSON.stringify(tracks), (err) => {
            if (err) {
              console.log("an error");
              throw err;
            }
            //console.log("success----------------------------");
          }).catch((err) => {
            console.log("error is: " + err);
          });
          // finish saving
          return (
            <SOngData
              item={item}
              index={index}
              page={this.props.page}
              navigation={this.props.navigation}
            />
          );
        }}
      />
    );

    return (
      <View style={styles.container}>
        <View style={{ padding: 10, paddingTop: 0 }}>
          {view}
        </View>
      </View>
    );
  }

  renderOption = (icon, name, count) => {
    return (
      <View style={styles.options}>
        <View style={styles.left}>
          <Icon name={icon} size={30} color="#000" />
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.left}>
          <Text style={styles.title}>{count}</Text>
          <Icon2
            name="ios-arrow-forward"
            size={30}
            color="gray"
            style={{ marginLeft: 20 }}
          />
        </View>
      </View>
    );
  };

  getFiles = async () => {
    let files = null
    try {
      files = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir + '/LibAud/');
      // console.log(files)
    } catch (error) {
      console.log(error);
    }
    return files
  }

  getFavorite = async () => {
    // AsyncStorage.removeItem('liked')
    let liked = await AsyncStorage.getItem('liked');
    if (liked != null) {
      // console.log('there is likes')
    } else {
      // console.log('No Likes ..')
    }
    this.setState({
      liked,
    })
  }


  async handlePlaylists(text) {

    const text1 = await this.getPlaylist(text)
    // console.log(text1)
    let count = 0
    const formatedQuery = text1
    // console.log(text1)
    let string = '[]'
    let filtered = JSON.parse(string)
    let object = formatedQuery.toString()
    const data = _.filter(this.state.completeData, item => {
      const audio = item.field_audio
      if (object.includes(audio)) {
        filtered.push(item)
        count++
        if (count == 0) {
          if (this.state.title) {
            this.setState({ data: [] })
            // console.log('********************************')
          }
        }
        return true
      }
      return false
    })
    this.setState({ data: filtered, title: true })
  }

  getPlaylists = async () => {
    let playlists = await AsyncStorage.getItem('playlists');
    if (playlists != null) {
      // console.log('there is likes')
      let array = '[]'
      let array1 = JSON.parse(array)
      const playlist = JSON.parse(playlists)
      const colected = _.filter(playlist, item => {
        array1.push({ title: item.playlist })
      })

      this.setState({ array: array1 })

    } else {
      // console.log('No Likes ..')
    }
  }
  getPlaylist = async (playlist) => {
    // AsyncStorage.removeItem(playlist)
    let playlists = await AsyncStorage.getItem(playlist);
    if (playlists != null) {
      let edited = playlists.replace('[', '').replace(']').replace('null,', '').replace('undefined', '')
      return edited
    } else {
      // console.log('No Likes ..')
    }
  }

  renderContent = (item, index) => {
    if (item.title == 'Playlists') {
      return (
        < Content padder>
          <Accordion
            dataArray={this.state.array}
            headerStyle={styles.title}
            icon="ios-arrow-forward"
            renderContent={(item, index) => this.renderContent(item, index)}
            expandedIcon="ios-arrow-down"
            iconStyle={{ color: "green" }}
            expandedIconStyle={{ color: "red" }}
          />
        </Content >
      )

    } else if (item.subTitle == 'Favorite') {
      let data = JSON.parse(`[${this.state.liked}]`)
      return this._flatlist(data)
      // return (
      //     <SongsComponent page={'favorite'} item={data} navigation={this.props.navigation} />
      // )
    } else if (item.subTitle == 'Downloads') {
      let array = this.getFiles()
      return (
        <SongsComponent page={'profile'} item={array} navigation={this.props.navigation} />
      )
    } else {
      const data = this.handlePlaylists(item.subTitle)
      // console.log(data)
      return this._flatlist(this.state.data)
    }
  };
  appLinkShare = () => {
    Linking.openURL("https://t.me/OkamelSound_bot")
  }
  render() {
    const dataArray = [
      { title : <Text style={[styles.title,{fontSize: 16}]}>{'المفضلة'}</Text> , subTitle: 'Favorite' },
      { title : <Text style={[styles.title,{fontSize: 16}]}>{'قوائم التشغيل'}</Text> , subTitle: 'Playlists' },
      { title : <Text style={[styles.title,{fontSize: 16}]}>{'تحميلاتي'}</Text> , subTitle: 'Downloads' },
    ]
    const gradiantHeight = 600
    const gradientBackground = '#8f5ba6'
    const data = Array.from({ length: gradiantHeight })
    return (
      <View style={styles.container}>
        <View style={styles.header}><Text style={[styles.title, { alignSelf: "center", color: '#e3e3e3', marginTop: 8}]}> {'مكتبة الصوتيات'}</Text></View>
        <TouchableOpacity onPress={() => this.appLinkShare()}>
          <Text style={[styles.title, { marginLeft: 20, marginTop: 10, fontSize: 16}]}>{'Telegram Bot'}</Text>
        </TouchableOpacity>
        <Content padder style={{ width: '100%' }}>
          <Accordion
            dataArray={dataArray}
            headerStyle={styles.title}
            icon="ios-arrow-forward"
            renderContent={(item, index) => this.renderContent(item, index)}
            expandedIcon="ios-arrow-down"
            iconStyle={{ color: "green" }}
            style={styles.title}
            expandedIconStyle={{ color: "red" }}
          />
        </Content>
        {/* {data.map((_, i) => (
          <View
            key={i}
            style={
              {
                position: 'absolute',
                backgroundColor: gradientBackground,
                height: 1,
                bottom: (gradiantHeight - i),
                right: 0,
                left: 0,
                zIndex: 2,
                opacity: (1 / gradiantHeight) * (i + 1)
              }
            }
          />
        ))} */}
      </View>
    );
  }
}

export default ProfileComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    // padding:20
  },
  header: {
    backgroundColor: '#5D3F6A',
    height: 50,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    // flexDirection: 'row',
  },

  surface: {
    height: 180,
    width: 180,
    borderRadius: 100,
    elevation: 15,
    overflow: 'hidden',
    marginBottom: 10
  },
  profile: {
    height: 180,
    width: 180,
    borderRadius: 100,
  },
  dataContainer: {
    // paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    color: '#888',
  },
  uname: {
    fontFamily: 'Tajawal-Regular',
    // fontWeight: 'bold',
    color: 'grey',
    fontSize: 18,
  },
  options: {
    height: 55,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 20,
    // marginLeft: 15,
  },
  //////////////////////////
  songContainer: {
    width: width,
    height: 60,
  },
  dataContainer1: {
    paddingLeft: 10,
    width: width - 160,
  },
  songtitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 15,
    color: '#000',
    marginTop: 5
  },
  subTitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
