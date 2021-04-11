import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Discover from '../screens/Discover';
import Profile from '../screens/Profile';
import Collective from '../screens/Collective';
import CacheImage from './../config/CacheImages'
import { View } from 'react-native-animatable';
import { getAudios } from '../config/service'
import AsyncStorage from '@react-native-community/async-storage';
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents } from 'react-native-track-player';
import _ from 'lodash'

const { width, height } = Dimensions.get('window')

const Tab = createBottomTabNavigator();

function Tabs({ navigation }) {

  const [playing, setPlaying] = useState(false)
  const [data, setData] = useState(false)
  const [audio, setAudio] = useState('')
  const [toggleBottom, setToggleBottom] = useState(true)
  const events = [
    TrackPlayerEvents.PLAYBACK_STATE,
    TrackPlayerEvents.PLAYBACK_ERROR
  ];
  useTrackPlayerEvents(events, async (event) => {
    // console.log(event)
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occurred while playing the current track.');
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      // setState(playbackState)
      if (event.state == 6 || event.state == 7) {
        // setFetching(true)
      } else if (event.state == 2 || event.state == 1 || event.state == 5 || event.state == 4) {
        setToggleBottom(false)
        // setFetching(false)
      } else if (event.state == 3) {
        setToggleBottom(true)
        // setFetching(false)
        const currentTrack = await TrackPlayer.getCurrentTrack()
        if (currentTrack != null) {
          const string = _.filter(data, item => {
            if (item.nid == currentTrack) {
              setPlaying(true)
              setAudio(item)
            }
          })
        }
      }
    }
  });

  useEffect(() => {
    TrackPlayer.addEventListener('playback-track-changed', async () => {
      setToggleBottom(true)
      // setFetching(false)
      const currentTrack = await TrackPlayer.getCurrentTrack()
      if (currentTrack != null) {
        const string = _.filter(data, item => {
          if (item.nid == currentTrack) {
            setPlaying(true)
            setAudio(item)
          }
        })
      }
    });

    getAudios().then(data => {
      setData(data)
    })
    checkPlayer()
  }, [])

  const checkPlayer = async () => {
    const status = await TrackPlayer.getState()
    // for the update, to show the current playing audio
    // status must be 3 to check if the player is playing and 2 if its idle or paused
    if (status == '3') {
      const track = await TrackPlayer.getCurrentTrack()
      const string = _.filter(data, item => {
        const id = item.nid
        if (track == id) {
          setPlaying(true)
          setAudio(item)
        }
      })
    }
  }

  const stopSound = () => {
    TrackPlayer.pause();
    setToggleBottom(false)
  }


  const playSound = () => {
    TrackPlayer.play();
    setToggleBottom(true)
  }

  return (
    <>
      <>
        <Tab.Navigator
          initialRouteName="Collective"
          tabBarOptions={{
            inactiveTintColor: 'gray',
            activeTintColor: '#8f5ba6',
            showLabel: false,
            tabStyle: {
              backgroundColor: '#fff',
              height: 60,
              paddingBottom: 12,
              elevation: 15
            },
          }}>
          <Tab.Screen
            name="Collective"
            component={Collective}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <>
                  <Icon
                    name={focused ? 'compass' : 'compass-outline'}
                    size={28}
                    color={color}
                  />
                  <Text style={{ color: 'grey', fontFamily: 'Tajawal-Regular', }}> {'إستكشف'} </Text>
                </>
              ),
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <>
                  <Icon
                    name={focused ? 'home' : 'home-outline'}
                    size={28}
                    color={color}
                  />
                  <Text style={{ color: 'grey', fontFamily: 'Tajawal-Regular', }}> {'الرئيسية'} </Text>
                </>
              ),
            }}
          />
          <Tab.Screen
            name="Discover"
            component={Discover}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <>
                  <Icon
                    name={focused ? 'file-search' : 'file-search-outline'}
                    size={28}
                    color={color}
                  />
                  <Text style={{ color: 'grey', fontFamily: 'Tajawal-Regular', }}> {'إبحث'} </Text>
                </>
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <>
                  <Icon
                    name={focused ? 'account' : 'account-outline'}
                    size={28}
                    color={color}
                  />
                  <Text style={{ color: 'grey', fontFamily: 'Tajawal-Regular', }}> {'البروفايل'} </Text>
                </>
              ),
            }}
          />
        </Tab.Navigator>
      </>
      {playing ? (
        <View style={{ backgroundColor: '#fff', height: 50, elevation: 5, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
            {/* <TouchableOpacity onPress={() => { setPlaying(false) }} style={[styles.iconBack, { backgroundColor: '#FFF' }]}>
              <Icon name='close' color='#888' size={15} />
            </TouchableOpacity> */}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { TrackPlayer.skipToPrevious() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                <Icon name='skip-backward' color='#444' size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { toggleBottom ? stopSound() : playSound() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                <Icon name={toggleBottom ? 'pause' : 'play'} color='#444' size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { TrackPlayer.skipToNext() }} style={[styles.iconBack, { backgroundColor: '#fff' }]}>
                <Icon name='skip-forward' color='#444' size={15} />
              </TouchableOpacity>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.songtitle}>{audio.title}</Text>
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate('PlayerComponent', { item: audio }) }}>
              <View style={[styles.imgBack, { backgroundColor: '#e3e3e3' }]}>
                <Image source={{ uri: 'https://s.alrqi.net' + audio.field_image }} style={styles.img} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
}

export default Tabs;

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
  dataContainer: {
    paddingHorizontal: 10,
    width: width - 160,
    // backgroundColor: 'red',
    justifyContent: "center"
  },
  songtitle: {
    // backgroundColor: 'red',
    maxHeight: 20,
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#444',
    marginBottom: 3
  }
});
