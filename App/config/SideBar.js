import React, {Component} from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableHighlight, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Profile from './../screens/Profile'
import { List, ListItem, Right, Body } from 'native-base'
import { TouchableOpacity, Share } from 'react-native';
//import FastImage from 'react-native-fast-image'

appLinkShare = () => {
        Linking.openURL("https://t.me/OkamelSound_bot")
    }

export default SideBar = (props) => (
    <ScrollView style={{backgroundColor:"#fff"}}>
        <View style={{ padding: 16, paddingTop: 48, backgroundColor: "#5D3F6A"}}>
            {/* <FastImage
                source={{ uri: "https://avatars.hsoubcdn.com/37ad933e34ea91af4807aee8e76f8ae7?s=256"}}
                style={styles.profile}
            /> */}
            <Text style={styles.name}>Seddig A.Hamoda</Text>
            <View style={{flexDirection: 'row'}} >
                <Text style={styles.uname}>SiddigHope-2423</Text>
                <Icon name='account' size={16} color="rgba(255,255,255,0.8)"/>
            </View>
        </View>

        <View style={styles.container}>
            <List>
                <ListItem>
                    <Body>
                        <TouchableOpacity style={styles.item} onPress={() => appLinkShare()}>
                            <Icon1 style={styles.icon} name="send" color='#000' size={15} />
                            <Text style={{ fontFamily: 'Tajawal-Regular', }}>Telegram Bot</Text>
                        </TouchableOpacity>
                    </Body>
                </ListItem>

                <ListItem>
                    <Body>
                        <TouchableOpacity style={styles.item}>
                            <Icon style={styles.icon} name="account" color='#000' size={20} />
                            <Text style={{ fontFamily: 'Tajawal-Regular',}}>Profile</Text>
                        </TouchableOpacity>
                    </Body>
                </ListItem>

                <ListItem>
                    <Body>
                        <TouchableOpacity style={styles.item}>
                            <Icon style={styles.icon} name="logout" color='#000' size={20} />
                            <Text style={{ fontFamily: 'Tajawal-Regular',}}>Logout</Text>
                        </TouchableOpacity>
                    </Body>
                </ListItem>
            </List>
        </View>
    </ScrollView>
);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#e3e3e3'
    },
    icon:{
        marginRight: 5
    },
    profile:{
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#fff',
    },
    name:{
        fontFamily: 'Tajawal-Regular',
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 8
    },
    uname:{
        fontFamily: 'Tajawal-Regular',
        color: "rgba(255,255,255,0.8)",
        marginLeft: 4
    },
    item : {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10
    }
})