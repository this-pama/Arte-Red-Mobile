import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body,
Segment, Toast, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import {apiUrl} from "./env"
import { getUserProfile, like } from "../../controller/api"


class ProfileArtworkScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          like: 0,
          comment: 0,
          count: 1,
          fetch: false,
          artwork: [],
          post: [],
        }
      }

      //props expectation
      // 1. id as a param in navigation
      // 2. routeName  as a param in navigation

      async componentDidMount(){    
        const profileId = this.props.navigation.getParam("id", null )
        const profile = await getUserProfile({userId: profileId, jwt: this.props.jwt })
        this.setState({ profileId })
        // console.warn(profile)
        if(profile.artwork.length > 0){
          this.getArtworks(profile.artwork)
        }
        else{ this.setState({message: "User has no collection"})}
      }
    
      getArtworks= async (artwork)=>{

        let hold = 10 * this.state.count
        for(let i= 0; i < hold; i++){
          var url = apiUrl + "artwork/" + artwork[i];
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
            return
          }
          else{
            var res = await response.json();
            if (res._id) {
              this.setState({
                artwork: [ ... this.state.artwork, res]
              })
            }
    
            else  {
              console.warn("Can't get artwork")
              this.setState({
                artwork: []
              })
              
            }
          }
    
          if(i == hold-1 && artwork.length > hold){
            this.mapAllPost()
            this.setState({ count: this.state.count++ })
          }
          else{ this.mapAllPost() }
          
    
        }
      
        
      }
    
    
    
      mapAllPost = async ()=>{
        var allArtwork = await this.state.artwork.reverse().map(artwork => 
          <MapArtwork 
            key={artwork._id} 
            artwork= {artwork} 
            navigation = {this.props.navigation}
            userId={ this.props.userId}
            jwt = {this.props.jwt}
            profile= {this.props.profile}
            moreArtworkDetailsAction = { this.props.moreArtworkDetailsAction}
            buyArtworkAction= {this.props.buyArtworkAction}
            loginAction= {this.props.loginAction}
            getUserIdAction= {this.props.getUserIdAction}
            like= {like}
          />
        )
        this.setState({ allArtwork : allArtwork, fetch: true })
      }


  render() {   
    const routeName = this.props.navigation.getParam("routeName", "Home")
    if(!(this.state.fetch)){
      return(
        <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(routeName, {id: this.state.profileId})}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="person" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first onPress={()=> this.props.navigation.navigate("Profile", {id: this.state.profileId})} >
            <Text>Profile</Text>
          </Button>
          <Button active >
            <Text>Collection</Text>
          </Button>
        </Segment>
        <Content>
          <Body>
            <Spinner color="red" />
          </Body>
        </Content>
        </Container>
      )
    }  
    else {
    return (
      
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(routeName, {id: this.state.profileId})}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="person" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first onPress={()=> this.props.navigation.navigate("Profile", {id: this.state.profileId})} >
            <Text>Profile</Text>
          </Button>
          <Button active >
            <Text>Collection</Text>
          </Button>
        </Segment>
        <Content>
          {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Text>{this.state.message}</Text> }
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
    getUserProfileAction, buyArtworkAction, moreArtworkDetailsAction })(ProfileArtworkScreen)

  
    class MapArtwork extends Component{
      constructor(props){
        super(props)
        this.state = {
          likeCount :  0,
          color: "blue"
        }
      }
 
      conmponentDidMount(){
       let artwork = this.props.artwork
       this.setState({ likeCount: artwork.like.length })
      }
      render(){
       let artwork = this.props.artwork
        return(
          <Card key={artwork._id}>
          <CardItem>
            <Left>
              <Body>
                <Text>{artwork.title} {`(${artwork.year})`}</Text>
                  <Text note>{artwork.artistName}</Text>
              </Body>
            </Left>
            <Right>
              <Button transparent onPress={async () => {
                await this.props.moreArtworkDetailsAction({artworkId : artwork._id })
                this.props.navigation.navigate("Detail", { routeName: "UserProfileCollection"})} 
              }>
                  <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                   <Text>More</Text>
              </Button>
            </Right>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: artwork.imageURL } } style={{height: 200, width: null, flex: 1}}/>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent 
                  onPress={()=>{
                    if(artwork.like.findIndex(id => { 
                      return id = this.props.userId
                    }) >= 0 ){
                      return this.setState({ color: "red"})
                    }

                    like({
                    jwt: this.props.jwt.jwt,
                    userId: this.props.userId,
                    artworkId: artwork._id
                  })
                  this.setState({ color: "red"})
                  
                }}
              >
                <Icon style={{ color : this.state.color }} name="thumbs-up" />
                <Text>{!artwork.like.length ? 0 :artwork.like.length } Likes</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent 
                 onPress={()=>{
                  this.props.navigation.navigate("Comment", {
                    id: artwork._id,
                    comment: artwork.comment,
                    routeName: "UserProfileCollection"
                  })
                }}
              >
                <Icon active name="chatbubbles" />
                <Text>{ !artwork.comment.length ? 0 : artwork.comment.length } Comments</Text>
              </Button>
              
            </Body>
            <Right>
              <Button transparent onPress= {async ()=>{ 
               await  this.props.buyArtworkAction({id: artwork._id})
                this.props.navigation.navigate("Buy", { routeName: "UserProfileCollection"})} 
                }>
                  <Icon active name="pricetag" />
                  <Text>NGN {artwork.price  ? artwork.price : 0 }</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        )
      }
    }