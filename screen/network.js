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
import {BackHandler, View } from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class NetworkScreen extends Component {
  constructor(props){
    super(props)
    this.state={
      post: [],
      artworkId: [],
      allArtwork: [],
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

      var url = apiUrl + "artwork/myartwork/" + this.props.userId;
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
        if (res.success) {
          this.setState({
            post: [ ... res.message]
          })
        }

        else  {
          // console.warn("Can't get artwork")
          this.setState({
            post: []
          })
          
        }
       this.mapAllPost() 
      

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
          {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : (<Body><Text>You currently have no posts.</Text></Body>) }
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

     sendPushNotification = async (userId, title, message) =>{
      var url = apiUrl + "user/send-notification/direct-message"
      var result = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId,
          title,
          message
        })
      });
      var response = await result;
      if(response.status !== 200 ){
        return
      }
      else{
        var res = await response.json();
        // console.warn("sent notification")
        console.warn("notification response", res )
        return
      }
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
                   return 
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
                   return 
                 }
 
                 like({
                 jwt: this.props.jwt.jwt,
                 userId: this.props.userId,
                 artworkId: artwork._id
               })

               this.sendPushNotification(artwork.userId, "Notification", `${this.props.profile.firstName} just like your artwork`)
               
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
                   routeName: "Home",
                   artworkUserId: artwork.userId,
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