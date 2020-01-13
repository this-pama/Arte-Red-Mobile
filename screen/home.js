import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, 
  Toast, Textarea, Spinner, Segment, ActionSheet, ListItem } from 'native-base';
  import { ScrollView, RefreshControl } from 'react-native';
import FooterScreen from './service/footer'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import { expoTokenAction } from '../redux/expoToken'
import {connect} from 'react-redux'
import { like, unLike, rating, registerForPushNotificationsAsync } from "../controller/api"
import { Rating, AirbnbRating } from 'react-native-ratings';
import Lightbox from "react-native-lightbox"
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler } from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';
const KEYS_TO_FILTERS = ['category'];
import SearchInput, { createFilter } from 'react-native-search-filter';
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
      visible: false,
      category: '',
      showCategory: false
    }
  }
  
  componentDidMount(){
    this.fetchUserProfile()
    

    console.warn('expo token', this.props.expoToken )
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
      // await this.props.expoTokenAction({token})
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
    const sortedArtwork = this.state.feed.filter(createFilter(this.state.category, KEYS_TO_FILTERS))
    var allArtwork = await sortedArtwork.map(artwork => 
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

  // setModalVisible = (visible) => {
  //   this.setState({ modalVisible: visible });
  // }

  sortView = ()=>{
    this.setState({ visible : true })
  }

  sortParameter= async category =>{
    await this.setState({ category, showAll: false, showCategory: true, visible: false })
    this.mapAllFeed()
  }
  
  render() {

    sortView = 
      (
      <View >
        <CardItem>
          <Left>
            <Body>
            <Button transparent
              onPress={()=> this.sortParameter('Painting')} 
            >
                <Text>Painting</Text>
              </Button>
            </Body>
          </Left>
          <Right>
          <Body>
              <Button transparent
              onPress={()=> this.sortParameter('Sculpture')} 
              >
                <Text>Sculpture</Text>
              </Button> 
              </Body>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Body>
            <Button transparent
            onPress={()=> this.sortParameter('Drawing')} 
            >
                <Text>Drawing</Text>
              </Button>
            </Body>
          </Left>
          <Right>
          <Body>
              <Button transparent 
              onPress={()=> this.sortParameter('Textile')} 
              >
                <Text>Textile</Text>
              </Button> 
              </Body>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Body>
            <Button transparent 
            onPress={()=> this.sortParameter('Collage')} 
            >
                <Text>Collage</Text>
              </Button>
            </Body>
          </Left>
          <Right>
          <Body>
              <Button transparent
              onPress={()=> this.sortParameter('Prints')} 
              >
                <Text>Prints</Text>
              </Button> 
              </Body>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Body>
            <Button transparent 
            onPress={()=> this.sortParameter('Photography')} 
            >
                <Text>Photography</Text>
              </Button>
            </Body>
          </Left>
          <Right>
          <Body>
            <Button transparent 
            onPress={()=> this.sortParameter('Art Installation')} 
            >
              <Text>Art Installation</Text>
            </Button> 
          </Body>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <Body>
            </Body>
          </Left>
          <Body>
            <Button transparent 
            onPress={()=> this.sortParameter('Other')} 
            >
              <Text>Others</Text>
            </Button> 
          </Body>
          <Right>
          <Body>
          </Body>
          </Right>
        </CardItem>
        </View>
        )

        return (
      <Container>
        <Segment style={{  backgroundColor: "#990000"}}>
          <Button first active={ this.state.showAll}  
            onPress={async ()=> {     
              this.sortParameter('')
              await this.setState({ showAll : true, showCategory: false,})
            }}
          >
            <Text style={{ paddingLeft: 50, paddingRight: 50 }}>All</Text>
          </Button>
          <Button active={ this.state.showCategory}
            onPress={ async () =>{
              this.sortView()
              // await this.setState({ showCategory: true })
            }}
          >
            <Text style={{ paddingLeft: 50, paddingRight: 50 }} >Category</Text>
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
                visible={this.state.visible}
                modalTitle={<ModalTitle title="Sort by Category" />}
                modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                  this.setState({ visible: false });
                }}
                width
                footer={
                  <ModalFooter>
                    <ModalButton
                      text="Exit"
                      onPress={() => this.setState({ visible: false })}
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View>
                    { sortView }
                  </View>
                </ModalContent>
              </Modal>

      </Container>
    )
  }
}



const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile,
  expoToken: state.expoToken,
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction, expoTokenAction })(HomeScreen)


   class MapArtwork extends Component{
     constructor(props){
       super(props)
       this.state = {
         likeCount :  0,
         color: "blue",
         unlikeColor: "blue",
         modalVisible: false,
         message: ''

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

          if(artwork.quantitySold >= artwork.numberAvailable){
            this.setState({
              modalVisible: true,
              message: "Artwork is Sold Out"
            })
            return
          }
          
         await  this.props.buyArtworkAction({id: artwork._id})
          this.props.navigation.navigate("Negotiation", { routeName: "Home",
            artworkId: artwork._id
        })} 
          }>
            {/* <Icon active name="pricetag" /> */}
            <Text>{artwork.currency} {artwork.price  ? artwork.price : 0 }</Text>
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
          <Left>
          { artwork.quantitySold > 0  && artwork.quantitySold < artwork.numberAvailable ? (
            <Button transparent>
              <Icon style={{ color : "red" }} name="arrow-up"  />
              <Text> { artwork.quantitySold} Sold </Text>
            </Button>
            ) : null 
          }
          </Left>
          <Body>
          { artwork.quantitySold > 0 && artwork.quantitySold >= artwork.numberAvailable ? (
            <Button transparent>
              <Icon style={{ color : "red" }} name="arrow-up"  />
              <Text> Sold Out </Text>
            </Button>
            ) : null 
          }
          </Body>
          <Right>
          { artwork.quantitySold > 0  && artwork.quantitySold < artwork.numberAvailable ? (
            <Button transparent>
              <Icon style={{ color : "red" }} name="arrow-down"  />
              <Text> {  artwork.numberAvailable - artwork.quantitySold }  Available</Text>
            </Button>
            ) : null 
          }
          </Right>
        </CardItem>

        <Modal
                visible={this.state.modalVisible}
                modalTitle={<ModalTitle title="Message" />}
                modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
                })}
                onTouchOutside={() => {
                  this.setState({ modalVisible: false });
                }}
                width
                footer={
                  <ModalFooter>
                    <ModalButton
                      text="Exit"
                      onPress={() => this.setState({ modalVisible: false })}
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View style={{ padding: 20, paddingBottom: 40 }}>
                    <Body>
                      <Text>{ this.state.message }</Text>
                    </Body>
                  </View>
                </ModalContent>
              </Modal>


      </Card>
       )
     }
   }