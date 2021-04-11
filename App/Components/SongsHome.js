import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Surface } from 'react-native-paper';
import { getAudios } from '../config/service'
import { download } from './../config/service'
import RNFetchBlob from 'rn-fetch-blob'

const { width, height } = Dimensions.get('window');

class SOngData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            liked: false,
            downloaded: false
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

    playSong = item => {
        this.props.navigation.navigate('Player', { item: item });
    };

    componentDidMount(){
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
                liked : true
            })  
        } catch (error) {
            console.log(error)
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
                            liked:true
                        })
                        break
                    }
                    // break
                } else {
                    // console.log('inside else')
                    if (obj.nid != this.props.item.nid) {
                        if (this.state.liked != false) {
                            this.setState({
                                liked : false
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
            <View style={{ width: '95%', alignSelf: "center", backgroundColor: '#FFF', elevation: 5 , borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginBottom: 5 }}>
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
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => { this.state.downloaded ? null : download('https://s.alrqi.net/' + item.field_audio, item.title + ".mp3")}}>
                                    <Icon
                                        name={this.state.downloaded ? "music-off" : 'download-outline'}
                                        color={textStyle}
                                        size={20}
                                        style={{ marginRight: 20 }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.saveAsLiked(item)} >
                                    <Icon
                                        name={heart}
                                        color={color}
                                        size={20}
                                    // style={{ marginRight: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class SongsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            text: ''
        }
    }

    componentDidMount() {
        this.getFiles()
    }

    getFiles = async () => {
        let liked1 = await AsyncStorage.getItem('recent');
        // if (liked1 != null) {
        if (false) {
            let jsn = JSON.parse(`[${liked1}]`)
            this.setState({
                data: jsn.reverse().slice(0, 5),
                text: 'مؤخراً'
            })
        } else {
            getAudios().then(data => {
                this.setState({
                    data: data.slice(0, 10),
                    text: 'الصوتيات'
                })
            })
        }
    }

    separator = () => {
        return <View style={{ height: 2, backgroundColor: '#333' }} />;
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.text}</Text>
                <View>
                    <FlatList
                        data={this.state.data}
                        showsVerticalScrollIndicator={false}
                        // ItemSeparatorComponent={() => this.separator()}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={() => this.listFooter()}
                        renderItem={({ item, index }) => {
                            return (
                                <SOngData index={index} item={item} navigation={this.props.navigation} />
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
    showMore = () => {
        this.props.navigation.navigate('Home');
    };

    listFooter() {
        return (
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={() => this.showMore()}>
                    <Text style={styles.footerText}> {'عرض الصوتيات...'} </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default SongsComponent;

const styles = StyleSheet.create({
    container: {
        width: width - 20,
        // padding: 20,
        backgroundColor: '#FFF',
        // backgroundColor: '#472f53',
        // borderColor: '#444',
        borderRadius: 5,
        // borderWidth: 1,
        elevation: 5,
        marginBottom: 20
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
    },
    footerContainer: { alignSelf: 'center', backgroundColor: '#FFF', elevation: 2, marginBottom: 5, paddingVertical: 10, width: width - 100, marginTop: 5, alignItems: "center", justifyContent: "center", borderRadius: 5 },
    footerText: { color: '#e3e3e3', fontFamily: 'Tajawal-Regular', fontSize: 16 }
});
