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
import { Image } from 'react-native'

class MyExhibition extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      exhibitionData: [],
      allExhibitionData: [], 
      registeredExhibitionData: [],
      allRegisteredExhibitionData: [],
      submittedAuctionIsActive: true,
      wonAuctionIsActive: false,
      refreshing: false,
    }
  }

  async componentDidMount() {
    this.getMyExhibition()
    this.getMyRegisteredExhibition()
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

  getMyRegisteredExhibition= async ()=>{
    var url = apiUrl + "exhibition/myexhibition/registered/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result

      var res = await response.json()
      let rev = res.reverse()
      if (res[0]._id) {
        console.warn(res)
        this.setState({
          registeredExhibitionData : rev,
          allRegisteredExhibitionData: rev,
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

  getMyExhibition= async ()=>{
    var url = apiUrl + "exhibition/myexhibition/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result

      var res = await response.json()
      let rev = res.reverse()
      if (res[0]._id) {
        console.warn(res)
        this.setState({
          exhibitionData : rev,
          allExhibitionData: rev,
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

_onRefresh = () => {
    this.setState({refreshing: true});
    this.getMyRegisteredExhibition()
    this.getMyExhibition().then(() => {
      this.setState({refreshing: false});
    })
}

  render() {
    const myExhibition = this.state.exhibitionData.map( (exhibition, index) =>
      (
        <Card style={{flex: 0}} key={exhibition._id}>
            <CardItem>
              <Left>
                <Body>
                  <Text>{exhibition.title}</Text>
                  {/* <Text note>April 15, 2016</Text> */}
                  <Text note>{exhibition.country}</Text>
                </Body>
              </Left>
              <Right>
                  <TouchableOpacity 
                    onPress={()=>{ this.props.navigation.navigate('EditExhibition',{
                        id: exhibition._id
                    })}}
                  >
                    <Icon name='md-brush' />
                  </TouchableOpacity>
                
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="time" />
                  <Text>{exhibition.date}</Text>
                  <Text>{exhibition.time ? ( exhibition.time > 12 ? `${exhibition.time -12} 'PM'` :`${exhibition.time} 'AM'` ): null}</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: exhibition.imageUrl} } style={{height: 300, width: null, flex: 1}}/>
            </CardItem>
            {/* <CardItem> */}
            <Accordion
                dataArray={[{title: "Description", content: exhibition.longDescription }]}
                headerStyle={{ backgroundColor: "#f2f2f2" }}
                contentStyle={{ backgroundColor: "#fff" }}
            />
            {/* </CardItem> */}
            <CardItem>
              <Left>
                  <Button transparent textStyle={{color: '#87838B'}}
                    onPress={()=>{
                        this.props.navigation.navigate('ExhibitionAttendee',{
                            data: exhibition.attendee
                        })
                    }}
                  >
                    <Icon name="people" />
                    <Text>{exhibition.registrationCount} Booked Tickets</Text>
                  </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}>
                    <Icon name="home" />
                    <Text>{exhibition.organizerName}</Text>
                </Button>
              </Body>
              <Right>
              { new Date(exhibition.date) < new Date() ? (
                <Button transparent >
                  <Text>Closed</Text>
                </Button>
              ) : ( 
                exhibition.capacity >= exhibition.registrationCount ? (
                <Button transparent >
                  <Text>Sold Out</Text>
                </Button>
              ) : 
                (<Button transparent textStyle={{color: '#87838B'}}
                  onPress={()=> {
                    if(!this.props.userId){
                       return  Toast.show({
                          text: "You need to sign in to register",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                    }
                    else{
                        this.props.navigation.navigate("RegisterForExhibition", {
                          id: exhibition._id
                        })
                    }
                  }}
                >
                  <Text>Register</Text>
                </Button>)
              )
              }
              </Right>
            </CardItem>
        </Card>
        ))

    registeredExhibition = this.state.registeredExhibitionData.map( (exhibition, index) =>
    (
      <Card style={{flex: 0}} key={exhibition._id}>
          <CardItem>
            <Left>
              <Body>
                <Text>{exhibition.title}</Text>
                {/* <Text note>April 15, 2016</Text> */}
                <Text note>{exhibition.country}</Text>
              </Body>
            </Left>
            <Right>
              {/* <Icon name='md-brush' /> */}
              <Button transparent textStyle={{color: '#87838B'}}>
                <Icon name="time" />
                <Text>{exhibition.date}</Text>
                <Text>{exhibition.time ? ( exhibition.time > 12 ? `${exhibition.time -12} 'PM'` :`${exhibition.time} 'AM'` ): null}</Text>
              </Button>
            </Right>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: exhibition.imageUrl} } style={{height: 300, width: null, flex: 1}}/>
          </CardItem>
          {/* <CardItem> */}
          <Accordion
              dataArray={[{title: "Description", content: exhibition.longDescription }]}
              headerStyle={{ backgroundColor: "#f2f2f2" }}
              contentStyle={{ backgroundColor: "#fff" }}
          />
          {/* </CardItem> */}
          <CardItem>
            <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="person" />
                  <Text>Registered</Text>
                </Button>
            </Left>
            <Body>
              <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="home" />
                  <Text>{exhibition.organizerName}</Text>
              </Button>
            </Body>
            <Right>
            { new Date(exhibition.date) < new Date() ? (
              <Button transparent >
                <Text>Closed</Text>
              </Button>
            ) : ( 
              exhibition.capacity >= exhibition.registrationCount ? (
              <Button transparent >
                <Text>Sold Out</Text>
              </Button>
            ) : 
              (<Button transparent textStyle={{color: '#87838B'}}
                onPress={()=> {
                  if(!this.props.userId){
                     return  Toast.show({
                        text: "You need to sign in to register",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.props.navigation.navigate("RegisterForExhibition", {
                        id: exhibition._id
                      })
                  }
                }}
              >
                <Text>Register</Text>
              </Button>)
            )
            }
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
            <Title>My Exhibition</Title>
          </Body>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active={ this.state.submittedAuctionIsActive }  
            onPress={()=>{
                this.setState({
                    submittedAuctionIsActive: true,
                    wonAuctionIsActive: false,
                    exhibitionData: this.state.allExhibitionData,
                    registeredExhibitionData: []
                })
            }}
          >
            <Text>My Exhibition</Text>
          </Button>
          <Button active={ this.state.wonAuctionIsActive}
            onPress={()=>{
                this.setState({
                    submittedAuctionIsActive: false,
                    wonAuctionIsActive: true,
                    registeredExhibitionData: this.state.allRegisteredExhibitionData,
                    exhibitionData: []
                })
            }}
          >
            <Text>Registered Exhibition</Text>
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
            { this.state.submittedAuctionIsActive ? myExhibition : (this.state.wonAuctionIsActive ? registeredExhibition : <Text>No Auction Data</Text>)}
        </Content>
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
   moreArtworkDetailsAction, getUserProfileAction })(MyExhibition)


