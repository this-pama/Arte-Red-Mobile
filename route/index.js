import React, { Component } from 'react';
import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import { TouchableOpacity, Text } from 'react-native'
import { Icon } from 'native-base'

import DrawerScreen from '../screen/drawer';
import LoginScreen from  "../controller/signin"
import SignUpScreen from "../controller/signup"
import HomeScreen from '../screen/home';
import NetworkScreen from '../screen/network';
import FollowerScreen from '../screen/follower';
import FolloweringScreen from '../screen/following';

const DrawerNavigator = createDrawerNavigator(
    {
      Drawer: {
        screen: DrawerScreen
      },
      Login:  LoginScreen,
      SignUp: {
        screen: SignUpScreen,
      },

      Home: HomeScreen,
      Network: NetworkScreen,
      Follower: FollowerScreen,
      Following: FolloweringScreen,
    },
    {
      initialRouteName: 'Home',
      contentComponent: DrawerScreen,
      drawerWidth: 300
     }
);


const StackNavigator = createStackNavigator({
    DrawerNavigator:{
        screen: DrawerNavigator,
        navigationOptions: ({ navigation }) => ({
        headerTitle: <Text style={{paddingLeft: 35, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#fff" }}> Arte Red</Text>,  
        headerRight: 
        <TouchableOpacity  onPress={ () => { navigation.dispatch(DrawerActions.toggleDrawer())} }>
            <Icon name='menu' style={{ paddingRight : 10 }} />
        </TouchableOpacity>,
        headerStyle: {
            backgroundColor: '#660000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

    })
    }, 

    // Login:  LoginScreen,
    
    

});


export default  AppContainer = createAppContainer(StackNavigator);
 
