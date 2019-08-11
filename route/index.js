import React, { Component } from 'react';
import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import { Text, Image } from 'react-native'
import { Icon, Content, Body, Left, View, Right, ListItem, List, Input, Form } from 'native-base'
import { TouchableOpacity } from "react-native-gesture-handler"

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
import ExhibitionScreen from "../screen/exhibition"
import RaveScreen from "../screen/service/rave"
import LandingScreen from '../screen/landing';
import SettingScreen from '../screen/setting';
import EditProfileController from '../controller/editProfile';
import ExpandExhibitionScreen from '../screen/expandExhibition';
import CreateExhibitionScreen from '../screen/createExhibition';
import MyProfileScreen from '../screen/myProfile';

const DrawerNavigator = createDrawerNavigator(
    {
      Drawer: {
        screen: DrawerScreen
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
      Exhibition: ExhibitionScreen,
      CreateExhibition: CreateExhibitionScreen,
      Rave: RaveScreen,
    },
    {
      initialRouteName: 'Home',
      contentComponent: DrawerScreen,
      drawerWidth: 300
     }
);

const headerText = (
  <View >
      <Text style={{paddingLeft: 35, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#fff" }}> Arte Red</Text>
  </View>
  
)

const searchBar = (
  <Form>
    <Left>
      <Input placeholder="Search" />
    </Left>
    <Right>
      <Icon name='menu' style={{ paddingRight : 10 }} />
    </Right>
  </Form>
)

const searchIcon =(
  <TouchableOpacity>
      <Icon name="search" style={{ color: "white", paddingRight: 5}} />
  </TouchableOpacity>
)
const LeftBar= (
        <List>
          <ListItem>
            <Left>
            <TouchableOpacity>
              {searchIcon}
            </TouchableOpacity>
            </Left>
            <Right>
              <TouchableOpacity  onPress={ () => { navigation.dispatch(DrawerActions.toggleDrawer())} }>
                  {<Icon name='menu' style={{ paddingRight : 10 }} />}
              </TouchableOpacity>
            </Right>
          </ListItem>
        </List>
)

const StackNavigator = createStackNavigator({
    DrawerNavigator:{
        screen: DrawerNavigator,
        navigationOptions: ({ navigation }) => ({
        headerTitle: headerText,  
        headerRight: 
        <List>
          <ListItem>
            <Left>
            <TouchableOpacity>
              {searchIcon}
            </TouchableOpacity>
            </Left>
            <Right>
              <TouchableOpacity  onPress={ () => { navigation.dispatch(DrawerActions.toggleDrawer())} }>
                  {<Icon name='menu' style={{ paddingRight : 10 }} />}
              </TouchableOpacity>
            </Right>
          </ListItem>
        </List>
        ,
        headerStyle: {
            backgroundColor: '#660000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

    })
    }, 

});

const switchNavigator = createSwitchNavigator({
  Landing: LandingScreen,
  Login:  LoginScreen,
  SignUp: SignUpScreen,
  Setting: SettingScreen,
  EditProfile: EditProfileController,
  MyProfile: MyProfileScreen,
  ExpandExhibition: ExpandExhibitionScreen,
  App: StackNavigator
},
{
  initialRouteName: 'Landing',
  contentComponent: LandingScreen,
 }
)

export default  AppContainer = createAppContainer(switchNavigator);
 
