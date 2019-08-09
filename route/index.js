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
import CommentScreen from '../screen/comment';
import PostScreen from '../controller/post';
import WalletScreen from '../screen/wallet';
import BankScreen from '../screen/bank';
import WithdrawScreen from '../screen/withdraw';
import ArtworkDetailScreen from '../screen/service/details';
import BuyScreen from '../screen/buy';
import ProfileScreen from '../screen/service/profile';
import ProfileArtworkScreen from '../screen/service/artworkForProfile';

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
      Comment: CommentScreen,
      Post: PostScreen,
      Wallet: WalletScreen,
      Bank: BankScreen,
      Withdraw: WithdrawScreen,
      Detail: ArtworkDetailScreen,
      Buy: BuyScreen,
      Profile: ProfileScreen,
      ProfileArtwork: ProfileArtworkScreen,
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
 
