import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, 
    Toast, Button, Icon, Title, Segment, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import {apiUrl} from "./env"
import { getUserProfile } from "../../controller/api"

class ProfileScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            follow: "Follow",
            profile: {},
            id: "",
            image: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png"
        }
    }

       //props expectation
      // 1. id as a param in navigation
      // 2. routeName  as a param in navigation

    async componentDidMount(){
      const userId = this.props.navigation.getParam("id", null)
        this.setState({ id : userId })
        // console.warn(userId)
      var url = apiUrl + "user/" + userId;
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        console.warn("fetching user failed response")
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          this.setState({
            profile: res,
            image: res.profileImage,
            fetch: true
          })
        }

        else  {
          console.warn("Can't get user")
          this.setState({
            profile: {}
          })
          
        }
      }
    }



  render() {
    const routeName = this.props.navigation.getParam("routeName", "Home")

    if(!(this.state.fetch)){
      return(
          <Container>
            <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
              <Left>
                <Button transparent onPress={()=> this.props.navigation.navigate(routeName)}>
                  <Icon name="arrow-back" />
                </Button>
              </Left>
              <Body>
                <Title>Profile</Title>
              </Body>
              <Right>
                <Button transparent>
                  <Icon name="people" />
                </Button>
              </Right>
            </Header>
            <Segment style={{  backgroundColor: "#cc0000"}}>
              <Button first active >
                <Text>Profile</Text>
              </Button>
              <Button  onPress={()=> this.props.navigation.navigate("UserProfileCollection", {id: this.state.id, routeName: "Profile"})}>
                <Text>Collection</Text>
              </Button>
            </Segment>
            <Content padder>
              <Body>
                <Spinner color="red" />
              </Body>
            </Content>
            </Container>
      )
    }
    else{
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(routeName)}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active >
            <Text>Profile</Text>
          </Button>
          <Button  onPress={()=> this.props.navigation.navigate("UserProfileCollection", {id: this.state.id, routeName: "Profile"})}>
            <Text>Collection</Text>
          </Button>
        </Segment>
        <Content padder>
        <List>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri :  this.state.image }} />
                </Left>
                <Body>
                  <Text>{this.state.profile.firstName ? this.state.profile.firstName : "First Name"}</Text>
                  <Text note> {this.state.profile.lastName ? this.state.profile.lastName : "Last Name"}</Text>
                  <Text note>{this.state.profile.telephone ? this.state.profile.telephone : "Telephone"}</Text>
                </Body>
                <Right>
                    <Text note>{this.state.profile.userType ? this.state.profile.userType : "Type of User"}</Text>
                    <Text note>{this.state.profile.country ? this.state.profile.country : "Country"}</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Text note>{this.state.profile.description ? this.state.profile.description : "About me"}</Text>
              </ListItem>
              <ListItem>
                  <Left>
                    <Text note>
                        Following {this.state.profile.following.length }
                      </Text>
                  </Left>
                  <Right>
                    <Text note>
                        {this.state.profile.follower.length} Followers
                      </Text>
                  </Right>
              </ListItem>
              <ListItem>
              <Left>
                  <TouchableOpacity
                    onPress={()=> {
                        if(!this.props.userId){
                            Toast.show({
                                text: "You need to sign in to follow",
                                buttonText: "Okay",
                                duration: 3000,
                                type: 'danger'
                              })
                        }
                        else if(this.state.follow === "Follow"){
                            this.setState({ follow : "Following"})
                        }
                        else{
                            this.setState({ follow : "Follow"})
                        }
                    }}
                  >
                    <Text style={{ color: "blue" }} note>{this.state.follow}</Text>
                  </TouchableOpacity>
                </Left>
                  <Right>
                    <TouchableOpacity >
                          <Text note style={{ color: "blue"}}>
                              Send Message
                          </Text>
                      </TouchableOpacity>
                  </Right>
              </ListItem>
            </List>
        </Content>
      </Container>
    );}
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile,
  artworkId: state.artworkDetails.artworkId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, buyArtworkAction, moreArtworkDetailsAction })(ProfileScreen)