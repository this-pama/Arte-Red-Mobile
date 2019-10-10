import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input,
  Card, CardItem } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"
import {BackHandler} from "react-native"
import {
  Notifications,
} from 'expo';


class NegotiationScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      artwork: {},
      errMessage:"",
      negotiationValue: 0,
      negotiating: false,
      currency: '',
      ngn_euro: "0",
      ngn_usd: "0",
      exchangeRate: "0",
      exchangeRateIsFetech: false,
      disable: true,
      fetch: false,
      notification: {},
      negotiationData: {
        data: [],
        history: []
      },
      comment: "",
      spin: false,
    }
  }

  async componentDidMount() {
    this.setState({
      artwork: {}
    })

    var url = apiUrl + "artwork/" + this.props.navigation.getParam("artworkId", null );
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt}`
       }
    });
    var response = await result;
    if(response.status !== 200 ){
      console.warn("fetching artworks failed response")
      this.setState({
        artwork: {}
      })
      
      return
    }
    else{
      var res = await response.json();
      if (res._id) {
        // console.warn(res)
        this.setState({
          artwork: res,
          currency: res.currency,
          
        })

        this.getNegotiationDetails(res.negotiationId)
      }

      else  {
        console.warn("Can't get artwork")
        this.setState({
          artwork: {}
        })
        
      }
    }

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate(this.props.navigation.getParam("routeName", "Home"), 
      {id: this.state.profileId} )
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

  getNegotiationDetails= async negotiationId =>{
    console.warn(negotiationId)
    if( negotiationId != null && negotiationId != undefined){
    var url = apiUrl + "negotiation/" + negotiationId;
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
          negotiationData : res,
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
    // }
  } else{
    console.warn("no id")
    this.setState({
      fetch: true
    })
    return
  }
}

  // ngn_usdConvertion= async() =>{
  //   let url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=NGN&to_currency=USD&apikey=8E5NV5DT9IXIY1JG`
  //   await fetch(url, {
  //     method: 'GET'
  //   })
  //   .then( res=>{
  //     return res.json()
  //   }).then(net=> {
  //     this.setState({
  //       ngn_usd: net["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
  //       exchangeRateIsFetech: true
  //     })
  //   })
  // }

  // ngn_euroConvertion= async() =>{
  //   let url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=NGN&to_currency=EUR&apikey=8E5NV5DT9IXIY1JG`
  //   await fetch(url, {
  //     method: 'GET'
  //   })
  //   .then( res=>{
  //     return res.json()
  //   }).then(net=> {
  //     this.setState({
  //       ngn_euro: net["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
  //       exchangeRateIsFetech: true
  //     })
  //   })
  // }

  handleNegotiationValue = negotiationValue => {
    if (+negotiationValue){
        this.setState({
            negotiationValue,
            negotiating: true,
            errMessage: ""
        })
    }
  }

  handleCurrency = currency => {
    this.setState({
        exchangeRateIsFetech: false,
        currency,
    })
    this.currencyConvertion()
  }

  handleComment = comment => {
    if (comment.length > 0) {
      this.setState(
        {
          comment
        },
        this.validateForm
      );
    }
  };

  sendNotification = async (userMessage, sponsorMessage, sponsorId, email ) => {
    let MESSAGE_ENPOINT = apiUrl + "user/send-notification"
   
    fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        sponsorMessage,
        subject: 'New Negotiation Request',
        user:{
          username: sponsorId
        },
        userEmail: email,
      }),
    });
  }

  sendNegotiation =async ()=>{
    let ENPOINT = apiUrl + "negotiation/update/" + this.state.artwork._id
    let result = fetch(ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.props.userId,
        askingPrice: this.state.negotiationValue,
        comment: this.state.comment,
        name: this.props.profile.firstName,
      }),
    });

    var response = await result;
    if(response.status !== 200 ){
      console.warn("failed response")
      this.setState({
        spin: false
      })
      return
    }
    else{
      var res = await response.json();
      if (res._id) {
        console.warn(res)
        this.setState({
          errMessage: "Negotiation Request sent successfully",
          spin: false
        })
      }

      else  {
        console.warn("Negotiation Request failed")
        this.setState({
          errMessage: "Negotiation Request failed",
          spin: false
        })
        
      }
    }
  }

  reject =async (userId, askingPrice, time, date)=>{
    let ENPOINT = apiUrl + "negotiation/reject/" + this.state.negotiationData._id
    let result = fetch(ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        askingPrice,
        userId,
        time,
        date
      }),
    });

    var response = await result;

      var res = await response.json();
      if (res._id) {
        console.warn(res)
        this.setState({
          negotiationData: res,
          errMessage: "Notification sent!",
          spin: false
        })
        let userMessage= `Your response to the negotiation request has been sent.`
        let sponsorMessage= `You have a new response to a negotiation request.`
        this.sendNotification(userMessage, sponsorMessage, 
          userId, this.props.profile.email
          )
      }

      else  {
        console.warn("Notification failed")
        this.setState({
          errMessage: "Notification failed",
          spin: false
        })
        
      }
  }

  accept =async (userId, askingPrice, time, date)=>{
    let ENPOINT = apiUrl + "negotiation/accept/" + this.state.negotiationData._id
    let result = fetch(ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        askingPrice,
        userId,
        date,
        time
      }),
    });

    var response = await result;

      var res = await response.json();
      if (res._id) {
        console.warn("accept",res)
        this.setState({
          negotiationData: res,
          errMessage: "Notification sent!",
          spin: false
        })
        let userMessage= `Your response to the negotiation request has been sent.`
        let sponsorMessage= `You have a new response to a negotiation request.`
        this.sendNotification(userMessage, sponsorMessage, 
          userId, this.props.profile.email
          )
      }

      else  {
        console.warn("Notification failed")
        this.setState({
          errMessage: "Notification failed",
          spin: false
        })
        
      }
  }

  render() {
    
    const negotiate= (
      <Form >
          <Item >
              <Label>{ this.state.artwork.currency }</Label>
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.negotiationValue}
                  onValueChange={ this.handleNegotiationValue }
              >
                  
                  <Picker.Item label={`${this.state.artwork.price }`}
                     value={`${this.state.artwork.price}`}
                   />
                  <Picker.Item label={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/5))}`}
                     value={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/5))}`}
                   />
                  <Picker.Item label={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/4))}`}
                     value={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/4))}`}
                   />
                   <Picker.Item label={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/3))}`}
                     value={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/3))}`}
                   />
                   <Picker.Item label={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/2))}`}
                     value={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)/2))}`}
                   />
                   <Picker.Item label={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)))}`}
                     value={`${Math.floor(this.state.artwork.price - (this.state.artwork.price * (this.state.artwork.negotiationPercent/100)))}`}
                   />
              </Picker>
          </Item>

          <Item stackedLabel>
            <Label>Comment</Label>
            <Input onChangeText= { this.handleComment } value={this.state.comment } autoCapitalize='none' />
          </Item>

          <View style={{ paddingTop : 15, paddingBottom: 25 }}>
              <Button danger block
               onPress={()=>{
                this.setState({
                  spin: true
                })
                let userMessage= `Your negotiation request has been sent to the sponsor of the artwork.`
                let sponsorMessage= `You have a new negotiation request for your artwork.`
                this.sendNotification(userMessage, sponsorMessage, 
                  this.state.artwork.userId, this.props.profile.email
                  )
                this.sendNegotiation()
              }}
            >
              {this.state.spin ? <Spinner color="white" small /> : <Text>Send Negotiation Request</Text> }
            </Button>
          </View>   
      </Form>
    )
    
    const history = this.state.negotiationData.history.map( (data, index) =>{
      if(this.state.negotiationData.length = 0){
        return (
          <Body>
            <Text>There is currently no negotiation request for this artwork.</Text>
          </Body>
        )
      }else{
        (
          <NegotiationHistory data= {data} index={index} 
            accept={this.accept}
            reject={this.reject}
            currency= {this.state.artwork.currency}
          />
        )
      }
    })

    const buyerHistory = this.state.negotiationData.history.map( (data, index) =>{
      if(data.userId = this.props.userId){
        return(
          <View style={{ paddingBottom: 25}}>
          <Card key={index} >
              <CardItem>
                <Left>
                  <Body >
                    <Text note>Asking Price</Text>
                    <Text note>{this.props.currency} {data.askingPrice}</Text>
                  </Body>
                </Left>
                <Right>
                    <Text note>{data.time}</Text>  
                    <Text note>{data.date}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Text>{data.comment}</Text>
              </CardItem>
              <CardItem>
                  <Right>
                    <Button transparent >
                      { data.accept ? (
                        <TouchableOpacity
                        onPress={()=> this.props.navigation.navigate("Buy",
                          { routeName: "Negotiation",
                            artworkId: this.state.artwork._id})
                            } 
                        >
                          <Text>Accepted! Proceed to Payment</Text>
                        </TouchableOpacity>
                        
                      ) : (
                        data.reject ? (
                          <Text>Rejected</Text>
                        ) : 
                        <Text>Awaiting Response</Text>
                      ) }
                    </Button>
                  </Right>
              </CardItem>
          </Card>
          </View>
        )
      }
      else{ return null }
      })

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Negotiate</Title>
          </Body>
        </Header>
        {/* load a spinner when all data are not fetchfrom server */}
            <Content style={{padding: 10 }}>
            {!this.state.fetch ? (
              <Body>
                <Spinner color="red"  small />
              </Body>
            ) : null }
          <Body>
            <Text note style={{color: "red"}}> {this.state.errMessage} </Text>
          </Body>
              <Text style={{paddingLeft: 20, paddingTop: 15 }}>Selling Price</Text>
              <Text note style={{paddingLeft: 20 }}>
                {`${this.state.artwork.currency}  ${this.state.artwork.price}`}
              </Text>
              {/* show list of available negotiation prices to buyer if artwork is negotiable */}
              {this.state.negotiating ? (
                <View>
                  <Text style={{paddingLeft: 20, paddingTop: 25 }}>Asking Price</Text>
                  <Text note style={{paddingLeft: 20 }}>{this.state.artwork.currency}  {this.state.negotiationValue}</Text>
                </View>
              ): null }
              {/* show history of negotiation to seller */}
              { this.state.artwork.userId === this.props.userId ? history : negotiate }
              {/* show history of negotiated values and reply to buyer    */}
              {buyerHistory}
          </Content>
        
        { this.state.artwork.userId != this.props.userId ? (
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
              <Text>Home</Text>
            </Button>
            <Button horizontal
             onPress={()=> this.props.navigation.navigate("Buy",
             { routeName: "Negotiation",
                artworkId: this.state.artwork._id})
                } >
              <Icon name="arrow-forward"  />
              <Text>Pay</Text>
            </Button>
          </FooterTab>
        </Footer>) : null }
        
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
   moreArtworkDetailsAction, getUserProfileAction })(NegotiationScreen)


class NegotiationHistory extends React.Component{
  render(){
    return(
      <Card key={this.props.index} >
        <CardItem>
          <Left>
            <Body >
              <Text >{this.props.data.name}</Text>
              <Text note>Asking Price</Text>
                <Text note>{this.props.currency} {this.props.data.askingPrice}</Text>
            </Body>
          </Left>
          <Right>
              <Text note>{this.props.data.time}</Text>  
              <Text note>{this.props.data.date}</Text>
          </Right>
        </CardItem>
        <CardItem>
          <Text>{this.props.data.comment}</Text>
        </CardItem>
        <CardItem>
          {this.props.data.accept ? ( 
              <Right>
                <Button transparent >
                  <Text>Accepted</Text>
                </Button>
              </Right>
          ) : (this.props.data.reject ? (
              <Right>
                <Button transparent >
                  <Text>Rejected</Text>
                </Button>
              </Right>
          ) : (
            <View>
              <Left>
                <Button transparent
                  onPress={()=> this.props.reject(this.props.data.userId, this.props.data.askingPrice, this.props.data.time, this.props.data.date) }
                >
                  <Text>Reject</Text>
                </Button>
            </Left>
            <Right>
              <Button transparent 
                onPress={()=> this.props.accept(this.props.data.userId, this.props.data.askingPrice, this.props.data.time, this.props.data.date ) }
              >
                <Text>Accept</Text>
              </Button>
            </Right>
          </View>
          )
          )}
        </CardItem>
    </Card>
    )
  }
}