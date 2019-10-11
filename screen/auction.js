import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input, Segment,
  Card, CardItem } from 'native-base';
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
import {
  Notifications,
} from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SubmitAuctionScreen from './service/submitAuction'

class AuctionScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      negotiationData: [],
      requestedData: [],
      receivedData: [],
      activeOngoing: true,
      activeClosed: false,
      activeSubmit: false,
      refreshing: false,
    }
  }

  async componentDidMount() {
    this.getNegotiationDetails()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Home")
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

  getNegotiationDetails= async ()=>{
    var url = apiUrl + "negotiation/myNegotiation/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result

      var res = await response.json();
      if (res._id) {
        console.warn(res)
        this.setState({
          negotiationData : res.requested,
          requestedData: res.requested,
          receivedData: res.received,
          fetch: true
        })
      }
      else  {
        console.warn("Can't get negotiation data")  
        this.setState({
          fetch: true
        })
        return    
      }
}

_onRefresh = () => {
    this.setState({refreshing: true});
    this.getNegotiationDetails().then(() => {
      this.setState({refreshing: false});
    })
}

  render() {
    const negotiationHistory = this.state.negotiationData.map( (data, index) =>{
      (
        <Card key={index} >
        <CardItem>
          <Left>
            <Body>
              <Text>{data.title}</Text>
            </Body>
          </Left>
          <Right>
            <Text>{data.currency}</Text>   
          </Right>
        </CardItem>
          <SliderBox
                images={data.imageUrl}
                sliderBoxHeight={200}
                onCurrentImagePressed={async index =>
                    {
                      this.props.navigation.navigate("Negotiation", { artworkId: data.artworkId, negotiationId: data.negotiationId})
                    } 
                }
                dotColor="red"
                inactiveDotColor="#90A4AE"
          />      
        <CardItem >
        </CardItem>
      </Card>
        )})

    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Auction</Title>
          </Body>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active={ this.state.activeOngoing}  
            onPress={()=>{
                this.setState({
                    activeOngoing: true,
                    activeClosed: false,
                    activeSubmit: false,
                    negotiationData: this.state.requestedData
                })
            }}
          >
            <Text>Ongoing</Text>
          </Button>
          <Button active={ this.state.activeClosed}
            onPress={()=>{
                this.setState({
                    activeOngoing: false,
                    activeClosed: true,
                    activeSubmit: false,
                    negotiationData: this.state.receivedData
                })
            }}
          >
            <Text>Closed</Text>
          </Button>
          <Button active={ this.state.activeSubmit}
            onPress={()=>{
                this.setState({
                    activeOngoing: false,
                    activeClosed: false,
                    activeSubmit: true,
                    negotiationData: this.state.receivedData
                })
            }}
          >
            <Text>Submit Request</Text>
          </Button>
        </Segment>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
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
            {this.state.activeSubmit ? <SubmitAuctionScreen 
              userId = {this.props.userId} /> : negotiationHistory}
        </Content>
        </KeyboardAwareScrollView>
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
   moreArtworkDetailsAction, getUserProfileAction })(AuctionScreen)


