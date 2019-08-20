import React, { Component } from 'react';
import { Image, Modal, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, 
  Toast, Textarea, Spinner } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"

class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      like: 0,
      comment: 0,
      feed: [],
      allArtwork: [],
      fetch: false,
      image: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png",
    }
  }
  
  componentDidMount(){
    this.fetchUserProfile()

    if(this.props.image){
      this.setState({ image : this.props.image })
    }
    this.getFeed()

  }


  fetchUserProfile= async () =>{
    if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt.jwt 
      || this.props.jwt.jwt.length <=0 ){
      return
    }

    var url = apiUrl + "user/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt.jwt}`
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
        // set state in redux store
        this.props.getUserProfileAction(res)
        
        if("firstName" in res){
          return
        }
        else{ 
        this.props.navigation.navigate("EditProfile") 
      }

      } 
      else  {
        console.warn("fetching user profile failed")
        this.props.navigation.push("EditProfile")
        return
      }
    }
  }



  getFeed= async ()=>{

      var url = apiUrl + "artwork" ;

      if( "jwt" in this.props.jwt  || !this.props.jwt
        || !this.props.userId
        ){
        url = apiUrl + "artwork/withoutJwt" ;
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
          this.setState({
            feed: res
          })
          this.mapAllFeed()
        }

        else  {
          console.warn("Can't get feeds")
          this.setState({
            feed: []
          })
          
        }
      }
    
  }

  mapAllFeed = async ()=>{
    var allArtwork = await this.state.feed.map(artwork => 
      (
        <Card key={artwork._id}>
              <CardItem>
                <Left>
                  <Body>
                    <Text>{artwork.title} {`(${artwork.year ? artwork.year : "Unknown"})`}</Text>
                      <Text note>{artwork.artistName}</Text>
                  </Body>
                </Left>
                <Right>
                  <Button transparent onPress={async () => {
                    if(!this.props.userId){
                      return Toast.show({
                        text: "You need to sign in",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                    }
                    await this.props.moreArtworkDetailsAction({artworkId : artwork._id })
                    this.props.navigation.navigate("Detail", { routeName: "Home"})} 
                  }>
                       <Text>More</Text>
                  </Button>
                  <TouchableOpacity 
                    onPress={()=> {
                      if(!this.props.userId){
                        return Toast.show({
                          text: "You need to sign in",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                      }
                      this.props.navigation.navigate("Profile", {id: artwork.userId, routeName: "Home"})
                    }}
                  >
                    <Text note>See Sponsor</Text>
                  </TouchableOpacity>   
                </Right>
              </CardItem>
              <CardItem cardBody>
                <Image source={{ uri: artwork.imageURL } } style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent 
                    onPress={()=>{ 
                      if(!this.props.userId){
                        return Toast.show({
                          text: "You need to sign in",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                      }

                      like({
                      jwt: this.props.jwt.jwt,
                      userId: this.props.userId,
                      artworkId: artwork._id
                    })
                    
                  }}
                  >
                    <Icon active name="thumbs-up" />
                    <Text>{artwork.like.length <= 0 ? 0 : artwork.like.length} Likes</Text>
                  </Button>
                </Left>
                <Body>
                  <Button transparent 
                    onPress={()=>{
                      this.props.navigation.navigate("Comment", {
                        id: artwork._id,
                        comment: artwork.comment,
                        routeName: "Home"
                      })
                    }}
                  >
                    <Icon active name="chatbubbles" />
                    <Text>{ artwork.comment.length <=  0 ? 0 : artwork.comment.length } Comments</Text>
                  </Button>
                  
                </Body>
                <Right>
                  <Button transparent onPress= {async ()=>{ 
                    if(!this.props.userId){
                      return Toast.show({
                        text: "You need to sign in",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                    }
                    
                   await  this.props.buyArtworkAction({id: artwork._id})
                    this.props.navigation.navigate("Buy", { routeName: "Home"})} 
                    }>
                      <Icon active name="pricetag" />
                      <Text>NGN {artwork.price  ? artwork.price : 0 }</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
      )
    )
    this.setState({ allArtwork : allArtwork, fetch: true })
  }


  
  render() {
    if(!(this.state.fetch)){
      return(
        <Container>
        <Content >
          <Body>
            <Spinner color="red" />
          </Body>
        </Content>
          <FooterScreen 
              navigation={this.props.navigation}
              activeMe = { true } 
          />
        </Container>
      )
    }
    else {
    return (
      <Container>
        <Content >
         {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Text>No feed to show in your network</Text> }
        </Content>
        <FooterScreen 
            navigation={this.props.navigation}
            activeMe = { true } 
        />

      </Container>
    );}
  }
}



const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(HomeScreen)