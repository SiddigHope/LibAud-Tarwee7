import React, { useState, useEffect, Component } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import {
    PermissionsAndroid,
    ToastAndroid,
    AlertIOS,
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Modal,
    Dimensions,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native'
import TrackPlayer, { useTrackPlayerProgress, useTrackPlayerEvents, TrackPlayerEvents, STATE_PLAYING } from 'react-native-track-player';
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage';
import { Slider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CacheImage from './../config/CacheImages'

const {width, height} = Dimensions.get('window') 
let connected = null;

NetInfo.addEventListener(state => {
    connected = state.isConnected
});

const events = [
    TrackPlayerEvents.PLAYBACK_STATE,
    TrackPlayerEvents.PLAYBACK_ERROR
];
export const PlayControl = (item) => {
    const [playerState, setState] = useState(null)
    const [check, setCheck] = useState(0)
useEffect(() => {
},[])
    useTrackPlayerEvents(events, async (event) => {
        if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
            Alert.alert('حدث حطأ اثناء تشغيل المقطع, تأكد من الاتصال بالانترنت');
        }
        if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
            const isPlaying = playerState === STATE_PLAYING;
            // console.log('isPlaying')
            // console.log(isPlaying)
        }
    });

    const { position, duration} = useTrackPlayerProgress()
    const checkTrack = async() => {
        const playerState = await TrackPlayer.getState()
        // console.log('playerState')
        if (playerState == '3') {
            const currentTrack = await TrackPlayer.getCurrentTrack()
            // console.log(item.item.nid)
            // console.log(currentTrack)
            if (currentTrack != item.item.nid) {
                setCheck(0)
            }else{
                setCheck(position)
            }
        }
    }

    checkTrack()

    
    function millisToMinutesAndSeconds(millis) {
        parseInt(millis)
        var ms = millis;
        ms = 1000 * Math.round(ms / 1000); // round to nearest second
        var d = new Date(ms)
        return d.getUTCMinutes() + ':' + d.getUTCSeconds() // "4:59"
    }
    let sDuration = String(duration)
    let sPosition = String(position)

    const changeTime = seconds => {
        TrackPlayer.seekTo(seconds)
    }

    return (
        <>
            <Slider
                minimumValue={0}
                value={check}
                maximumValue={duration}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor='#93a8b3'
                onValueChange={seconds => changeTime(seconds)}
            />
            <View style={{ marginTop: -12, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.textLight, styles.timestamp]}>
                    {check == 0 ? '' : millisToMinutesAndSeconds(sPosition.replace('.', ''))}
                </Text>
                <Text style={[styles.textLight, styles.timestamp]}>
                    {check == 0 ? '' : millisToMinutesAndSeconds(sDuration.replace('.', ''))}
                </Text>
            </View>
        </>
    )
}

