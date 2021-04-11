import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import ProfileComponent from '../Components/ProfileComponent';
import {ScrollView} from 'react-native-gesture-handler';
import { Header, Left, Right, Drawer } from 'native-base'
import SideBar from './../config/SideBar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

console.disableYellowBox=true
class Profile extends Component {
  constructor(props) {
    super(props);
  }


  closeDrawer() {
    this.drawer._root.close()
  };

  openDrawer() {
    this.drawer._root.open()
  };

  render() {
    return (
      <View style={styles.container}>
          {/* <StatusBar backgroundColor='#e3e3e3' barStyle="dark-content" /> */}
          <ProfileComponent navigation={this.props.navigation} />
      </View>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
