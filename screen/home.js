import React, { Component } from 'react';
import { Image, Modal, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, 
  Toast, Textarea, Spinner, Segment, ActionSheet, } from 'native-base';
  import { ScrollView, RefreshControl } from 'react-native';
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
import { like, unLike, rating, registerForPushNotificationsAsync } from "../controller/api"
import { Rating, AirbnbRating } from 'react-native-ratings';
import Lightbox from "react-native-lightbox"
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler } from "react-native"

var BUTTONS = ["0 - 1M", "1M - 5M", "5M - 10M", "10M above", "Exit"];
// var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

var CAT_BUTTONS = ["Painting", "Sculpture", "Drawing", "Textile", "Collage", "Prints", "Photography", "Art Installation","Others", "Exit"];
var CAT_CANCEL_INDEX = 9;


class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      modalVisible: false,
      like: 0,
      comment: 0,
      feed: [],
      allArtwork: [],
      fetch: false,
      refreshing: false,
      image: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png",
      showAll: true,
    }
  }
  
  componentDidMount(){
    this.fetchUserProfile()

    if(this.props.image){
      this.setState({ image : this.props.image })
    }
    this.getFeed()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Landing")
      return true;
    });


    //send device expo token to server
    if(this.props.userId){
      registerForPushNotificationsAsync(this.props.userId)
    }
    
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
          let reverseResp = res.reverse()
          this.setState({
            feed: reverseResp
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
        unLike= { unLike }
      />
    )
    this.setState({ allArtwork : allArtwork, fetch: true })
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
}
  
  render() {
        return (
      <Container>
        <Segment style={{  backgroundColor: "#990000"}}>
          <Button first active={ this.state.showAll}  
          >
            <Text style={{ paddingLeft: 50, paddingRight: 50 }}>All</Text>
          </Button>
          <Button active={ this.state.activeClosed}
            onPress={() =>
              // this.setModalVisible(true)
              ActionSheet.show(
                {
                  options: CAT_BUTTONS,
                  cancelButtonIndex: CAT_CANCEL_INDEX,
                  // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                  title: "Sort by Category"
                },
                buttonIndex => {
                  this.setState({ clicked: BUTTONS[buttonIndex] });
                }
              )
            }
          >
            <Text style={{ paddingLeft: 50, paddingRight: 50 }} >Category</Text>
          </Button>
          {/* <Button active={ this.state.activeSubmit}
          onPress={() =>
            ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: "Sort by Price"
              },
              buttonIndex => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
              }
            )}
          >
            <Text>Price</Text>
          </Button>
          <Button first active={ this.state.activeOngoing}  
          >
            <Text>Showcase</Text>
          </Button> */}
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
                <Spinner color="red"  small />
              </Body>
            ) : null }
         {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : null }
        </Content>
        <FooterScreen 
            navigation={this.props.navigation}
            activeMe = { true } 
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          presentationStyle= 'overFullScreen'
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          // }}
          style={{ backgroundColor : "#990000" }}
          >
          <View style={{ marginTop: 22, padding: 20,  }} >
          <Button bordered danger
                onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                }}
            >
                <Text >Close</Text>
            </Button>

            <View>
              <Text>Hello World!</Text>

              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal>

      </Container>
    )
  }
}



const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(HomeScreen)


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

     ratingCompleted = (rating) =>{
      console.warn(rating)
      // console.warn(artwork._id)
      // console.warn(rating)
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
          this.props.navigation.navigate("Negotiation", { routeName: "Home",
            artworkId: artwork._id
        })} 
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
            {/* <Button transparent onPress={async () => {
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
            </Button> */}
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
                sliderBoxHeight={350}
                onCurrentImagePressed={async index =>
                    {
                      if(!this.props.userId){
                        return Toast.show({
                          text: "You need to sign in",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                      }
                      await this.props.moreArtworkDetailsAction({artworkId : artwork._id })
                      this.props.navigation.navigate("Detail", { routeName: "Home"})
                    } 
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
          onFinishRating={rate =>{
              rating({
                rating: rate,
                artworkId: artwork._id,
                jwt: this.props.jwt.jwt,
                userId: this.props.userId
              })
          }}
        /> */}
        </CardItem>
      </Card>
       )
     }
   }