export async function getAudios() {
    let result = null;
    if (connected) {
        try {
            let audios = await fetch("https://s.alrqi.net/api/1.0/sound?items_per_page=All", {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            })
            result = await audios.json();
            AsyncStorage.setItem('audios', JSON.stringify(result), (err) => {
                if (err) {
                    // console.log("an error");
                    throw err;
                }
                // console.log("success");
            }).catch((err) => {
                console.log("error is: " + err);
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    } else {
        try {
            const value = await AsyncStorage.getItem('audios');
            if (value !== null) {
                // We have data!!
                result = JSON.parse(value)
                console.log('the restored data is');
                return result;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

}

export async function getBand() {
    let result = null;
    if (connected) {
        try {
            let audios = await fetch("https://s.alrqi.net/api/1.0/band", {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            })
            result = await audios.json();
            AsyncStorage.setItem('music_band', JSON.stringify(result), (err) => {
                if (err) {
                    // console.log("an error");
                    throw err;
                }
                // console.log("success");
            }).catch((err) => {
                console.log("error is: " + err);
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    } else {
        try {
            const value = await AsyncStorage.getItem('music_band');
            if (value !== null) {
                // We have data!!
                result = JSON.parse(value)
                console.log('the restored data is');
                return result;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

}

export async function getCategories() {
    let result = null;
    if (connected) {
        try {
            let audios = await fetch("https://s.alrqi.net/api/1.0/category", {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            })
            result = await audios.json();
            AsyncStorage.setItem('categories', JSON.stringify(result), (err) => {
                if (err) {
                    // console.log("an error");
                    throw err;
                }
                // console.log("success");
            }).catch((err) => {
                console.log("error is: " + err);
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    } else {
        try {
            const value = await AsyncStorage.getItem('categories');
            if (value !== null) {
                // We have data!!
                result = JSON.parse(value)
                // console.log('the restored data is');
                return result;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

}


export async function getAlbums() {
    let result = null;
    if (connected) {
        try {
            let audios = await fetch("https://s.alrqi.net/api/1.0/album", {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                }
            })
            result = await audios.json();
            AsyncStorage.setItem('albums', JSON.stringify(result), (err) => {
                if (err) {
                    console.log("an error");
                    throw err;
                }
                // console.log("success");
            }).catch((err) => {
                console.log("error is: " + err);
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    } else {
        try {
            const value = await AsyncStorage.getItem('albums');
            if (value !== null) {
                // We have data!!
                result = JSON.parse(value)
                console.log('the restored data is');
                return result;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

}

export async function download(url, name) {
    const downloadProgress = 0
    if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: 'Download Files',
            message: 'Use your storage to download data',
        },
        );

        if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Downloading...', ToastAndroid.SHORT)
                }
            const { config, fs } = RNFetchBlob;
            let LibAudDir = fs.dirs.DownloadDir + "/LibAud/";
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: LibAudDir + name,
                    description: ('downloading_file')
                }
            };
            config(options)     
                .fetch('GET', url)
                .then(res => {
                    if (res.data) {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show('Downloaded', ToastAndroid.SHORT)
                        }
                        // console.log(res.path())
                    } else {
                        alert(('Download Failed'));
                    }
                });
        }
    } else if (Platform.OS == 'ios') {
                AlertIOS.alert('Downloaded');
            
        const { config, fs } = RNFetchBlob;
        let LibAudDir = fs.dirs + "/LibAud/";
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: LibAudDir + name,
                description: ('downloading_file')
            }
        };
        config(options)
            .fetch('GET', url)
            .progress((received, total) => {
                // console.log('progress', received / total)
            })
            .then(res => {
                if (res.data) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Downloaded', ToastAndroid.SHORT)
                    } else {
                        AlertIOS.alert('Downloaded');
                    }
                    // console.log(res.path())
                } else {
                    alert(('Download Failed'));
                }
            });
    }
};
track = null
export const addTrack = async (item) => {
    tracks = [...track, {
        id: item.item.nid,
        url: "https://s.alrqi.net" + item.item.field_audio,
        title: item.item.field_music_band,
        artist: item.item.title,
        artwork: "https://s.alrqi.net" + item.item.field_image
    }]
    return tracks;
}

export const addTracks = async (item) => {
    // Set up the player
    await TrackPlayer.setupPlayer();

    // Add a track to the queue
    await TrackPlayer.add({
        id: item.item.nid,
        url: "https://s.alrqi.net" + item.item.field_audio,
        title: item.item.field_music_band,
        artist: item.item.title,
        artwork: "https://s.alrqi.net" + item.item.field_image
    });
    return TrackPlayer
};

export const addToPlaylist = (item) => {
    let modalVisible = true

    const closeModal = () => {
        modalVisible = false
    }
    return (
        <Modal
            transparent={true}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            onRequestClose={() => closeModal()}
            visible={modalVisible}
            animationType="slide">
            <View style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={styles.modal}>
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
                        <TouchableOpacity>
                            <View style={styles.option}>
                                <Icon name="playlist-plus" size={30} color="#5D3F6A" />
                                <Text style={styles.text}>Add To Playlist</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.option}>
                                <Icon name="album" size={30} color="#5D3F6A" />
                                <Text style={styles.text}>Create Album</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export class SOngData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            liked: false,
            downloaded: false
        };
    }
    playSong = item => {
        this.props.navigation.navigate('Player', { item: item });
    };

    componentDidMount() {
        this.handleDownloads()
        this.fav()
    }

    saveAsLiked = async (item) => {
        // AsyncStorage.removeItem('liked')
        try {
            let value1 = await AsyncStorage.getItem('liked');
            if (value1 != null) {
                let string = JSON.stringify(item)
                let result = `${value1},${string}`
                AsyncStorage.setItem('liked', result)
            }
            else {
                AsyncStorage.setItem('liked', JSON.stringify(item))
            }
            this.setState({
                liked: true
            })
        } catch (error) {
            console.log(error)
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

    fav = async () => {
        let liked1 = await AsyncStorage.getItem('liked');
        if (liked1 != null) {
            let jsn = JSON.parse(`[${liked1}]`)
            for (var i = 0; i < jsn.length; i++) {
                var obj = jsn[i]
                if (obj.nid == this.props.item.nid) {
                    // console.log('inside if')
                    if (this.state.liked != true) {
                        this.setState({
                            liked: true
                        })
                        break
                    }
                    // break
                } else {
                    // console.log('inside else')
                    if (obj.nid != this.props.item.nid) {
                        if (this.state.liked != false) {
                            this.setState({
                                liked: false
                            })
                        }
                    }
                }
            }
        }
    }

    render() {
        let item = this.props.item;
        let index = this.props.index + 1;
        let heart = this.state.liked ? 'heart' : 'heart-outline'
        let color = ''
        var songStyle = null
        var textStyle = null
        if (index % 2 == 5) {
            songStyle = "#1212"
            textStyle = '#e3e3e3'
            color = this.state.liked ? 'red' : textStyle
        } else {
            songStyle = "#fff"
            textStyle = '#333'
            color = this.state.liked ? 'red' : textStyle
        }
        return (
            <View style={{ width: '95%', alignSelf: "center", backgroundColor: '#FFF', elevation: 5, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginBottom: 5 }}>
                <TouchableWithoutFeedback
                    style={styles.songContainer}
                    onPress={() => this.playSong(item)}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.img}>
                            <Image source={{ uri: 'https://s.alrqi.net/' + item.field_image }} style={styles.img} />
                        </View>
                        <View style={styles.dataContainer}>
                            <Text style={[styles.songtitle, { color: textStyle }]}>{item.title}</Text>
                            <Text style={styles.subTitle}>{item.field_music_band}</Text>
                            {/* <Text style={styles.subTitle}>{item.duration / 60}</Text> */}
                            {/* <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => { this.state.downloaded ? null : download('https://s.alrqi.net/' + item.field_audio, item.title + ".mp3")}}>
                                    <Icon
                                        name={this.state.downloaded ? "music-off" : 'download-outline'}
                                        color={textStyle}
                                        size={20}
                                        style={{ marginRight: 20 }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.saveAsLiked(item)}>
                                    <Icon
                                        name={heart}
                                        color={color}
                                        size={20}
                                    // style={{ marginRight: 20 }}
                                    />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export class BandData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    goToDetails = item => {
        this.props.navigation.navigate('Details', { item: item, page: 'band' });
    };

    render() {
        let item = this.props.item;
        let name = item.name
        let image = null
        if (!item.image == [] || !item.image == null) {
            const source = 'https://s.alrqi.net' + item.image
            image = <CacheImage url={source} name={name + '.jpg'} style={styles.img} />
        }
        let index = this.props.index + 1;
        var songStyle = null
        if (index % 2 == 0) {
            songStyle = "#fff"
        } else {
            songStyle = "#fff"
        }
        return (
            <View style={{ alignSelf: 'center', backgroundColor: songStyle, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginBottom: 10, elevation: 5 }}>
                <TouchableWithoutFeedback
                    style={styles.songContainer}
                    onPress={() => this.goToDetails(item)}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.dataContainer, { justifyContent: "center" }]}>
                            <Text style={styles.songtitle}>{name}</Text>
                            {/* <Text style={styles.subTitle}>{item.field_image.url}</Text> */}
                            {/* <Text style={styles.subTitle}>{0.06}</Text> */}
                        </View>
                        <View style={[styles.imgBack, { backgroundColor: '#5D3F6A', marginLeft: 5 }]}>
                            {/* <ImageBackground
                                style={styles.imgBack}
                                source={''}
                            >
                                {image}
                            </ImageBackground> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaec',
    },
    text: {
        color: '#8e97a6',
    },
    textLight: {
        color: '#b6b7bf',
    },
    textDark: {
        color: '#3d425c',
    },
    coverContainer: {
        marginTop: '20%',
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
        borderRadius: 20,
        elevation: 20,
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
        color: '#444',
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
    }
});