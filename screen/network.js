import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, 
  Segment, Content, Text, Card, Thumbnail, CardItem, Footer, FooterTab  } from 'native-base';
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
import { like, unLike, rating } from "../controller/api"
import { Rating, AirbnbRating } from 'react-native-ratings';
import Lightbox from "react-native-lightbox"
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler} from "react-native"

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

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack()
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
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
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
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
        <Content 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Text>You currently have no posts.</Text> }
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
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(NetworkScreen)



    class MapArtwork extends Component{
      constructor(props){
        super(props)
        this.state = {
          likeCount :  0,
          color: "blue",
          unlikeColor: "blue"
        }
      }
 
      conmponentDidMount(){
       let artwork = this.props.artwork
       this.setState({ likeCount: artwork.like.length })
      }
      render(){
       let artwork = this.props.artwork

       const forSale= artwork => (
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
            {/* <Icon active name="pricetag" /> */}
            <Text>NGN {artwork.price  ? artwork.price : 0 }</Text>
        </Button>
      )

      const showcase=( 
        <Button transparent >
            <Text>Showcase</Text>
        </Button>
        )

      const progressShot =( 
        <Button transparent >
            <Text>Progress Shot</Text>
        </Button>
        )

        return(
          <Card key={artwork._id} >
            <CardItem>
              <Left>
                <Body>
                  <Text>{artwork.title} {`(${artwork.year ? artwork.year : new Date().getFullYear()})`}</Text>
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
            {typeof(artwork.imageURL) == 'object' ?
            (
              <SliderBox
                    images={artwork.imageURL}
                    sliderBoxHeight={200}
                    onCurrentImagePressed={index =>
                        console.warn(`image ${index} pressed`)
                    }
                    dotColor="red"
                    inactiveDotColor="#90A4AE"
              />
            )
            : 
            (
              <Lightbox>
                <Image 
                  source={{ uri: artwork.imageURL } } 
                  style={{height: 200, width: null, flex: 1}}
                  resizeMode="contain"
                />
              </Lightbox>
            )
            }
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
                    if(artwork.unlike.findIndex(id => { 
                      return id = this.props.userId
                    }) >= 0 ){
                      return this.setState({ unlikeColor: "red"})
                    }

                    unLike({
                    jwt: this.props.jwt.jwt,
                    userId: this.props.userId,
                    artworkId: artwork._id
                  })
                  
                  this.setState({ unlikeColor: "red" })
                  
                }}
                >
                  <Icon style={{ color : artwork.unlike ? (artwork.unlike.findIndex(id =>{
                                            return id === this.props.userId
                                        }) >= 0 ? "red" : this.state.unlikeColor)
                                        : this.state.unlikeColor
                  }} name="thumbs-down" />
                  <Text>{artwork.unlike ? artwork.unlike.length : 0 }</Text>
                </Button>
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
                  
                  this.setState({ color: "red", likeCount: artwork.like.length + 1})
                  
                }}
                >
                  <Icon style={{ color : artwork.like.findIndex(id =>{
                                            return id === this.props.userId
                                        }) >= 0 ? "red" : this.state.color
                  }} name="thumbs-up" />
                  <Text>{artwork.like.length <= 0 ? 0 : artwork.like.length}</Text>
                </Button>
              </Left>
              <Body style={{ paddingLeft: 35 }}>
                <Button transparent  style={{ paddingLeft: 15 }}
                  onPress={()=>{
                    this.props.navigation.navigate("Comment", {
                      id: artwork._id,
                      comment: artwork.comment,
                      routeName: "Home"
                    })
                  }}
                >
                  <Icon active name="chatbubbles" />
                  <Text>{ artwork.comment.length <=  0 ? 0 : artwork.comment.length }</Text>
                </Button>
                
              </Body>
              <Right>
              { artwork.forSale ? forSale(artwork) : 
                (artwork.showcase ? showcase : 
                  ( artwork.progressShot ? progressShot : forSale(artwork)))
              }
              </Right>
            </CardItem>
            <CardItem >
              {/* <AirbnbRating
                count={10}
                reviews={["Terrible", "Bad", "Fair", "Good", "Amazing", "Awesome",  "Wow", "Incredible", "Unbelievable", "Great"]}
                defaultRating={ artwork.rating }
                size={20}
                reviewSize={ 15 }
                selectedColor= "red"
                reviewColor="blue"
              /> */}
            </CardItem>
          </Card>
        )
      }
    }