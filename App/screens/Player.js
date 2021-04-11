import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PlayerComponent from '../Components/PlayerComponent';

console.disableYellowBox=true
class Player extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let item = this.props.route.params.item;
    return (
      <View style={styles.container}>
        <PlayerComponent navigation={this.props.navigation} item={item} />
      </View>
    );
  }
}

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
