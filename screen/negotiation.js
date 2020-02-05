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
import {BackHandler, RefreshControl } from "react-native"
import {
  Notifications,
} from 'expo';
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class NegotiationScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      artwork: {
        price: 0
      },
      errMessage:"",
      negotiationValue: 0,
      negotiating: false,
      currency: '',
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
      message: '',
      modalVisible: false,
      initiateNegotiation: false,
      refreshing: false,
    }
  }

  componentDidMount = async () =>{
    this.setState({
      artwork: {
        price: 0
      }
    })

    this.getArtworkDetails()

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

  getArtworkDetails = async ()=>{
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
      console.warn(res)
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
  }

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
          fetch: true,
          negotiationData: {
            data: [],
            history: []
          }
        })
        return    
      }
    // }
  } else{
    console.warn("no id")
    this.setState({
      fetch: true,
      negotiationData: {
        data: [],
        history: []
      }
    })
    return
  }
}

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
        name: `${this.props.profile.firstName} ${this.props.profile.lastName}`,
      }),
    });

    var response = await result;
    if(response.status !== 200 ){
      console.warn("failed response", response )
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
          errMessage: "",
          spin: false,
          modalVisible: true,
          message: "Negotiation Request sent successfully",
        })
      }

      else  {
        console.warn("Negotiation Request failed")
        this.setState({
          errMessage: "",
          spin: false,
          modalVisible: true,
          message: "Negotiation Request failed",
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
          errMessage: "",
          spin: false,
          modalVisible: true,
          message: "Negotiation Response sent!",
        })

        // let message= `A seller has responded to one of your negotiation request`
        // this.sendPushNotification(userId, "Negotiation Response", message, this.state.artwork)
      }

      else  {
        console.warn("Notification failed")
        this.setState({
          errMessage: "Notification failed",
          spin: false,
          modalVisible: true,
          message: "Negotiation Response failed",
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
        askingPrice: askingPrice,
        userId: userId,
        date: date,
        time: time
      }),
    });

    var response = await result;

      var res = await response.json();
      if (res._id) {
        console.warn("accept",res)
        this.setState({
          negotiationData: res,
          errMessage: "",
          spin: false,
          modalVisible: true,
          message: "Negotiation Request sent!",
        })

          // let message= `A seller has responded to one of your negotiation request`
          // this.sendPushNotification(userId, "Negotiation Response", message, this.state.artwork)
      }

      else  {
        console.warn("Notification failed")
        this.setState({
          errMessage: "",
          spin: false,
          modalVisible: true,
          message: "Negotiation Request failed",
        })
        
      }
  }

  sendPushNotification = async (userId, title, message, data) =>{
    var url = apiUrl + "user/send-notification/direct-message"
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId,
        title,
        message,
        data
      })
    });
    var response = await result;
    if(response.status !== 200 ){
      return
    }
    else{
      return
    }
  }


  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getArtworkDetails().then(() => {
      this.setState({refreshing: false});
    })
}


  render() {
    
    const negotiate= (
      <View>
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

          <View style={{ padding: 25 }}>
              <Button danger block
               onPress={()=>{
                this.setState({
                  spin: true
                })
               
                let message= `You have a new negotiation request for your artwork.`
                this.sendPushNotification(this.state.artwork.userId, "Negotiation Request", message, this.state.artwork)
                this.sendNegotiation()
              }}
            >
              {this.state.spin ? <Spinner color="white" small /> : <Text>Send Negotiation Request</Text> }
            </Button>
          </View>   
      </Form>
      {/* <View>
        {buyerHistory}
      </View> */}
      </View>
    )
    
    const history = this.state.negotiationData.history.map( (data, index) =>
        (
          <NegotiationHistory data= {data} index={index} 
            accept={this.accept}
            reject={this.reject}
            currency= {this.state.artwork.currency}
          />
        ) 
    )

    const buyerHistory = this.state.negotiationData.history.map( (data, index) =>
      data.userId === this.props.userId
        ? (
          <View style={{ padding: 25}}>
          <Card key={index} >
              <CardItem>
                <Left>
                  <Body >
                    <Text note>Asking Price</Text>
                    <Text note>{this.state.artwork.currency} {data.askingPrice}</Text>
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
                        <Text>Awaiting Sponsor's Response</Text>
                      ) }
                    </Button>
                  </Right>
              </CardItem>
          </Card>
          </View>
        )
      : null 
      )

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
            <Content style={{padding: 10 }} 
                refreshControl={
                  <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  />
              }
            >
            {!this.state.fetch ? (
              <Body>
                <Spinner color="red"  small />
              </Body>
            ) : null }
          <Body>
            <Text note style={{color: "red"}}> {this.state.errMessage} </Text>
          </Body>
              {   this.state.artwork.isNegotiable && this.state.artwork.userId != this.props.userId ? (this.state.initiateNegotiation ? (
                <View>
                  <Text style={{paddingLeft: 20, paddingTop: 15 }}>Selling Price</Text>
                  <Text note style={{paddingLeft: 20 }}>
                    {`${this.state.artwork.currency}  ${this.state.artwork.price}`}
                  </Text>
                  { negotiate }
                </View>
              ) : (
                <View style={{ padding : 25 }}>
                  <Button danger block
                    onPress={()=>{
                      this.setState({
                        initiateNegotiation: true
                      })
                    }}
                  >
                   <Text>Start Negotiation</Text>
                </Button>
              </View> 
              )) : null }
              

              {/* check if artwork is negotiable and render appropriately */}
              { this.state.artwork.isNegotiable ? (
                <View>

                    {/* show history of negotiation to seller */}
                    <View>
                    { this.state.artwork.userId === this.props.userId ? history : null }
                    {/* show history of negotiated values and reply to buyer    */}
                    </View>
                    <View>
                    { this.state.initiateNegotiation ? null : buyerHistory }
                    </View>
                </View>
              ) : (
                 this.state.artwork.userId === this.props.userId ? 
                  (<Body>
                    <Text style={{ padding: 20 }}>You don't have any negotiation request because this artwork is not negotiable.</Text>
                  </Body>)
                    :
                (<Body>
                  <Text style={{ padding: 20 }}>This Artwork is not negotiable. Kindly proceed to payment.</Text>
                </Body>)
                
              ) }
             
          </Content>

           {/* modalVisisble */}
        <Modal
        visible={this.state.modalVisible}
        modalTitle={<ModalTitle title="Message" />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside= { () => {
          this.setState({ modalVisible: false });
        }}
        width
        footer={
          <ModalFooter>
            <ModalButton
              text="Exit"
              onPress={() => this.setState({ modalVisible: false })}
            />

          </ModalFooter>
        }
      >
        <ModalContent >
          <View style= {{ padding : 12, paddingBottom: 20 }}>
            <Body>
              <Text >{ this.state.message }</Text>
            </Body>
          </View>
        </ModalContent>
      </Modal>
        
        
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            { this.state.artwork.userId != this.props.userId ? (
            <Button horizontal
             onPress={()=> this.props.navigation.navigate("Buy",
             { routeName: "Negotiation",
                artworkId: this.state.artwork._id})
                } >
              <Icon name="card"  />
              <Text>Pay</Text>
            </Button>
            ):(
            <Button vertical
              onPress={()=> this.props.navigation.navigate('MyNegotiation')}
            >
              <Icon name="notifications" />
              <Text>My Negotiation</Text>
            </Button>
            )}
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
   moreArtworkDetailsAction, getUserProfileAction })(NegotiationScreen)


class NegotiationHistory extends React.Component{
  constructor(props){
    super(props);
    this.state={
      spin: false,
      spin2: false
    }
  }
  render(){
    const spinner = <Spinner color='red' />
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
            <Item>
              <Left>
                <Button transparent
                  onPress={()=>{ 
                    this.setState({
                      spin2: true
                    })
                    this.props.reject(this.props.data.userId, this.props.data.askingPrice, this.props.data.time, this.props.data.date) }}
                >
                  { this.state.spin2 ? spinner : <Text>Reject</Text> }
                </Button>
            </Left>
            <Right>
              <Button transparent 
                onPress={()=> {
                  this.setState({
                    spin: true
                  })
                  this.props.accept(this.props.data.userId, this.props.data.askingPrice, this.props.data.time, this.props.data.date ) }
                }>
                { this.state.spin ? spinner : <Text>Accept</Text> }
              </Button>
            </Right>
          </Item>
          )
          )}
        </CardItem>
    </Card>
    )
  }
}