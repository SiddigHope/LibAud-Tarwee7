import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { Surface } from 'react-native-paper';
import { getAlbums } from "./../config/service"
import { getAudios } from "./../config/service"
import { download } from "./../config/service"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash'

const { width, height } = Dimensions.get('window');

class CatogComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        getAlbums().then(data => {
            this.setState({
                isLoading: false,
                data: data
            })
        }, error => {
            Alert.alert('Error', 'something whent wrong!')
        }
        )
    };

    downloadAlbum = (album) => {
        getAudios().then(data => {
            const string = _.filter(data, item => {
                const title = item.field_album
                if (title.match(album.name)) {
                    download("https://s.alrqi.net" + item.field_audio, item.title + ".mp3")
                }
            })
        })
    }

    goToDetails = item => {
        this.props.navigation.navigate('Details', { item: item, page: 'albums' });
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
                                        <View style={{justifyContent: 'space-evenly'}}>
                                            <View style={{ alignItems: 'flex-start'}}>
                                                <TouchableOpacity onPress={() => this.downloadAlbum(item)}>
                                                    <Icon
                                                        name="download-outline"
                                                        color="rgba(0,0,0,.5)"
                                                        size={25}
                                                        style={{ marginRight: 5 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={styles.name}>{name}</Text>
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
        borderRadius: 5,
        color: '#e3e3e3',
        // fontWeight: 'bold',
        fontSize: 16,
    },
});