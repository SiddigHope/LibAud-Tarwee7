import React, { Component } from "react";
import { StatusBar, BackHandler, Alert, PermissionsAndroid } from 'react-native';
import { Box, Text } from "react-native-design-utility";
import OnboardingLogo from '../commons/OnboardingLogo';
import { download } from './../config/service'
import RNFetchBlob from 'rn-fetch-blob'

class SplashScreen extends Component {
    state = {}

    componentDidMount() {
        this.getPermision()
    }

    getPermision = async() => {
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );

            if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.checkAuth();
            } else {
                Alert.alert(
                    "تنبيه",
                    "يجب السماح للتطبيق بتخزين البيانات",
                    [
                        { text: "حسناً", onPress: () => BackHandler.exitApp() }
                    ],
                    { cancelable: false }
                );
            }
        }
    }
    checkAuth = () => {
        setTimeout(() => {
            this.props.navigation.navigate('Tabs', {navigation: this.props.navigation})
        }, 3000)
    }
    render() {
        return (
            <Box style={{ width: '100%' }} bg="#FFF" f={1} center>
                <StatusBar backgroundColor="#FFF" />
                <OnboardingLogo />
            </Box>
        );
    }
}

export default SplashScreen;