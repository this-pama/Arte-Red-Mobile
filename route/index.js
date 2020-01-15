import React, { Component } from 'react';
import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import { Text, Image } from 'react-native'
import { Modal, TouchableHighlight, Alert, ScrollView, StyleSheet } from 'react-native';
import { Icon, Content, Body, Left, View, Right, ListItem, List, Input, Form,
Item, Button } from 'native-base'
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
import BankScreen from '../controller/bank';
import WithdrawScreen from '../screen/withdraw';
import ArtworkDetailScreen from '../screen/service/details';
import BuyScreen from '../screen/buy';
import ProfileScreen from '../screen/service/profile';
import ProfileArtworkScreen from '../screen/service/userProfileCollection';
import ExhibitionScreen from "../screen/exhibition"
import RaveScreen from "../screen/service/rave"
import LandingScreen from '../screen/landing';
import SettingScreen from '../screen/setting';
import EditProfileController from '../controller/editProfile';
import ExpandExhibitionScreen from '../screen/expandExhibition';
import CreateExhibitionScreen from '../controller/createExhibition';
import MyProfileScreen from '../screen/myProfile';
import HelpScreen from '../screen/help'
import AccountScreen from '../screen/account'
import RegisterExhibitionScreen from "../screen/registerForExhibition"
import ChatScreen from "../screen/service/sendMessage"
import SearchIcon from "../screen/service/search"
import NegotiationScreen from "../screen/negotiation"
import MyNegotiationScreen from '../screen/myNegotiations'
import AuctionScreen from '../screen/auction'
import MyAuction from '../screen/myAuction'
import ForgetPasswordScreen from '../screen/forgetPassword'
import ChangePasswordScreen from '../screen/changePassword'
import MyExhibition from '../screen/myExbition'
import ExhibitionAttendeeScreen from '../screen/exhibitionAttendee'
import EditExhibitionScreen from '../screen/editExhibition'
import Community from '../screen/community'
import Activities from '../screen/activity'
import BankDetails from '../screen/wallet/bankDetails'
import FundWallet  from '../screen/fundWallet'
import Sales from '../screen/mysale'
import JoinCommunity from '../screen/joinCommunity'
import EditPartner from '../screen/editPartnerDetails'
import Partner from '../screen/isPartner'
import MemberProfile from '../screen/memberProfile'
import VerifyAuction from '../screen/verifyAuctionByMember'

const DrawerNavigator = createDrawerNavigator(
    {
      Drawer: {
        screen: DrawerScreen
      },
      Home: HomeScreen,
      Post: PostScreen,
      Rave: RaveScreen,
    },
    {
      initialRouteName: 'Home',
      contentComponent: DrawerScreen,
      drawerWidth: 300
     }
);


class HeaderBar extends Component{
  render(){
    return(
      <View >
        <Text style={{paddingLeft: 35, fontSize: 20, fontWeight: "bold", color: "#fff" }}> 
          Arte Red 
        </Text>
    </View>
    )
  }
}



const StackNavigator = createStackNavigator({
    DrawerNavigator:{
        screen: DrawerNavigator,
        navigationOptions: ({ navigation }) => ({
        headerTitle: <HeaderBar />,  
        headerRight: <SearchIcon navigation= {navigation} />,
        headerLeft: 
        <List>
          <ListItem>
            <Left>
              <TouchableOpacity  onPress={ () => { navigation.dispatch(DrawerActions.toggleDrawer())} }>
                  <Icon name='menu' style={{ fontSize: 25 }} />
              </TouchableOpacity>
            </Left>
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
  Help: HelpScreen,
  Account: AccountScreen,
  Detail: ArtworkDetailScreen,
  Buy: BuyScreen,
  Profile: ProfileScreen,
  UserProfileCollection: ProfileArtworkScreen,
  Comment: CommentScreen,
  Exhibition: ExhibitionScreen,
  CreateExhibition: CreateExhibitionScreen,
  RegisterForExhibition: RegisterExhibitionScreen,
  Chat: ChatScreen,
  Negotiation: NegotiationScreen,
  MyNegotiation: MyNegotiationScreen,
  Auction: AuctionScreen,
  MyAuction: MyAuction,
  ForgetPassword : ForgetPasswordScreen,
  ChangePassword : ChangePasswordScreen,
  MyExhibition: MyExhibition,
  ExhibitionAttendee: ExhibitionAttendeeScreen,
  EditExhibition : EditExhibitionScreen,
  Network: NetworkScreen,
  Follower: FollowerScreen,
  Following: FolloweringScreen,
  Community,
  Activities,
  Wallet: WalletScreen,
  Bank: BankScreen,
  BankDetails,
  FundWallet,
  Sales,
  JoinCommunity,
  EditPartner,
  Partner,
  MemberProfile,
  VerifyAuction,
  Withdraw: WithdrawScreen,
  App: StackNavigator,
},
{
  initialRouteName: 'Landing',
  contentComponent: LandingScreen,
 }
)




export default  AppContainer = createAppContainer(switchNavigator);
 
