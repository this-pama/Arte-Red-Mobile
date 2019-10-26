import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input, Segment,
  Card, CardItem, Accordion } from 'native-base';
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
import CountDown from 'react-native-countdown-component';

class AuctionScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      allnegotiationData: {},
      negotiationData: [],
      closedNegotiationData: [],
      requestedData: [],
      receivedData: [],
      activeOngoing: true,
      activeClosed: false,
      activeSubmit: false,
      refreshing: false,
      totalDuration: '',
      bidValue: '',
    }
  }

  async componentDidMount() {
    this.getAuctionDetails()
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

  getAuctionDetails= async ()=>{
    var url = apiUrl + "auction";
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result

      var res = await response.json();
      // console.warn(res)
      if (res.ongoing.length >= 0 ) {
        console.warn(res)
        this.setState({
          allnegotiationData : res,
          negotiationData : res.ongoing || [],
          closedNegotiationData: res.closed,
          fetch: true
        })
      }
      else  {
        console.warn("Can not get negotiation data")  
        this.setState({
          fetch: true
        })
        return    
      }
}

_onRefresh = () => {
    this.setState({refreshing: true});
    this.getAuctionDetails().then(() => {
      this.setState({refreshing: false});
    })
}

handleBidValue = bidValue => {
  if (+bidValue){
      this.setState({
          bidValue
      })
  }
}

submitBid= async (id)=>{

  var url = apiUrl + "auction/bid/" + id;
  var result = await fetch(url, {
    method: 'PUT',
    headers: { 
      'content-type': 'application/json',
      // "Authorization": `Bearer ${this.props.jwt}`
     },
     body: JSON.stringify({
        userId: this.props.userId,
        bidPrice: this.state.bidValue,
        email: this.props.profile.email,
    })
  })
  var response = await result

    var res = await response.json();
    if (res.ongoing.length >= 0 ) {
      let negoReverse = res.ongoing.reverse()
      let closedReverse = res.closed.reverse()
      let allReverse = {
        ongoing: negoReverse,
        closed: closedReverse
      }
      this.setState({
        allnegotiationData : allReverse,
        negotiationData : negoReverse|| [],
        closedNegotiationData: closedReverse || [],
      })
    }
    else  {
      console.warn("Can not bid")  
      return    
    }
}

  render() {

    const negotiationHistory = this.state.negotiationData.map( (data, index) =>
      (
        <Card key={index} >
        <CardItem>
          <Left>
            <Body>
              <Text>{data.title}</Text>
              <Text>{data.artistName}</Text>
            </Body>
          </Left>
          <Right>
            <Text> {data.currency} {data.askingPrice}</Text> 
            <Text>{data.size}</Text>  
          </Right>
        </CardItem>
          <SliderBox
            images={data.imageUrl}
            sliderBoxHeight={250}
            onCurrentImagePressed={async index =>
                {
                  this.props.navigation.navigate("", { artworkId: data.artworkId, negotiationId: data.negotiationId})
                } 
            }
            dotColor="red"
            inactiveDotColor="#90A4AE"
          />      
        
        <Accordion
            dataArray={[{title: "Auction Description", content: data.description }]}
            headerStyle={{ backgroundColor: "#f2f2f2" }}
            contentStyle={{ backgroundColor: "#fff" }}
          />
        <CardItem>
            {/* <View> */}
              <Body>
                <Timer data= {data} />
              </Body>
            {/* </View> */}
            <Right>
              <Text>Orgainizer</Text>
              <Text>{data.organizerName}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent>
                <Text>Highest Bidder</Text>
              </Button>
            </Left>
            <Right>
              <Button transparent>
                <Text>{ this.props.userId === data.bidding[data.bidding.length -1 ].userId ? "You" : 'Anonymous Bidder' }</Text>
              </Button>
            </Right>
          </CardItem>
        <CardItem>
                <Text>{data.currency}</Text>
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.bidValue}
                  onValueChange={ this.handleBidValue }
              >
                  
                  {/* <Picker.Item label={`${data.askingPrice }`}
                     value={`${data.askingPrice}`}
                   /> */}
                  <Picker.Item label={`${Math.floor(data.askingPrice + (data.askingPrice * 0.3))}`}
                     value={`${Math.floor(data.askingPrice + (data.askingPrice * 0.3))}`}
                   />
                  <Picker.Item label={`${Math.floor(data.askingPrice + (data.askingPrice * 0.5))}`}
                     value={`${Math.floor(data.askingPrice + (data.askingPrice * 0.5))}`}
                   />
                   <Picker.Item label={`${Math.floor(data.askingPrice + (data.askingPrice * 0.7))}`}
                     value={`${Math.floor(data.askingPrice + (data.askingPrice * 0.7))}`}
                   />
                   <Picker.Item label={`${Math.floor(data.askingPrice + (data.askingPrice ))}`}
                     value={`${Math.floor(data.askingPrice + (data.askingPrice))}`}
                   />
                   <Picker.Item label={`${Math.floor(data.askingPrice + (data.askingPrice * 1.5))}`}
                     value={`${Math.floor(data.askingPrice + (data.askingPrice * 1.5))}`}
                   />
              </Picker>
              {/* </Body> */}
              <Right>
                <Button transparent
                  onPress={()=>{
                    if(this.state.bidValue < data.askingPrice){
                      alert('You can not bid below the asking price')
                      return
                    }
                    else{
                      this.submitBid(data._id)
                    }
                  }}
                >
                  <Text>Bid</Text>
                </Button>
              </Right>
          </CardItem>
          
      </Card>
        ))

    const closedAuction = this.state.closedNegotiationData.map( (data, index) =>
      (
        <Card key={index} >
        <CardItem>
          <Left>
            <Body>
              <Text>{data.title}</Text>
              <Text>{data.artistName}</Text>
            </Body>
          </Left>
          <Right>
            <Text> {data.currency} {data.askingPrice}</Text> 
            <Text>{data.size}</Text>  
          </Right>
        </CardItem>
          <SliderBox
            images={data.imageUrl}
            sliderBoxHeight={250}
            onCurrentImagePressed={async index =>
                {
                  this.props.navigation.navigate("", { artworkId: data.artworkId, negotiationId: data.negotiationId})
                } 
            }
            dotColor="red"
            inactiveDotColor="#90A4AE"
          />      
        
        <Accordion
            dataArray={[{title: "Auction Description", content: data.description }]}
            headerStyle={{ backgroundColor: "#f2f2f2" }}
            contentStyle={{ backgroundColor: "#fff" }}
        />
        <CardItem>
          <Left>
            <Button transparent>
              <Text>Closed</Text>
            </Button>
          </Left>
          <Right>
            <Text>{data.organizerName}</Text>
          </Right>
        </CardItem>        
      </Card>
        ))

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
              // let negoReverse = this.state.allnegotiationData.ongoing.reverse()
              // let closedReverse = res.closed.reverse()
                this.setState({
                    activeOngoing: true,
                    activeClosed: false,
                    activeSubmit: false,
                    negotiationData: this.state.allnegotiationData.ongoing || [],
                    closedNegotiationData: []
                })
            }}
          >
            <Text>Ongoing</Text>
          </Button>
          <Button active={ this.state.activeClosed}
            onPress={()=>{
              // let negoReverse = this.state.allnegotiationData.ongoing.reverse()
              // let closedReverse = this.state.allnegotiationData.closed.reverse() 
                this.setState({
                    activeOngoing: false,
                    activeClosed: true,
                    activeSubmit: false,
                    negotiationData: [],
                    closedNegotiationData: this.state.allnegotiationData.closed || []
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
                    negotiationData: [],
                    closedNegotiationData: []
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
            {this.state.activeSubmit ? <SubmitAuctionScreen navigation={this.props.navigation}
              userId = {this.props.userId} /> : ( this.state.activeClosed ? closedAuction : negotiationHistory)}
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


// create a timer component
class Timer extends React.Component{
  constructor(props) {
    super(props);
    //initialize the counter duration
    this.state = {
      totalDuration: 0,
      expire: ''
    };
  }

  componentDidMount(){
    var expirydate = new Date(this.props.data.createdAt).getTime() + (this.props.data.duration * 60 * 60 * 1000 )
    var distance = expirydate - new Date().getTime()
      // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // convert to seconds
    var d = days * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds;
    this.setState({ totalDuration: d });
    
  }

  render(){
   
    return(
      <CountDown
        until={this.state.totalDuration}
        // onPress={()=> alert(this.state.totalDuration)}
        // showSeparator= {true }
        // separatorStyle ={{color: 'blue'}}
        onFinish={()=> this.setState({ expire: "EXPIRED"})}
        digitStyle={{backgroundColor: '#FFF'}}
        digitTxtStyle={{color: 'blue'}}
        size={20}
      />
    )
  }
  
}