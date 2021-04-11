import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ToastAndroid,
  Platform,
  AlertIOS,
  ActivityIndicator
} from 'react-native';
import { PlayControl } from './../config/service'
import CacheImage from './../config/CacheImages'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents } from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob'
import { useFocusEffect } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage';
import { download } from './../config/service'
import _ from 'lodash'

function PlayerComponent({ item, navigation }) {
  // const { item } = route.params
  // const [data , setData] = useState('')
  const [textInput, setTextInput] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [value, setvValue] = useState(0.0)
  // const [maxValue, setMaxValue] = useState(0.0)
  const [audio, setAudio] = useState(item)
  const [played, setPlayed] = useState(false)
  const [skiped, setSkiped] = useState(false)
  const [toggleBottom, setToggleBottom] = useState(false)
  const [connected, setConnected] = useState(false)
  const [tracks, setTracks] = useState([])
  const [modalVisiblibility, setModalVisiblibility] = useState(false)
  const [playlists, setPlaylists] = useState(JSON.parse('[]'))
  const [playlist, setPlaylist] = useState(null)
  const [liked, setLiked] = useState(false)
  const [image, setImage] = useState("https://s.alrqi.net" + item.field_image)
  const [playerState, setState] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const events = [
    TrackPlayerEvents.PLAYBACK_STATE,
    TrackPlayerEvents.PLAYBACK_ERROR
  ];
  useTrackPlayerEvents(events, async(event) => {
    // console.log(event)
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occurred while playing the current track.');
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      // setState(playbackState)
      if(event.state == 6 || event.state == 7){
        setFetching(true)
      } else if (event.state == 2 || event.state == 1 || event.state == 5 || event.state == 4){
        setToggleBottom(false)
        setFetching(false)
      }else if (event.state == 3){
        setToggleBottom(true)
        setFetching(false)
        const currentTrack = await TrackPlayer.getCurrentTrack()
        if (currentTrack != null) {
          tracks.forEach(element => {
            if (element.id == currentTrack) {
              let newest = {
                nid: element.id,
                field_audio: element.url,
                field_image: element.artwork,
                field_music_band: element.artist,
                title: element.title
              }
              // console.log(element)
              setImage(element.artwork)
              setAudio(newest)
            }
          });
        }
        fav()
        handleDownloads()
      }
    }
  });
  useLayoutEffect(() => {
    connect()
    started()
    fav()
    handleDownloads()
    TrackPlayer.addEventListener('playback-track-changed', async() => {
      // console.log("the track has been changed")
      const currentTrack = await TrackPlayer.getCurrentTrack()
        if (currentTrack != null) {
          tracks.forEach(element => {
            if (element.id == currentTrack) {
              let newest = {
                nid: element.id,
                field_audio: element.url,
                field_image: element.artwork,
                field_music_band: element.artist,
                title: element.title
              }
              // console.log(element)
              setImage(element.artwork)
              setAudio(newest)
            }
          });
        }
        fav()
        handleDownloads()
    });

    TrackPlayer.addEventListener('remote-play', () => {
      TrackPlayer.play()
    })

    TrackPlayer.addEventListener('remote-pause', () => {
      TrackPlayer.pause()
    });

    TrackPlayer.addEventListener('remote-next', () => {
      TrackPlayer.skipToNext()
    });

    TrackPlayer.addEventListener('remote-previous', () => {
      TrackPlayer.skipToPrevious()
    });
    handleDownloads()
  }, [])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     skipToNext();
  //     skipToPrevious();
  //   }, []),
  // );

  const handleDownloads = async() => {
    try {
      const files = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir + '/LibAud/');
      files.forEach(element => {
        if (element !== 'Cache') {
          if (audio.title.match(element.replace('.mp3', ''))) {
              setDownloaded(true)
          }
        }
      })
      // console.log(files)
    } catch (error) {
      console.log(error);
    }
  }

  const started = async () => {
    const playerState = await TrackPlayer.getState()
    // console.log('playerState')
    // console.log(playerState)
    if (playerState == '3') {
      const currentTrack = await TrackPlayer.getCurrentTrack()
      if (currentTrack == item.nid) {
        setPlayed(true)
        setToggleBottom(true)
      }
    }

    const value1 = await AsyncStorage.getItem('tracks');
    if (value1 !== null) {
      // We have data!!
      let result = JSON.parse(value1)
      setTracks(result)
      // console.log(result)
      result.forEach(element => {
        if (element.id == item.nid) {
          AsyncStorage.setItem('audio', JSON.stringify(element))
        }
      });
    }
  }

  const connect = async () => {
    NetInfo.addEventListener( async state => {
      if (state.isConnected) {
        setConnected(true)
      }
    });
  }

  const showPlaylists = async () => {
    let result = ''
    const value1 = await AsyncStorage.getItem('playlists');

    const playlistPress = async (item) => {
      let playlist1 = item.item.playlist
      const value1 = await AsyncStorage.getItem(playlist1)
      let current = JSON.parse(`[${value1}]`)
      current.push(item)
      AsyncStorage.removeItem(playlist1)
      AsyncStorage.setItem(playlist1, JSON.stringify(current))
      if (Platform.OS === 'android') {
        ToastAndroid.show('added to playlist', ToastAndroid.SHORT)
      } else {
        AlertIOS.alert('added to playlist');
      }
      closeModal()
    }

    if (value1 !== null) {
      result = JSON.parse(value1)
      setPlaylists(result)
      setPlaylist(
        <FlatList
          data={result}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={(item, index) => {
            // AsyncStorage.removeItem('playlists')
            return (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => playlistPress(item)}
                  style={
                    {
                      flexDirection: 'row',
                      direction: 'rtl',
                      justifyContent: 'center',
                      backgroundColor: '#eeeeee',
                      width: '80%',
                      borderRadius: 3,
                      marginBottom: 5
                    }
                  } >
                  <Text style={{ fontFamily: 'Tajawal-Regular', }}> {item.item.playlist} </Text>
                  <Icon name='playlist-music' size={20} color='#000' />
                </TouchableOpacity>
              </View>
            )
          }}
        />
      )
    }
    // console.log(playlist)
  }

  const openModal = async () => {
    setModalVisiblibility(true)
    showPlaylists()
  };

  const onChangeText = (text) => {
    setTextInput(text)
  }


  const saveAsLiked = async () => {
    // AsyncStorage.removeItem('liked')
    try {
      let value1 = await AsyncStorage.getItem('liked');
      if (value1 != null) {
        // console.log(audio)
        let string = JSON.stringify(audio)
        let result = `${value1},${string}`
        AsyncStorage.setItem('liked', result)
      }
      else {
        AsyncStorage.setItem('liked', JSON.stringify(audio))
      }
      setLiked(true)
    } catch (error) {
      console.log(error)
    }
  }


  const addToPlaylist = () => {
    let string = textInput
    if (string != [] || string != '') {
      // converting the textinput into json
      let stringItem = JSON.stringify(audio)
      // pushing the song item to the playlist(textinput)
      let emptyString = `{"playlist":"${string}"}`
      let playlist1 = JSON.parse(emptyString)

      let playlists1 = playlists
      playlists1.push(playlist1)
      AsyncStorage.setItem('playlists', JSON.stringify(playlists1))
      AsyncStorage.setItem(string, `${stringItem}`)
      if (Platform.OS === 'android') {
        ToastAndroid.show('added to playlist', ToastAndroid.SHORT)
      } else {
        AlertIOS.alert('added to playlist');
      }
      closeModal()
    }
  }

  const closeModal = () => {
    setModalVisiblibility(false)
  };

  const playSoundOffline = async () => {
    const { fs } = RNFetchBlob;
    let LibAudDir = fs.dirs.DownloadDir + "/LibAud/";
    RNFetchBlob.fs.exists(LibAudDir + audio.title + ".mp3")
      .then((exist) => {
        // console.log("does the file exists ? : " + exist)
        if (!exist) {
          return Alert.alert('لم تقم بتحميل المقطع الصوتي الرجاء الاتصال بالانترنت والمحاولة مرة اخرى!')
        }
      })
      .catch((err) => { console.log(err) })

    const start = async () => {
      // Set up the player
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: true,
        icon: require('./../Assets/LibAud.png'),
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ]
      });
      // Add a track to the queue
      await TrackPlayer.add({
        id: audio.nid,
        url: "file://" + LibAudDir + audio.title + ".mp3",
        title: audio.field_music_band,
        artist: audio.title,
        artwork: "https://s.alrqi.net" + audio.field_image
      });

      // Start playing it
      await TrackPlayer.play();
    };

    played ? TrackPlayer.play() : start()
    setToggleBottom(true)
    setPlayed(true)
    try {
      let value3 = await AsyncStorage.getItem('recent');
      if (value3 != null) {
        // console.log(audio)
        let string = JSON.stringify(audio)
        let result = `${value3},${string}`
        AsyncStorage.setItem('recent', result)
      }
      else {
        AsyncStorage.setItem('recent', JSON.stringify(audio))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const playSoundOnline = async () => {
    const start = async () => {
      // console.log('playing on line')
      // Set up the player
      TrackPlayer.reset()
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: true,
        icon: require('./../Assets/LibAud.png'),
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
        ]
      });
      // togglePlayback();

      // Add a track to the queue
      await TrackPlayer.add(tracks);
      TrackPlayer.skip(audio.nid)
      // Start playing it
      await TrackPlayer.play();
    };

    played ? TrackPlayer.play() : start()

    setToggleBottom(true)
    setPlayed(true)
    try {
      let value3 = await AsyncStorage.getItem('recent');
      if (value3 != null) {
        // console.log(audio)
        let string = JSON.stringify(audio)
        let result = `${value3},${string}`
        AsyncStorage.setItem('recent', result)
      }
      else {
        AsyncStorage.setItem('recent', JSON.stringify(audio))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const stopSound = () => {
    TrackPlayer.pause();
    setToggleBottom(false)
  }

  const skipToPrevious = async () => {
    setSkiped(true)
    TrackPlayer.skipToPrevious()
    const currentTrack = await TrackPlayer.getCurrentTrack()
    if (currentTrack != null) {
      tracks.forEach(element => {
        if (element.id == currentTrack) {
          let newest = {
            nid: element.id,
            field_audio: element.url,
            field_image: element.artwork,
            field_music_band: element.artist,
            title: element.title
          }
          // console.log(element)
          setImage(element.artwork)
          setAudio(newest)
        }
      });
    }
    fav()
    handleDownloads()
  }

  const skipToNext = async () => {
    setSkiped(true)
    TrackPlayer.skipToNext()
    const currentTrack = await TrackPlayer.getCurrentTrack()
    if (currentTrack != null) {
      tracks.forEach(element => {
        if (element.id == currentTrack) {
          let newest = {
            nid: element.id,
            field_audio: element.url,
            field_image: element.artwork,
            field_music_band: element.artist,
            title: element.title
          }
          // console.log(element.title)
          setImage(element.artwork)
          setAudio(newest)
        }
      });
    }
    fav()
    handleDownloads()
  }
  const fav = async () => {
    // console.log(audio.nid)

    let liked1 = await AsyncStorage.getItem('liked');
    if (liked1 != null) {
      let jsn = JSON.parse(`[${liked1}]`)
      for (var i = 0; i < jsn.length; i++) {
        var obj = jsn[i]
        if (obj.nid == audio.nid) {
          // console.log('inside if')
          if (liked != true) {
            setLiked(true)
            break
          }
          // break
        } else {
          // console.log('inside else')
          if (obj.nid != audio.nid) {
            if (liked != false) {
              setLiked(false)
            }
          }
        }
      }
    }
  }

  const checkImage = () => {
    if (skiped) {
      return (
        <Image source={{ uri: image }} style={styles.cover} />
      )
    } else {
      return (
        <CacheImage url={image} name={audio.title + '.jpg'} style={styles.cover} />
      )
    }
  }

  let toggleIcon = toggleBottom ? 'pause' : 'play'
  let heart = liked ? 'heart' : 'heart-outline'
  let downloading = downloaded ? "music-off" : 'download-outline'
  let color = liked ? 'red' : '#5D3F6A'
  let audioUrl = skiped ? audio.field_audio : "https://s.alrqi.net" + audio.field_audio
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        transparent={true}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        onRequestClose={() => closeModal()}
        visible={modalVisiblibility}
        animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={{ color: '#5D3F6A', fontSize: 18, fontFamily: 'Tajawal-Regular', }}>{'قوائم التشغيل'}</Text>
            <View style={[styles.modalData]}>
              {playlist}
              <View style={styles.divider}></View>
              <TextInput
                textAlign="center"
                style={styles.playlistInput}
                placeholder='اضف قائمة تشغيل'
                onChangeText={(text) => onChangeText(text)}
              />
              <TouchableOpacity style={styles.playlistBtn} onPress={() => addToPlaylist()}>
                <Text style={styles.playlistTxt}>{'اضافة'}</Text>
                <Icon name='playlist-plus' size={20} color='#fff' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", marginTop: 24 }}>
          {/* <Text style={[styles.textLight, { fontSize: 12 }]}>{item.field_categories}</Text> */}
          {/* <Text style={[styles.text, { fontSize: 15, fontWeight: '500', marginTop: 5 }]}>{item.field_album}</Text> */}
          <Text style={[styles.text, { fontSize: 15, fontWeight: '500', marginTop: 5 }]}>{'مكتبة الصوتيات'}</Text>
        </View>
        <View style={styles.coverContainer}>
          {checkImage()}
        </View>

        <View style={{ alignItems: "center", marginTop: 32, maxWidth: '80%', }}>
          <Text style={[styles.textDark, { fontSize: 20, textAlign: "center", maxHeight: 75 }]}>
            {audio.title}
          </Text>
          <Text style={[styles.text, { fontSize: 16, marginTop: 8, textAlign: 'center', maxHeight: 30 }]}>
            {audio.field_music_band}
          </Text>
        </View>
      </View>
      <View>
        <View style={{ marginHorizontal: 32, marginTop: '10%' }}>
          <View style={styles.rowIconsContainer}>
            <TouchableOpacity onPress={() => saveAsLiked()} style={[styles.rowIcons]}>
              <Icon name={heart} color={color} size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { downloaded ? null : download(audioUrl, audio.title + ".mp3")}}
              style={styles.rowIcons}>
              <Icon name={downloading} color="#5D3F6A" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openModal()}>
              <Icon name="playlist-plus" size={30} color="#5D3F6A" />
            </TouchableOpacity>
          </View>

          <PlayControl item={audio} />


        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() => { return skipToPrevious() }}>
            <Icon name="skip-backward" size={32} color="#93a8b3" />
          </TouchableOpacity>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                return toggleBottom ? stopSound() : connected ? playSoundOnline() : playSoundOffline()
              }}
              style={styles.playButtonContainer}>
              {fetching ? 
              (
                <ActivityIndicator color="#4444" size='small'/>
              ) :
              (
                  <Icon name = { toggleIcon } size = { 32 } color = "#3d425c" style = { [styles.playButton] } />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              return skipToNext()
            }}>
            <Icon name="skip-forward" size={32} color="#93a8b3" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PlayerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaec',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    color: '#8e97a6',
  },
  textLight: {
    fontFamily: 'Tajawal-Regular',
    color: '#b6b7bf',
  },
  modalContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    padding: 15,
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#e5e5e5',
    borderRadius: 20,
  },
  modalData: {
    marginTop: "1%",
  },
  playlistBtn: {
    marginTop: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#81c784',
    width: '50%',
    borderRadius: 3,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  playlistTxt: {
    fontFamily: 'Tajawal-Regular',
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 3
  },
  playlistInput: {
    fontFamily: 'Tajawal-Regular',
    marginTop: 10,
    textAlign: 'right',
    height: 40,
    borderColor: '#64b5f6',
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16
  },
  textDark: {
    fontFamily: 'Tajawal-Regular',
    color: '#3d425c',
  },
  coverContainer: {
    marginTop: '10%',
    width: 250,
    height: 250,
    shadowColor: '#5D3F6A',
    shadowOffset: { height: 15 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    borderRadius: 125,
    backgroundColor: '#5D3F6A',
    elevation: 25
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 125
  },
  rowIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginTop: '5%'
  },
  rowIcons: {
    marginRight: 30
  },
  track: {
    backgroundColor: "#FFF",
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3d425c"
  },
  timestamp: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 11,
    fontWeight: '500'
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  playButtonContainer: {
    backgroundColor: '#FFF',
    borderColor: "rgba(93, 63, 106, 0.2)",
    borderWidth: 8,
    width: 64,
    height: 64,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    shadowColor: "#5D3F6A",
    shadowRadius: 30,
    shadowOpacity: 0.5,
  },
  btnContainer: {
    width: 64,
    height: 64,
    borderColor: "rgba(93, 63, 106, 0.2)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    backgroundColor: '#5D3F6A',
    elevation: 5
  }
});
