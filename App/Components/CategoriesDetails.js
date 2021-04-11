import React, { PureComponent, Component } from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';
import { Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { download } from './../config/service'
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
import { getAudios } from '../config/service'
import TrackPlayer from 'react-native-track-player';
import CacheImage from './../config/CacheImages'
import _ from 'lodash'

// import CacheImage from './../config/CacheImages'
const Screen = Dimensions.get('window');
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
    // handle downloads
  }

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

  playSong = item => {
    this.setState({
      modalVisible: false,
    });

    this.props.navigation.navigate('PlayerComponent', { item: item });
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  saveAsLiked = async (item) => {
    try {
      let value = await AsyncStorage.getItem('liked');
      if (value != null) {
        AsyncStorage.mergeItem('liked', JSON.stringify(item))
      }
      else {
        AsyncStorage.setItem('liked', JSON.stringify(item))
      }
      this.setState({
        liked: true
      })
    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    let item = this.state.item;
    let index = this.props.index + 1;
    var songStyle = null
    if (index % 2 == 0) {
      songStyle = "#FFF"
    } else {
      songStyle = "#fff"
    }

    return (
      <View style={[styles.card, { borderRadius: 10, justifyContent: "center", alignItems: "center" }]}>
        <Modal
          transparent={true}
          onBackdropPress={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}
          onRequestClose={() => this.closeModal()}
          visible={this.state.modalVisible}
          animationType="slide">
          <View style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View style={styles.modal}>
              <Surface style={styles.surface}>
                <CacheImage url={"https://s.alrqi.net" + item.field_audio} name={item.title + ".jpg"} style={styles.modalImg} />
              </Surface>
              <View style={styles.modalData}>
                <View style={styles.playerContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subTitle}>{item.field_album}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      return this.playSong(item, songs)
                    }}
                    style={styles.btn}>
                    <Icon name="play" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.saveAsLiked(item)}>
                  <View style={styles.option}>
                    <Icon name="heart" size={30} color={this.state.liked ? "red" : "#5D3F6A"} />
                    <Text style={styles.text}>{this.state.liked ? "Added to faviorate" : "Add to faviorate"}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.option}>
                    <Icon name="playlist-plus" size={30} color="#5D3F6A" />
                    <Text style={styles.text}>Add To Playlist</Text>
                  </View>
                </TouchableOpacity>
                {this.state.downloaded?
                null
                :
                  (
                    <TouchableOpacity onPress={() => download("https://s.alrqi.net" + this.state.item.field_audio, item.title + ".mp3")}>
                      <View style={styles.option}>
                        <Icon name="download" size={30} color="#5D3F6A" />
                        <Text style={styles.text}>Download</Text>
                      </View>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </View>
        </Modal>

        <TouchableWithoutFeedback
          style={[styles.songContainer, { borderRadius: 10 }]}
          onPress={() => this.playSong(item)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.iconContainer}>
              {/* shows the modal */}
              {/* <TouchableOpacity onPress={() => this.openModal()}>
                <Icon name="dots-vertical" color="gray" size={30} />
              </TouchableOpacity> */}
              {this.props.page == 'profile' ? null : (<TouchableOpacity
                onPress={() => { this.state.downloaded ? null : download("https://s.alrqi.net" + this.state.item.field_audio, item.title + ".mp3")}}>
                <Icon
                  name={this.state.downloaded ? "music-off" : 'download-outline'}
                  color="gray"
                  size={25}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>)}
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.songtitle}>{item.title}</Text>
            </View>
            {/* <Text style={styles.songtitle}>{" -" + index}</Text> */}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class CategoriesDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      scrollY: new Animated.Value(0),
      dataSource: ['its one1', 'its one2', 'its one3', 'its one4', 'its one5', 'its one'],
      data: null,
      isLoading: false,
      completeData: null,
      toggleBottom: false,
      audio: '',
      playing: '',
    }
  }

  componentDidMount() {
    let page = this.props.route.params.page
    let rec = this.props.route.params.item
    getAudios().then((data) => {
      if (page != null) {
        const loaded = data
        this.setState({
          completeData: loaded,
          isLoading: false,
        })
        if (page == 'band') {
          let name = rec.name
          this.handleBand(name)
        } else if (page == 'albums') {
          let name = rec.name
          this.handleAlbums(name)
        } else if (page == 'category') {
          let name = rec.name
          this.handleCats(name)
        }
      }
    })
    this.checkPlayer()
  }

  handleBand(text) {
    // console.log('entered')
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    const data = _.filter(this.state.completeData, item => {
      const title = item.field_music_band
      if (title.match(formatedQuery)) {
        filtered.push(item)
        return true
      }
      return false
    })
    this.setState({ data: filtered, query: text })
  }

  handleAlbums(text) {
    // this.setState({ completeData: this.state.data })
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    const data = _.filter(this.state.completeData, item => {
      const title = item.field_album
      if (title.match(formatedQuery)) {
        filtered.push(item)
        return true
      }
      return false
    })
    this.setState({ data: filtered, query: text })
  }

  handleCats(text) {
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    const data = _.filter(this.state.completeData, item => {
      const title = item.field_categories
      if (title.match(formatedQuery)) {
        filtered.push(item)
        return true
      }
      return false
    })
    this.setState({ data: filtered, query: text })
  }


  checkPlayer = async () => {
    const status = await TrackPlayer.getState()
    // for the update, to show the current playing audio
    // status must be 3 to check if the player is playing and 2 if its idle or paused
    if (status == '3') {
      const track = await TrackPlayer.getCurrentTrack()

      const string = _.filter(this.state.data, item => {
        const id = item.nid
        if (id == track) {
          this.setState({
            playing: true,
            audio: item
          })
        }
      })
    }
    setInterval(async () => {
      const status = await TrackPlayer.getState()
      // for the update, to show the current playing audio

      // status must be 3 to check if the player is playing and 2 if its idle or paused
      if (status == '3') {
        const track = await TrackPlayer.getCurrentTrack()
        const string = _.filter(this.state.data, item => {
          const id = item.nid
          if (id == track) {
            this.setState({
              playing: true,
              audio: item
            })
          }
        })
      }
    }, 1000)
  }

  stopSound = () => {
    TrackPlayer.pause();
    this.setState({
      toggleBottom: false
    })
  }


  playSound = () => {
    TrackPlayer.play();
    this.setState({
      toggleBottom: true
    })
  }

  CacheImage = (url, name) => {
    // console.log('url')
    // console.log(url)
    const { fs } = RNFetchBlob;
    let Cache = fs.dirs.DownloadDir + "/LibAud/Cache/";
    RNFetchBlob.fs.exists(Cache + name)
      .then((exist) => {
        // console.log("does the file exists ? : " + exist)
        if (!exist) {
          const { config, fs } = RNFetchBlob;
          let LibAudDir = fs.dirs.DownloadDir + "/LibAud/Cache/";
          let options = {
            fileCache: true,
              path: LibAudDir + name,
          };
          config(options)
            .fetch('GET', url)
            .then(res => {
              if (res.data) {
                // console.log(res.path())
                this.setState({
                  source: { uri: 'file://' + res.path() }
                })
              } else {
                alert(('Cache Failed'));
              }
            });
          // console.log(this.state.source)

        } else {
          // if exists we disply the image from the storage
          this.setState({
            source: { uri: url }
          })
          // console.log(this.state.source)
        }
      })
      .catch((err) => { console.log(err) })
  }
  render() {
    // console.log(this.state.data)
    let data = this.props.route.params.item
    if (!data.image == '' || !data.image == null) {
      const url ='https://s.alrqi.net' + data.image
      const dynamic = data.name + '.jpg'
      this.CacheImage(url, dynamic)
    } else {
      this.setState({
        source: require('./../Assets/appLogo.png')
      })
    }

    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.backgroundImage, {
            opacity: this.state.scrollY.interpolate({
              inputRange: [0, 250],
              outputRange: [1, 0]
            }),
            transform: [{
              scale: this.state.scrollY.interpolate({
                inputRange: [-200, 0, 1],
                outputRange: [1.4, 1, 1]
              })
            }]
          }]}
          source={this.state.source}
        />
        {this.state.data? 
          (<FlatList
            data={this.state.data}
            renderItem={(item, index) => this.renderRow(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => this.renderEmpty()}
            ListHeaderComponent={(item) => this.renderHeader(item)}
            renderScrollComponent={(item) => this.renderScroll(item)}
          />) 
        :
          (<ActivityIndicator style={{ marginTop: Screen.width / 900 * 900}} animating color='#e3e3e3' size='large'/>)}
        {this.state.playing ? (
          <View style={{ backgroundColor: '#fff', height: 50, elevation: 5, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
              {/* <TouchableOpacity onPress={() => { setPlaying(false) }} style={[styles.iconBack, { backgroundColor: '#FFF' }]}>
                <Icon name='close' color='#888' size={15} />
              </TouchableOpacity> */}
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { TrackPlayer.skipToPrevious() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                  <Icon name='skip-backward' color='#444' size={15} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.state.toggleBottom ? this.stopSound() : this.playSound() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                  <Icon name={this.state.toggleBottom ? 'pause' : 'play'} color='#444' size={15} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { TrackPlayer.skipToNext() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                  <Icon name='skip-forward' color='#444' size={15} />
                </TouchableOpacity>
              </View>
              <View style={styles.dataContainer1}>
                <Text style={styles.songtitle1}>{this.state.audio.title}</Text>
              </View>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlayerComponent', { item: this.state.audio }) }}>
                <View style={[styles.imgBack, { backgroundColor: '#e3e3e3' }]}>
                  <Image source={{ uri: 'https://s.alrqi.net' + this.state.audio.field_image }} style={styles.img} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {/* <SongsCOmponent item={data} page={this.props.route.params.page} noTitle={true} navigation={this.props.navigation} /> */}
      </View>
    );
  }
  renderEmpty() {
    return (
      <>
        <View style={{ alignSelf: "center", backgroundColor: '#ff5b77', borderColor: '#e3e3e3', width: width - 50, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: "center", paddingVertical: 20 }}>
          <Text style={{ fontFamily: 'Tajawal-Regular', fontSize: 18, color: '#e3e3e3' }} >{'لا توجد صوتيات في هذة الجزئية'}</Text>
        </View>
      </>
    )
  }

  renderRow(item, index) {
    return (
      <SOngData
        item={item.item}
        index={item.index}
        songs={this.state.data}
        page={this.props.page}
        navigation={this.props.navigation}
      />
    );
  }
  renderHeader() {
    return (
      <>
        <View style={styles.header} />
        {/* <Text style={styles.title}> {'vnhdfbv'} </Text> */}
      </>
    )
  }
  renderScroll(props) {
    return (
      <Animated.ScrollView
        {...props}
        scrollEventThrottle={16}
        onScroll={
          Animated.event([{
            nativeEvent: { contentOffset: { y: this.state.scrollY } }
          }], {
            useNativeDriver: true
          })
        }
      />
    );
  }
}

export default CategoriesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  backgroundImage: {
    width: Screen.width,
    height: Screen.width / 750 * 800,
    position: 'absolute',
  },
  img: {
    height: '100%',
    width: '100%',
    // alignItems: "center",
    justifyContent: "flex-end",
  },

  title: {
    margin: 10,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 40
    // alignSelf: 'center',
  },
  playContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingTop: 10,
  },
  text: {
    fontSize: 24,
    marginRight: 20,
    color: '#000',
  },
  btn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#ff5b77',
    elevation: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2: {
    fontSize: 18,
    color: '#333333',
    margin: 10,
    fontWeight: 'bold',
  },
  header: {
    height: Screen.width / 1000 * 900,
    marginBottom: 10
  },
  card: {
    width: '90%',
    backgroundColor: '#FFF',
    height: 70,
    marginBottom: 5,
    borderRadius: 15,
    elevation: 5,
    alignSelf: 'center',
    shadowColor: '#606060',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.5
  },
  cardTitle: {
    color: 'black',
    fontSize: 30
  },
  songContainer: {
    width: width,
    height: 70,
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 5,
  },
  dataContainer: {
    paddingLeft: 10,
    width: width - 100,
  },
  dataContainer1: {
    paddingLeft: 10,
    width: width - 160,
  },
  songtitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 15,
    color: '#444',
    marginTop: 5
  },
  subTitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#4444',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    height: '55%',
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  modalImg: {
    height: 180,
    width: 180,
  },
  surface: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: -100,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 90,
    elevation: 15
  },
  modalData: {
    marginTop: "23%",
  },
  option: {
    height: 50,
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    marginLeft: 15,
    color: '#000',
    fontSize: 20,
  },
  playerContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#5D3F6A',
    elevation: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    textAlign: "center",
    // fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
    marginLeft: 15,
  },
  imgBack: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconBack: {
    marginHorizontal: 5,
    height: 20,
    width: 20,
    borderRadius: 10,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  songtitle1: {
    // backgroundColor: 'red',
    maxHeight: 20,
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#444',
    marginBottom: 3
  }
});
