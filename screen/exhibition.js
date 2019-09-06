import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right,
  Card, CardItem, Toast, Text, Button, Icon, Title, Segment } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { ScrollView, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler} from "react-native"


class ExhibitionScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      register: "Register",
      feed: [],
      allArtwork: [],
      fetch: false,
      refreshing: false,
    }
  }

  componentDidMount(){
    this.getFeed()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Landing")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getFeed().then(() => {
      this.setState({refreshing: false});
    });
  }

  getFeed= async ()=>{

    var url = apiUrl + "exhibition" ;

    if( "jwt" in this.props.jwt  || !this.props.jwt
      || !this.props.userId
      ){
      url = apiUrl + "exhibition/withoutJwt" ;
    }
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt.jwt}`
       }
    });
    var response = await result;
    if(response.status !== 200 ){
      console.warn("fetching feeds failed response")
      this.setState({
        feed: []
      })
      return
    }
    else{
      var res = await response.json();
      if (res[0]._id) {
        // console.warn(res[0])
        let reverseResp = res.reverse()
        this.setState({
          feed: reverseResp
        })
        this.mapAllExhibition()
      }

      else  {
        console.warn("Can't get feeds")
        this.setState({
          feed: []
        })
        
      }
    }
  
}

mapAllExhibition = async ()=>{
  var allArtwork = await this.state.feed.reverse().map(exhibition=> 
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
                <Button transparent textStyle={{color: '#87838B'}}
                  onPress={()=> {
                    if(!this.props.userId){
                      return  Toast.show({
                         text: "You need to sign in",
                         buttonText: "Okay",
                         duration: 3000,
                         type: 'danger'
                       })
                   }
                    this.props.navigation.navigate("ExpandExhibition", { id: exhibition._id})}
                  }
                 >
                  <Icon active name="open" />
                  <Text >Learn More</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: exhibition.imageUrl} } style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem >
                <Text note>
                  {exhibition.shortDescription}
                </Text>
                
            </CardItem>
            <CardItem>
              <Left>
                  <Button transparent textStyle={{color: '#87838B'}}>
                    <Icon name="home" />
                    <Text>{exhibition.organizerName}</Text>
                  </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="time" />
                  <Text>{exhibition.date}</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}
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
                </Button>
              </Right>
            </CardItem>
        </Card>
    )
  )
  this.setState({ allArtwork : allArtwork, fetch: true })
}

  render() {
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Exhibition</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="eye" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active onPress={()=> this.props.navigation.navigate("")}>
            <Text>Recent Exhibition</Text>
          </Button>
          <Button  onPress={()=> {
            if(!this.props.userId){
              return  Toast.show({
                 text: "You need to sign in",
                 buttonText: "Okay",
                 duration: 3000,
                 type: 'danger'
               })
           }
            this.props.navigation.navigate("CreateExhibition")
        }}>
            <Text>Create Exhibition</Text>
          </Button>
        </Segment>
        <Content padder
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
        {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Body><Text>No Exhibition to show</Text></Body> }
        </Content>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(ExhibitionScreen)