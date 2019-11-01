import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input, Segment, Accordion,
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
import CountDown from 'react-native-countdown-component';

class MyAuction extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      auctionData: [],
      allAuctionData: [],  
      submittedAuctionIsActive: true,
      wonAuctionIsActive: false,
      refreshing: false,
      allWonAuction: [],
      wonAuction: [],
    }
  }

  async componentDidMount() {
    this.getmyAuction()
    this.getWonAuction()
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

  getmyAuction= async ()=>{
    var url = apiUrl + "auction/myauction/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result

      var res = await response.json()
      console.warn('getmyAuction', res)
      let rev = res.reverse()
      if (res.length > 0 ) {
        // console.warn(res)
        this.setState({
          auctionData : rev,
          allAuctionData: rev,
          fetch: true
        })
      }
      else  {
        console.warn("Can't auction data")  
        this.setState({
          fetch: true
        })
        return    
      }
}

getWonAuction= async ()=>{
  var url = apiUrl + "auction/winner/" + this.props.userId;
  var result = await fetch(url, {
    method: 'GET',
    headers: { 
      'content-type': 'application/json',
      // "Authorization": `Bearer ${this.props.jwt}`
     }
  })
  var response = await result

    var res = await response.json();
    console.warn('getWonAuction', res)
    if (res.win.length >= 0  && res.success ) {
      // console.warn(res)
      this.setState({
        allWonAuction: res.win,
        wonAuction : res.win || [],
      })
    }
    else  { 
      this.setState({
        errMessage: "No Won Auction"
      })
      return    
    }
}


auctionTimerIsFinished= async ( auctionId )=>{
  var url = apiUrl + "auction/finish/" + auctionId;
  var result = await fetch(url, {
    method: 'GET',
    headers: { 
      'content-type': 'application/json',
      // "Authorization": `Bearer ${this.props.jwt}`
     }
  })
  var response = await result

    var res = await response.json();
    console.warn('finished timmer', res)
    if (res.ongoing  && res.success ) {
      this.getmyAuction()
      this.getWonAuction()
    }
    else  { 
      return    
    }
}


_onRefresh = () => {
    this.setState({refreshing: true});
    this.getWonAuction()
    this.getmyAuction().then(() => {
      this.setState({refreshing: false});
    })
}

  render() {
    const myAuction = this.state.auctionData.map( (data, index) =>
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
            <Text>Starting Price</Text>  
            <Text> {data.currency} {data.price}</Text> 
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
                <Timer data= {data} 
                  auctionTimerIsFinished= { this.auctionTimerIsFinished(data._id) }
                />
            </Left>
            <Right>
              <Text>Current Price</Text>
              <Text>{data.currency} {data.askingPrice}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent>
                <Text>Auction Status</Text>
              </Button>
            </Left>
            <Right>
              <Button transparent>
                <Text>{ !data.approved ? "Awaiting Approval" : ( data.sold  ? "Sold" : 'Not Yet Sold') }</Text>
              </Button>
            </Right>
          </CardItem>         
      </Card>
        ))

    wonAuction= this.state.wonAuction.map( (data, index) =>
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
          <Text>Price</Text>  
          <Text> {data.currency} {data.askingPrice}</Text> 
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
              <Text>Auction Status</Text>
            </Button>
          </Left>
          <Right>
            <Button transparent>
              <Text>{ ((new Date(data.approvedDate).getTime() + (data.duration * 60 * 60 * 1000 )) <= new Date().getTime()) ? "WON" :  'Auction is Ongoing' }</Text>
            </Button>
          </Right>
        </CardItem>         
    </Card>
      ))


    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Activities")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>My Auctions</Title>
          </Body>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active={ this.state.submittedAuctionIsActive }  
            onPress={()=>{
                this.setState({
                    submittedAuctionIsActive: true,
                    wonAuctionIsActive: false,
                    auctionData: this.state.allAuctionData,
                    wonAuction: []
                })
            }}
          >
            <Text>Submitted Auction</Text>
          </Button>
          <Button active={ this.state.wonAuctionIsActive}
            onPress={()=>{
                this.setState({
                    submittedAuctionIsActive: false,
                    wonAuctionIsActive: true,
                    auctionData: [],
                    wonAuction: this.state.allWonAuction
                })
            }}
          >
            <Text>Won Auction</Text>
          </Button>
        </Segment>
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
            { this.state.submittedAuctionIsActive ? myAuction : (this.state.wonAuctionIsActive ? wonAuction : <Text>No Auction Data</Text>)}
        </Content>
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
   moreArtworkDetailsAction, getUserProfileAction })(MyAuction)



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
      let approvedDate, expirydate
      if(this.props.data.approvedDate == NaN || this.props.data.approvedDate == undefined || this.props.data.approvedDate == null){
        approvedDate = new Date().getTime() 
      }
      expirydate = new Date(approvedDate).getTime() + (this.props.data.duration * 60 * 60 * 1000 )

      if(this.props.data.approvedDate == NaN || this.props.data.approvedDate == undefined || this.props.data.approvedDate == null){
        expirydate = new Date().getTime() 
      }

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
          onFinish={()=> this.props.auctionTimerIsFinished }
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: 'blue'}}
          size={20}
        />
      )
    }
    
  }