import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button, Icon, Title, Segment } from 'native-base';
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {apiUrl} from "./service/env"

class FolloweringScreen extends Component {
  constructor(props){
    super(props)
    this.state={
      following: [],
      followingId: [],
      count: 1
    }
  }

  componentDidMount(){
    if("following" in this.props.profile){
      this.setState({ followingId : this.props.profile.following })
    }

    this.getPost()
  }

  getPost= async ()=>{
    if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt 
      || this.props.jwt.length <=0 ){
      return
    }

    let hold = 10 * this.state.count
    for(let i= 0; i < hold; i++){
      var url = apiUrl + "user/" + this.props.profile.following[i];
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        console.warn("fetching following failed response")
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          this.setState({
            following: [ ... this.state.following, res]
          })
        }

        else  {
          console.warn("Can't get following")
          
        }
      }

      if(i == hold-1 && this.state.followingId.length > hold){
        this.mapAllPost()
        this.setState({ count: this.state.count++ })
      }
      else{ this.mapAllPost() }
      

    }
  
    
  }



  mapAllPost = async ()=>{
    var allArtwork = await this.state.post.map(following => 
      (
        <List key={following._id}>
              <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate("Profile", { profileId : following._id})}
              >
                <ListItem avatar>
                  <Left>
                    <Thumbnail source={{uri : following.profileImage }} />
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
    this.setState({ following : following })
  }

  render() {
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000"}}>
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
        {this.state.following && this.state.following.length > 0 ? this.state.following: <Text>You are not following anyone.</Text> }
        </Content>

        <FooterTabs 
          activeNetwork= { true }
          navigation={this.props.navigation}
        />
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