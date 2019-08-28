import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, 
  Segment, Content, Text, Card, Thumbnail, CardItem  } from 'native-base';
import {TouchableOpacity} from "react-native-gesture-handler"
import { Image } from "react-native"
import { ScrollView, RefreshControl } from 'react-native';
import FooterTabs from "./service/footer"
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import { buyArtworkAction } from "../redux/buyAction"
import {apiUrl} from "./service/env"
import { like } from "../controller/api"

class NetworkScreen extends Component {
  constructor(props){
    super(props)
    this.state={
      post: [],
      artworkId: [],
      allArtwork: [],
      count: 1,
      refreshing: false,
    }
  }

  componentDidMount(){
    this.setState({ post: [], allArtwork: [] })

    if("artwork" in this.props.profile){
      this.setState({ artworkId : this.props.profile.artwork })
    }

    this.getPost()
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getPost().then(() => {
      this.setState({refreshing: false});
    });
  }

  getPost= async ()=>{
    if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt 
      || this.props.jwt.length <=0 ){
      return
    }

    let hold = 10 * this.state.count
    for(let i= 0; i < hold; i++){
      var url = apiUrl + "artwork/" + this.props.profile.artwork[i];
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
          post: []
        })
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          this.setState({
            post: [ ... this.state.post, res]
          })
        }

        else  {
          // console.warn("Can't get artwork")
          this.setState({
            post: []
          })
          
        }
      }

      if(i == hold-1 && this.state.artworkId.length > hold){
        this.mapAllPost()
        this.setState({ count: this.state.count++ })
      }
      else{ this.mapAllPost() }
      

    }
  
    
  }



  mapAllPost = async ()=>{
    let reArrange = await this.state.post.reverse()
    var allArtwork = await reArrange.map(artwork => 
      <MapArtwork 
        key={artwork._id} 
        artwork= {artwork} 
        navigation = {this.props.navigation}
        userId={ this.props.userId}
        jwt = {this.props.jwt}
        profile= {this.props.profile}
        moreArtworkDetailsAction = { this.props.moreArtworkDetailsAction}
        buyArtworkAction= {this.props.buyArtworkAction}
        like= {like}
      />
    )
    this.setState({ allArtwork : allArtwork })
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
            <Title>My Network</Title>
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
          <Button onPress={()=> this.props.navigation.navigate("Following")}>
            <Text>Following</Text>
          </Button>
          <Button last active>
            <Text>Posts</Text>
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
          {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Text>You currently have no posts.</Text> }
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
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(NetworkScreen)



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
                this.props.navigation.navigate("Detail", { routeName: "Network"})} 
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
                <Icon style={{ color : artwork.like.findIndex(id =>{
                                         return id === this.props.userId
                                    }) >= 0 ? "red" : this.state.color
              }}  name="star" />
                <Text>{artwork.like.length <= 0 ? 0 :artwork.like.length } STARS</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent 
                onPress={()=>{
                  this.props.navigation.navigate("Comment", {
                    id: artwork._id,
                    comment: artwork.comment,
                    routeName: "Network"
                  })
                }}
              >
                <Icon active name="chatbubbles" />
                <Text>{ artwork.comment.length <= 0 ? 0 : artwork.comment.length } Comments</Text>
              </Button>
              
            </Body>
            <Right>
              <Button transparent onPress= {async ()=>{ 
               await  this.props.buyArtworkAction({id: artwork._id})
                this.props.navigation.navigate("Buy", { routeName: "Network"})} 
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