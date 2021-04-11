import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Surface } from 'react-native-paper';
import { getAudios } from '../config/service'
import { download } from './../config/service'
//import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash'
import CacheImage from './../config/CacheImages'
import RNFetchBlob from 'rn-fetch-blob'

const { width, height } = Dimensions.get('window');

export class SOngData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      audio: null,
      liked: false,
      completeData: this.props.songs,
      searchKey: this.props.searchKey,
      item: this.props.item,
      downdloaded : false
    };
  }
  componentDidMount = async () => {
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
    // handle downdloads
    this.handleDownloads() 
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

  async handleDownloads() {
    try {
      const files = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir + '/LibAud/');
      files.forEach(element => {
        const item = this.props.item
        if (element !== 'Cache') {
          if (item.title.match(element.replace('.mp3', ''))) {
            this.setState({
              downdloaded: true,
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
      songStyle = "#FFF"
    } else {
      songStyle = "#fff"
    }
    let image = null
    if (!item.field_image[0] == [] || !item.field_image == null) {
      image = <CacheImage url={item.field_image} name={item.title + '.jpg'} style={styles.img} />
    }
    return (
      <View style={{ width: '90%', flex: 1, alignSelf: 'center', backgroundColor: songStyle, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginVertical: 5, elevation: 5 }}>
        <Modal
          transparent={true}
          onBackdropPress={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}
          onRequestClose={() => this.closeModal()}
          visible={this.state.modalVisible}
          animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
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
                      return this.playSong(item)
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
                {/* <TouchableOpacity>
                  <View style={styles.option}>
                    <Icon name="album" size={30} color="#5D3F6A" />
                    <Text style={styles.text}>Create Album</Text>
                  </View>
                </TouchableOpacity> */}
                {this.state.downdloaded ? null : 
                (<TouchableOpacity onPress={() => download("https://s.alrqi.net" + this.state.item.field_audio, item.title + ".mp3")}>
                  <View style={styles.option}>
                    <Icon name="download" size={30} color="#5D3F6A" />
                    <Text style={styles.text}>Download</Text>
                  </View>
                </TouchableOpacity>)}
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
                onPress={() => { this.state.downdloaded ? null : download("https://s.alrqi.net" + this.state.item.field_audio, item.title + ".mp3")}}>
                <Icon
                  name={this.state.downdloaded ? "music-off" : 'download-outline'}
                  color={this.state.downdloaded ? "grey" : "grey"}
                  size={25}
                />
              </TouchableOpacity>)}
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.songtitle}>{item.title}</Text>
              <Text style={styles.subTitle}>{item.field_music_band}</Text>
            </View>
            {/* <Text style={styles.songtitle}>{" -" + index}</Text> */}
            <View style={[styles.imgBack, { backgroundColor: '#5D3F6A' }]}>
              <CacheImage url={item.field_image} name={item.title + '.jpg'} style={styles.img} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class SongsComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: true,
      searchKey: "",
      completeData: []
    }
  }

  componentDidMount() {
    this.setAudios()
    const navigation = this.props.navigation
    navigation.addListener('focus', () => {
      console.log('the home component is focused')
      this.setAudios()
    })
  }

  setAudios(){
    getAudios().then(data => {
      if (!this.props.item) {
        this.setState({
          isLoading: false,
          data: data,
          completeData: data
        })
      } else {
        this.setState({
          isLoading: false,
          // data: data,
          completeData: data
        })
        if (this.props.page == 'band') {
          this.handleBand(this.props.item.name)
        } else if (this.props.page == 'albums') {
          this.handleAlbums(this.props.item.name)
        } else if (this.props.page == 'category') {
          this.handleCats(this.props.item.name)
        } else if (this.props.page == 'profile') {
          this.handleDownloads(this.props.item)
        } else if (this.props.page == 'playlists') {
          // console.log(this.props.item)
          this.handlePlaylists(this.props.item)
        } else if (this.props.page == 'favorite') {
          this.setState({ data: this.props.item })
        } else if (this.props.page == 'discover') {
          this.handleSearch(this.props.searchKey)
        } else {
          // this.setState({ data: data })
        }
      }
    }
    )
  }

  handleBand(text) {
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

  handleDownloads(text) {
    let count = 0
    // console.log(text._55)
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    const data = _.filter(this.state.completeData, item => {
      const title = item.title
      formatedQuery._55.forEach(element => {
        if (element !== 'Cache') {
          if (title.match(element.replace('.mp3', ''))) {
            // console.log(element.replace('.mp3', ''))
            filtered.push(item)
            count++
            return true
          }
        }
      });
      return false
    })
    this.setState({ data: filtered, query: text })
  }

  handlePlaylists(text) {
    let count = 0
    // console.log(text._55)
    const formatedQuery = text
    let string = '[]'
    let filtered = JSON.parse(string)
    let object = formatedQuery._55.toString()
    // console.log('****************************************')
    // console.log(object.trim())
    const data = _.filter(this.state.completeData, item => {
      const audio = item.field_audio
      if (object.includes(audio)) {
        filtered.push(item)
        count++
        return true
      }
      return false
    })
    this.setState({ data: filtered, query: text })
  }


  async handleSearch(text) {
    if(text == ""){
      this.setState({
        data :{}
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

  getItemLayout = (data, index) => {
    return {
      index,
      length: 70, // itemHeight is a placeholder for your amount
      offset: index * 70,
    }
  }

  view(){
    let track = '[]'
    let tracks = JSON.parse(track)
    const { data } = this.state
    let view = this.state.isLoading ? (
      <View style={{ alignItems: "center" }} >
        <ActivityIndicator animating={this.state.isLoading} />
        <Text style={{ marginTop: 10 }}> {'انتظر من فضلك ...'} </Text>
      </View>
    ) : this.state.data == '' && this.props.page != 'discover' ? (<View style={{ alignItems: "center" }}><Text> {'هذة الجزئية خالة من الصوتيات ..!'} </Text></View>) : (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={200}
        updateCellsBatchingPeriod={200}
        getItemLayout={this.getItemLayout}
        disableVirtualization={true}
        renderItem={({ item, index }) => {
          this.shouldComponentUpdate = () => {
            return false
          }
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
              // console.log("an error");
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
              songs={this.state.data}
              navigation={this.props.navigation}
              searchKey={this.state.searchKey} />
          );
        }}
      />
    );
    return view
  }
  render() {

    if (this.state.searchKey != this.props.searchKey) {
      this.setState({ searchKey: this.props.searchKey })
      this.handleSearch(this.props.searchKey)
    }

    return (
      <View style={styles.container}>
        {/* {this.props.noTitle ? null : (<Text style = {styles.title}>Songs</Text>)} */}
        {this.view()}
      </View>
    );
  }
}

export default SongsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  songContainer: {
    height: 60,
  },
  imgBack: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 5
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  dataContainer: {
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
    elevation: 15,
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
});
