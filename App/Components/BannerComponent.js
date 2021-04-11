import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBand } from './../config/service'
import Icon2 from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

class BannerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner: null
        }
    }

    componentDidMount() {
        getBand().then(data => {
            this.setState({
                banner: data
            })
        })
    }

    playSong = item => {
        this.props.navigation.navigate('Details', { item: item, page: 'band' });
    };

    separator = () => {
        return <View style={{ width: 5, backgroundColor: '#333' }} />;
    };

    render() {
        console.disableYellowBox = true;
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.banner}
                    horizontal={true}
                    keyExtractor = {(item, index) => index.toString()}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    // ItemSeparatorComponent={() => this.separator()}
                    renderItem={({ item, index }) => {
                        // console.log(item)
                        let name = item.name
                        let image = null
                        if (!item.image == '' || !item.image == null) {
                            const source = { uri: 'https://s.alrqi.net/' + item.image }
                            // console.log('source')
                            // console.log(source)
                            image = source
                        }else{
                            image = require('./../Assets/appLogo.png')
                        }
                        return (
                            <View style={styles.banner} key={index}>
                                <ImageBackground source={image} style={styles.bannerImage}>
                                    <TouchableOpacity
                                        style={styles.btn}
                                        onPress={() => {
                                            this.playSong(item);
                                        }}>
                                            <View style={styles.btn1}>
                                            <Icon name="play" size={18} color="#000" />
                                            <Text style={styles.text}>تشغيل الأن</Text>
                                            </View>
                                        <Text style={[styles.text, {marginRight: 5}]}>{name} </Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

export default BannerComponent;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: 250,
        backgroundColor: '#FFF',
        elevation: 5,
        // width: '95%',
        borderRadius: 10,
        // justifyContent: "center",
        // alignItems: "center"
        // paddingHorizontal: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        margin: 10,
        marginLeft: 15,
    },
    banner: {
        height: 250,
        width: width,
        borderRadius: 10,
        // paddingHorizontal: 50
    },
    bannerImage: {
        height: 250,
        width: width,
        borderRadius: 10,
        alignSelf: 'center'
    },
    btn: {
        position: 'absolute',
        bottom: 15,
        // right: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '70%',
        height: 24,
        alignSelf: "center",
        // marginHorizontal: 50,
        flexDirection: 'row',
    },

    btn1: {
        // position: 'absolute',
        // bottom: 15,
        // right: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        // elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 24,
        flexDirection: 'row',
    },
    text: {
        fontFamily: 'Tajawal-Regular',
        marginLeft: 5,
    },
});
