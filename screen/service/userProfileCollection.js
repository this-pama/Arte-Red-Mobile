import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body,
Segment, Toast, Spinner, Footer, FooterTab } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import {apiUrl} from "./env"
import { getUserProfile, like, unLike, rating } from "../../controller/api"
import { SliderBox } from 'react-native-image-slider-box';
import Lightbox from "react-native-lightbox"
import { Rating, AirbnbRating } from 'react-native-ratings';
import {BackHandler, View } from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';


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
          // artistId: null
        }
      }

      //props expectation
      // 1. id as a param in navigation
      // 2. routeName  as a param in navigation

      async componentDidMount(){    
        const profileId = this.props.navigation.getParam("id", null )
        // this.setState({ artistId: profileId })
        const profile = await getUserProfile({userId: profileId, jwt: this.props.jwt })
        this.setState({ profileId })
        // console.warn(profile)
        if(profile.artwork.length > 0){
          this.getArtworks(this.state.profileId)
        }
        else{ this.setState({message: "User has no collection"})}

        // handle hardware back button press
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          this.props.navigation.navigate(this.props.navigation.getParam("routeName", "Home"), 
          {id: this.state.profileId} )
          return true;
        });

      }

      componentWillUnmount() {
        this.backHandler.remove();
      }
    
      getArtworks= async (artwork)=>{   
        if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt 
          || this.props.jwt.length <=0 ){
          return
        }
    
          var url = apiUrl + "artwork/myartwork/" + artwork;
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
              artwork: []
            })
            return
          }
          else{
            var res = await response.json();
            if (res.success) {
              this.setState({
                artwork: [ ... res.message]
              })
            }
    
            else  {
              // console.warn("Can't get artwork")
              this.setState({
                artwork: []
              })
              
            }
           this.mapAllPost() 
        }
      }
    
    
      mapAllPost = async ()=>{
        let reArrange = this.state.artwork.reverse()
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
            loginAction= {this.props.loginAction}
            getUserIdAction= {this.props.getUserIdAction}
            like= {like}
          />
        )
        this.setState({ allArtwork : allArtwork, fetch: true })
      }


  render() {   
    const routeName = this.props.navigation.getParam("routeName", "Home")

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
          { this.state.fetch ? null : (<Body><Spinner color='red' /></Body>)}
          {this.state.allArtwork && this.state.allArtwork.length > 0  ? this.state.allArtwork : <Text>{this.state.message}</Text> }
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
              onPress={()=> this.props.navigation.navigate("Network")} >
              <Icon name="people" />
              <Text>Network</Text>
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
           <Left></Left>
           <Body>
           { artwork.quantitySold > 0 ? (
             <Button transparent>
               <Icon style={{ color : "red" }} name="arrow-up"  />
               <Text> { artwork.quantitySold >= artwork.numberAvailable  ? 'Sold Out' :  null   } </Text>
               <Text> {  artwork.quantitySold < artwork.numberAvailable && artwork.quantitySold > 0 ? `${artwork.quantitySold} Sold, ${ artwork.numberAvailable - artwork.quantitySold } Available` : null   } </Text>
             </Button>
             ) : null 
           }
           </Body>
           <Right></Right>
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