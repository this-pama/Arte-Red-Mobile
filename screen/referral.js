import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input, Segment, Accordion,
  Card, CardItem, Fab } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"
import {BackHandler, RefreshControl } from "react-native"
import { Notifications } from 'expo';
import CountDown from 'react-native-countdown-component';
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';
import {Share, Clipboard } from 'react-native';


class ReferralScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {}, 
      refreshing: false,
      visible: false,
      fetchTrack: false,
      modalVisible: false,
      data: {},
      link: '',
      active: false,
    }
  }

  async componentDidMount() {
    this.getReferralDetails();

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Activities")
      return true;
    });

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  getReferralDetails= async ()=>{
    var url = apiUrl + "referral/user/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result
    if(response.status !== 200 ){
      this.setState({
        message: "Error occurred while getting data",
        modalVisible: true,
        fetch: true,
      })
      return
    }
      var res = await response.json()
      if (res.success ) {
        
        this.setState({
          data: res.message,
          link: res.link,
          fetch: true,
        })
      }
      else  { 
        this.setState({
        //   message: "Error occurred while getting data",
        //   visible: true,
          fetch: true
        })
        return    
      }
}


_onRefresh = () => {
    this.setState({refreshing: true});

    this.getReferralDetails().then(() => {
      this.setState({refreshing: false});
    })
}

onShare = async () => {
    try {
      const result = await Share.share({
        title: "Arte Red",
        message:
          'Arte Red | Check out this platform. It is an app that i use to connect with other stakeholders in the Art industry. Get to ' + this.state.link + '  or use my referral code ' + this.state.data.referral,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.warn(result)
        } else {
          // shared
          console.warn(result)
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        return
      }
    } catch (error) {
      return
    }
  };



  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Activities")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Referral</Title>
          </Body>
        </Header>
        <Content 
            refreshControl={
                <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                />
            }
        >
            {!this.state.fetch ? (
                <Body>
                    <Spinner color='red' />
                </Body>
            ) : null }
            <View style={{ paddingTop: 30, paddingRight: 20, paddingLeft: 20, flex: 1 }}>
                <Body>
                    <Text>Refer a new user with your referral code and earn USD 5.</Text>
                    <Text note style={{ paddingTop: 25 }}>Your referral code is { this.state.data.referral ? `${this.state.data.referral}` : 'is currently not available.'}</Text>

                    <View style={{ paddingTop: 20 }}>
                        <Button  onPress={ async ()=>{
                            await Clipboard.setString(this.state.link)
                            Toast.show({
                                text: "Link is copied to clipboard",
                                buttonText: "Okay"
                              })
                        }}>
                            <Text>Get your referral link</Text>
                        </Button>
                    </View>
                    
                </Body>

            </View>
          
            <View>
              <Modal
                visible={this.state.modalVisible}
                modalTitle={<ModalTitle title="Message" />}
                modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                  this.setState({ modalVisible: false });
                }}
                width
                footer={
                  <ModalFooter>
                    <ModalButton
                      text="OK"
                      onPress={() => this.setState({ modalVisible : false })}
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View style= {{ padding : 12, paddingBottom: 20 }} >
                    <Text>{ this.state.message } </Text>
                  </View>
                </ModalContent>
              </Modal>
            </View>
        </Content>
            
            <View style={{paddingBottom: 40 }} >
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{paddingBottom: 40 }}
                    style={{ backgroundColor: "#990000" }}
                    position="bottomRight"
                    onPress={() => {
                        this.setState({ active: !this.state.active })
                        if(!this.state.active){
                            this.onShare()
                        }
                        else{ return }
                        }}>
                    <Icon name="share" />
                    
                </Fab>
            </View>

        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Activities")} >
              <Icon name="pulse" />
              <Text>Activities</Text>
            </Button>
          
          </FooterTab>
        </Footer>
    </Container>
    );
  }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(ReferralScreen)
