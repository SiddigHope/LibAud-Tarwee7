import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { T } from '@react-navigation/native'
import AlbumsComponent from '../Components/AlbumsComponent';
import CatogComponent from '../Components/CatogComponent';
import SongsComponent from '../Components/SongsComponent';
import BandComponent from '../Components/BandComponent';

const Tap = createBottomTabNavigator();

/* <Tabs initialPage={3} tabBarUnderlineStyle={{ height: 1, backgroundColor:'#e3e3e3'}} tabBarPosition="overlayTop">
              <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTabStyle={styles.active} heading="التصنيفات">
                <CatogComponent navigation={this.props.navigation} />
              </Tab>
              <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTabStyle={styles.active} heading="الالبومات">
              <AlbumsComponent navigation={this.props.navigation} />
            </Tab>
              <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTabStyle={styles.active} heading="الفرق">
              <BandComponent navigation={this.props.navigation} />
            </Tab>
              <Tab tabStyle={styles.tabStyle} textStyle={styles.text} activeTabStyle={styles.active} heading="الصوتيات" >
              <SongsComponent navigation={this.props.navigation} />
              {/* <BannerComponent navigation={this.props.navigation}/> */
/* </Tab> */ 
/* </Tabs> */ 

function Taps() {
    return (
        <Tap.Navigator
            initialRouteName="SongsComponent"
            tabBarOptions={{
                inactiveTintColor: 'gray',
                activeTintColor: '#8f5ba6',
                showLabel: false,
                tabStyle: {
                    backgroundColor: '#fff',
                    height: 60,
                    paddingBottom: 12,
                },
            }}>
            <Tap.Screen
                name="SongsComponent"
                component={SongsComponent}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon
                            name={focused ? 'compass' : 'compass-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tap.Screen
                name="AlbumsComponent"
                component={AlbumsComponent}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon
                            name={focused ? 'compass' : 'compass-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tap.Screen
                name="BandComponent"
                component={BandComponent}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon
                            name={focused ? 'compass' : 'compass-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tap.Screen
                name="CatogComponent"
                component={CatogComponent}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon
                            name={focused ? 'account' : 'account-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
        </Tap.Navigator>
    );
}

export default Taps;
