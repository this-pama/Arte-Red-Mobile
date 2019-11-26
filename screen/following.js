import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail,
   Text, Button, Icon, Title, Segment,
Footer, FooterTab } from 'native-base';
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {apiUrl} from "./service/env"
import {BackHandler} from "react-native"

class FolloweringScreen extends Component {
  constructor(props){
    super(props)
    this.state={
      following: [],
      follow: [],
      followingId: [],
      count: 1,
      image : "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png"
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }
  componentDidMount(){
    if("following" in this.props.profile){
      this.setState({ followingId : this.props.profile.following })
    }

    this.getPost()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack()
      return true;
    });
  }


  getPost= async ()=>{
    if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt 
      || this.props.jwt.length <=0 ){
      return
    }

      var url = apiUrl + "artwork/myfollowing/" + this.props.userId;
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        // console.warn("fetching artworks failed response")
        this.setState({
          following: []
        })
        return
      }
      else{
        console.warn(response.json())
        var res = await response.json();
        if (res.success) {
          this.setState({
            following: [ ... res.message]
          })
        }

        else  {
          // console.warn("Can't get artwork")
          this.setState({
            following: []
          })
          
        }
       this.mapAllPost() 
    }    
  }


  mapAllPost = async ()=>{
    var allFollow = await this.state.following.map(following => 
      (
        <List key={following._id}>
              <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate("Profile", { profileId : following._id})}
              >
                <ListItem avatar>
                  <Left>
                    <Thumbnail source={{uri : following.profileImage ? following.profileImage : this.state.image }} />
                  </Left>
                  <Body>
                    <Text>{following.firstName} {following.lastName}</Text>
                    <Text note>{following.description}</Text>
                  </Body>
                </ListItem>
              </TouchableOpacity>
            </List>
      )
    )
    this.setState({ follow : allFollow })
  }

  render() {
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Following</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first onPress={()=> this.props.navigation.navigate("Follower")}>
            <Text>Follower</Text>
          </Button>
          <Button active onPress={()=> this.props.navigation.navigate("Following")}>
            <Text>Following</Text>
          </Button>
          <Button last onPress={()=> this.props.navigation.navigate("Network")} >
            <Text>Posts</Text>
          </Button>
        </Segment>
        <Content padder>
        {this.state.follow && this.state.follow.length > 0 ? this.state.follow: <Body><Text>You are not following anyone.</Text></Body> }
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

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction })(FolloweringScreen)