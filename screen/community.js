import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right,
  Card, CardItem, Toast, Text, Button, Icon, Title, Segment, Spinner } from 'native-base';
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


class CommunityScreen extends Component {
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
    
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Home")
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
      console.warn(res)
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
            <Title>Community</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Content>
        </Content>
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
   moreArtworkDetailsAction, getUserProfileAction })(CommunityScreen)