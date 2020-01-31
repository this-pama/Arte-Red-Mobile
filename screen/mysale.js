import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Form, Picker, Item, Toast, Footer, 
    View, FooterTab, Label, Spinner, Input, Segment, Accordion,
  Card, CardItem } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"
import {BackHandler, RefreshControl } from "react-native"
import { Notifications } from 'expo';
import CountDown from 'react-native-countdown-component';
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class MySaleScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      auctionData: [],
      allAuctionData: [],  
      boughtArtworkActive: true,
      soldArtworkActive: false,
      refreshing: false,
      allWonAuction: [],
      wonAuction: [],
      trackData: [],
      getCertificate: false,
      visible: false,
      fetchTrack: false,
      modalVisible: false,
      boughtArtworks: {
        message: [],
        data: []
      },
      allBoughtArtworks: {
        message: [],
        data: []
      },
      message: '',
      soldArtworks: {
        message: [],
        data: []
      },
      allSoldArtworks: {
        message: [],
        data: []
      },

    }
  }

  async componentDidMount() {
    this.getSoldArtwork()
    this.getBoughtArtwork()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Activities")
      return true;
    });

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  getSoldArtwork= async ()=>{
    var url = apiUrl + "sold/user/sold/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result
    console.warn(response)
    if(response.status != 200 ){
      this.setState({
        message: "Error occurred while getting data",
        visible: true,
        fetch: true,
        soldArtworks: {
          message: [],
          data: []
        },
        allSoldArtworks: {
          message: [],
          data: []
        }
      })
      return
    }
      var res = await response.json()
      if (res.success ) {
        console.warn('sold', res)
        this.setState({
          soldArtworks: res,
          allSoldArtworks: res,
          fetch: true,
        })
      }
      else  { 
        this.setState({
          // message: "It see",
          // visible: true,
          fetch: true,
          soldArtworks: {
            message: [],
            data: []
          },
          allSoldArtworks: {
            message: [],
            data: []
          },
        })
        return    
      }
}

getBoughtArtwork= async ()=>{
  var url = apiUrl + "sold/user/bought/" + this.props.userId;
  var result = await fetch(url, {
    method: 'GET',
    headers: { 
      'content-type': 'application/json',
      // "Authorization": `Bearer ${this.props.jwt}`
     }
  })
  var response = await result
  console.warn(response)
  if(response.status != 200 ){
    this.setState({
      message: "Error occurred while getting data",
      visible: true,
      fetch: true,
      soldArtworks: {
        message: [],
        data: []
      },
      allBoughtArtworks: {
        message: [],
        data: []
      }
    })
    return
  }

    var res = await response.json();
    // console.warn('getWonAuction', res)
    if (res.success ) {
      console.warn('bought', res)
      this.setState({
        boughtArtworks: res,
        allBoughtArtworks: res,
        fetch: true,
      })
    }
    else  { 
      this.setState({
        // message: "Error occurred while getting data",
        // visible: true,
        fetch: true,
        boughtArtworks: {
          message: [],
          data: []
        },
        allBoughtArtworks: {
          message: [],
          data: []
        }
      })
      return    
    }
}

_onRefresh = () => {
    this.setState({refreshing: true});
    this.getBoughtArtwork()
    this.getSoldArtwork().then(() => {
      this.setState({refreshing: false});
    })
}

  render() {
    const sold = this.state.soldArtworks.message.map( (artwork, index) =>
      (
        <MapArtwork 
          key={artwork._id} 
          artwork= {artwork} 
          navigation = {this.props.navigation}
          userId={ this.props.userId}
          jwt = {this.props.jwt}
          profile= {this.props.profile}
          data= { this.state.soldArtworks.data }
      />
        ))

    bought = this.state.boughtArtworks.message.map( (artwork, index) =>
    (
      <MapArtwork 
        key={artwork._id} 
        artwork= {artwork} 
        navigation = {this.props.navigation}
        userId={ this.props.userId}
        jwt = {this.props.jwt}
        profile= {this.props.profile}
        data= { this.state.soldArtworks.data }
      />
      ))


    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Activities")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>My Sales</Title>
          </Body>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active={ this.state.boughtArtworkActive }  
            onPress={()=>{
                this.setState({
                    boughtArtworkActive: true,
                    soldArtworkActive: false,
                    boughtArtworks: this.state.allBoughtArtworks,
                    soldArtworks: {
                      message: [],
                      data: []
                    }
                })
            }}
          >
            <Text>Bought Artwork</Text>
          </Button>
          <Button active={ this.state.soldArtworkActive}
            onPress={()=>{
                this.setState({
                    boughtArtworkActive: false,
                    soldArtworkActive: true,
                    boughtArtworks: {
                      message: [],
                      data: []
                    },
                    soldArtworks: this.state.allSoldArtworks
                })
            }}
          >
            <Text>Sold Artwork</Text>
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
                    <Spinner color='red' />
                </Body>
            ) : null }
            { this.state.boughtArtworkActive ? bought : (this.state.soldArtworkActive ? sold : (<Body><Text>No Sales yet</Text></Body>))}
          
            <View>
              <Modal
                visible={this.state.visible}
                modalTitle={<ModalTitle title="Message" />}
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
                      text="OK"
                      onPress={() => this.setState({ visible: false })}
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View style= {{ padding : 12, paddingBottom: 20 }} >
                    <Text>{ this.state.message } </Text>
                  </View>
                </ModalContent>
              </Modal>
            </View>
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

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(MySaleScreen)




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
     let artwork = this.props.artwork;
     let data = this.props.data;

     const sale= ( artwork, data ) =>{ 
       let cost = artwork.price;
       let quantity = 1;
       let index = data.findIndex(function checkUser(art) {
        return art.artworkId == artwork._id
      })

      if(index >= 0){
        cost = data[index].meta.amount;
        quantity= data[index].meta.quantity;
      }

       return (
        <CardItem>
          <Left>
          <Button transparent >
              <Text>Quantity { quantity }</Text>
          </Button>
          </Left>
          <Right>
            <Button transparent >
              <Text>Price: {artwork.currency} { cost }</Text>
            </Button>
          </Right>
        </CardItem>
       
     )}

     
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

       {  sale(artwork, data ) }

       <Accordion
          dataArray={[{title: "Description", content: artwork.story }]}
          headerStyle={{ backgroundColor: "##fff" }}
          contentStyle={{ backgroundColor: "#fff" }}
        />
       {/* </CardItem> */}

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

