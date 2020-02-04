import React from 'react';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";

import {store, persistor} from './redux/index'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import LoginScreen from './screen/login'
import AppNavigation from './route'
import HomeScreen from './screen/home';
import NetworkScreen from './screen/network';
import LandingScreen from './screen/landing';
import ChatScreen from "./screen/service/sendMessage"
import { registerForPushNotificationsAsync } from "./controller/api"
import CommunityScreen from './screen/community'
import MyAuction from './screen/myAuction'
import BankController from './controller/bank'
import WithdrawScreen from './screen/withdraw'
import WalletScreen from './screen/wallet'
import FundWalletScreen from './screen/fundWallet'
import PaymentScreen from './screen/pay'
import JoinCommunity from './screen/joinCommunity'
import EditPartnerScreen from './screen/editPartnerDetails'
import Partner from './screen/isPartner'
import PartnerProfileScreen from './screen/memberProfile'
import VerifyAuctionScreen from './screen/verifyAuctionByMember'
import TrackPartnerSaleScreen from './screen/trackSales'
import Referral from './screen/referral'
import ChangeWalletScreen from './screen/changeWalletCurrency'
import AboutScreen from './screen/about'
import Edit from './controller/editProfile'
import Post from './controller/post'
import MyNegotiation from './screen/myNegotiations'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });

  }
   
  render() {
    if (!this.state.isReady){
      return <AppLoading />;
    }

    return (
      <Provider loading={<AppLoading />} store={store}>
          <PersistGate  persistor={persistor}>
            <Root>
              <Container>
                <AppNavigation />
              </Container>
            </Root>
          </PersistGate>
      </Provider>
    );
  }
}

