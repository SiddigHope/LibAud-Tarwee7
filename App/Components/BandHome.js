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
import Carousel from 'react-native-snap-carousel';
import { getBand } from './../config/service'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CacheImage from './../config/CacheImages'
import { NavigationActions } from 'react-navigation';
const { width, height } = Dimensions.get('window');

class SOngData extends Component {
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
        let name = item.name[0].value
        let image = null
        if (!item.field_image[0] == [] || !item.field_image[0] == null) {
            const source = { uri: item.field_image[0].url }
            // console.log('source')
            // console.log(source)
            image = <CacheImage url={item.field_image[0].url} name={name + '.png'} style={styles.img} />
        }
        let index = this.props.index + 1;
        var songStyle = null
        if (index % 2 == 0) {
            songStyle = "#1212"
        } else {
            songStyle = "#fff"
        }
        return (
            <View style={{ backgroundColor: songStyle, borderRadius: 10, justifyContent: "center", alignItems: "center", padding: 5, marginBottom: 2 }}>
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
                            <ImageBackground
                                style={styles.imgBack}
                                source={''}
                            >
                                {image}
                            </ImageBackground>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class BandHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }


    componentDidMount() {
        getBand().then(data => {
            this.setState({
                isLoading: false,
                data: data
            })
        }, error => {
            Alert.alert('Error', 'something whent wrong!')
        }
        )
    };

    goToDetails = item => {
        this.props.navigation.navigate('Details', { item, item, page: 'category' });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{'الفرق الموسيقية'}</Text>
                <Carousel
                    layout = {'tinder'}
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.data}
                    renderItem={({ item }) => {
                        let name = item.name
                        let image = null
                        if (!item.image == '' || !item.image == null) {
                            // console.log('source')
                            // console.log(source)
                            image = <CacheImage url={'https://s.alrqi.net/'+item.image} name={name + '.jpg'} style={styles.img} />
                        }
                        let index = this.props.index + 1;
                        var songStyle = null
                        if (index % 2 == 0) {
                            songStyle = "#1212"
                        } else {
                            songStyle = "#fff"
                        }
                        return (
                            <TouchableWithoutFeedback onPress={() => this.goToDetails(item)}>
                                <Surface style={styles.surface}>
                                    <ImageBackground
                                        source={image}
                                        style={styles.img}
                                        blurRadius={.10}>
                                        <Icon name="music" color="#444" size={22} />
                                        <Text style={styles.name}>{name}</Text>
                                    </ImageBackground>
                                </Surface>
                            </TouchableWithoutFeedback>
                        );
                    }}
                    sliderWidth={width - 50}
                    itemWidth={width - 50}
                />
            </View>
        );
    }
    showMore = () => {
        this.props.navigation.navigate('Home', { gotoTab: 2 });
    };

    listFooter() {
        return (
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={() => this.showMore()}>
                    <Text style={styles.footerText}> {'عرض المزيد...'} </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default BandHome;

const styles = StyleSheet.create({
    container: {
        width: width - 20,
        height: 270,
        backgroundColor: '#472f53',
        // paddingHorizontal: 20
        // paddingLeft: 20,
        // paddingTop: 20,
        borderColor: '#444',
        borderRadius: 5,
        borderWidth: 1
    },
    title: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#e3e3e3',
        margin: 10,
        marginLeft: 15,
    },
    surface: {
        alignSelf: "center",
        elevation: 15,
        height: 200,
        width: 200,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 15,
        overflow: 'hidden',
        backgroundColor: '#e3e3e3'
    },
    img: {
        height: 150,
        width: 150,
        borderRadius: 10,
        padding: 10,
        alignItems: 'flex-end'
    },
    name: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        fontFamily: 'Tajawal-Regular',
        color: '#444',
        // fontWeight: 'bold',
        fontSize: 20,
        // backgroundColor:'red',
        alignSelf: 'stretch'
    },
    footerContainer: { marginRight: 10, alignSelf: 'center', height: 145, backgroundColor: '#392643', paddingHorizontal: 10, marginTop: 5, alignItems: "center", justifyContent: "center", borderRadius: 5 },
    footerText: { color: '#e3e3e3', fontFamily: 'Tajawal-Regular', fontSize: 16 }

});
