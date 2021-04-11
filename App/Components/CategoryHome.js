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
import { getCategories } from "./../config/service"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
const { width, height } = Dimensions.get('window');

class CatogComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        getCategories().then(data => {
            this.setState({
                isLoading: false,
                data: data.slice(0, 4)
            })
        }, error => {
            Alert.alert('Error', 'something whent wrong!')
        }
        )
    }

    goToDetails = item => {
        this.props.navigation.navigate('Details', { item, item, page: 'category' });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{'التصنفيات'}</Text>
                <FlatList
                    data={this.state.data}
                    horizontal={true}
                    ListFooterComponent={() => this.listFooter()}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        let name = item.name
                        let image = null
                        if (!item.image == '' || !item.image == null) {
                            const source = { uri: "https://s.alrqi.net"+item.image }
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
                                        <Icon name="music" color="#444" size={22} />
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
    showMore = () => {
        this.props.navigation.navigate('Home', {gotoTab: 2});
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

export default CatogComponent;

const styles = StyleSheet.create({
    container: {
        width: width - 20,
        height: 220,
        backgroundColor: '#FFF',
        elevation: 5,
        // borderColor: '#444',
        borderRadius: 5,
        // borderWidth: 1
    },
    title: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#444',
        margin: 5,
        marginLeft: 15,
    },
    surface: {
        elevation: 5,
        height: 150,
        marginTop: 5,
        width: 150,
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
    footerContainer: { marginRight: 10, alignSelf: 'center', height: 145,  backgroundColor: '#FFF', elevation: 5, paddingHorizontal: 10, marginTop: 5, alignItems: "center", justifyContent: "center", borderRadius: 5 },
    footerText: { color: '#e3e3e3', fontFamily: 'Tajawal-Regular', fontSize: 16 }    

});
