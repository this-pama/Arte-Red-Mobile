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

class TrackPartnerSaleScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      errMessage:"",
      fetch: false,
      notification: {},
      refreshing: false,
      visible: false,
      fetchTrack: false,
      modalVisible: false,
      message: '',
      verifiedAuction: [],

    }
  }

  async componentDidMount() {
    this.getAllVerifiedAuction()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Partner")
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

  getAllVerifiedAuction = async ()=>{
    var url = apiUrl + "partner/mydetails/verified/" + this.props.profile.partnerId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result
    if(response.status !== 200 ){
      this.setState({
        message: "Error occurred while getting data",
        visible: true,
        fetch: true,
      })
      return
    }
      var res = await response.json()
      if (res.success ) {
        console.warn('sold', res)
        this.setState({
          verifiedAuction: res.message,
          fetch: true,
        })
      }
      else  { 
        this.setState({
          message: "Error occurred while getting data",
          visible: true,
          fetch: true,
        })
        return    
      }
}



_onRefresh = () => {
    this.setState({refreshing: true});
    this.getAllVerifiedAuction().then(() => {
      this.setState({refreshing: false});
    })
}

  render() {
    const auction = this.state.verifiedAuction.map( (artwork, index) =>
      (
        <MapArtwork 
          key={artwork._id} 
          artwork= {artwork} 
          navigation = {this.props.navigation}
          userId={ this.props.userId}
          jwt = {this.props.jwt}
          profile= {this.props.profile}
          data= { this.state.verifiedAuction }
      />
        ))


    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Partner")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Track Sales</Title>
          </Body>
        </Header>
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
            { this.state.fetch ? auction :  null }
          
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
              onPress={()=> this.props.navigation.navigate("Partner")} >
              <Icon name="person" />
              <Text>Member</Text>
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
   moreArtworkDetailsAction, getUserProfileAction })(TrackPartnerSaleScreen)




class MapArtwork extends Component{
    constructor(props){
      super(props)
      this.state = {
        modalVisible: false,
        message: '',
        statusFetch: true,
        soldData: []

      }
    }

    conmponentDidMount(){
     let artwork = this.props.artwork

    }
    
    render(){
     let artwork = this.props.artwork;
     let data = this.props.data;

    checkStatus = async ( verificationCode)=>{
        this.setState({ statusFetch: true })
        var url = apiUrl + "partner/mydetails/verified/sold/" + this.props.profile.partnerId + "/" + verificationCode;
        var result = await fetch(url, {
          method: 'GET',
          headers: { 
            'content-type': 'application/json',
            // "Authorization": `Bearer ${this.props.jwt}`
           }
        })
        var response = await result
        if(response.status !== 200 ){
          this.setState({
            message: "Error occurred while getting data",
            modalVisible: true,
            statusFetch: true,
          })
          return
        }
          var res = await response.json()
          if (res.success ) {
            console.warn('sold', res)
            this.setState({
              soldData: res.message,
              message: "AUction has been sold",
              modalVisible: true,
              statusFetch: true,
            })
          }
          else  { 
            this.setState({
              message: "Error occurred while getting data",
              modalVisible: true,
              statusFetch: true,
            })
            return    
          }
    }

     
      return(
       <Card key={artwork._id} >
       <CardItem>
         <Left>
           <Body>
             <Text>{artwork.title} {`(${artwork.year ? artwork.year : new Date().getFullYear()})`}</Text>
               <Text note>{artwork.artistName ? artwork.artistName : "Artist Not Specified"}</Text>
           </Body>
         </Left>
         <Right>
             <Text note>{ artwork.size } </Text>
             <Text note>{ artwork.category }</Text>  
         </Right>
       </CardItem>
       {typeof(artwork.imageUrl) == 'object' ?
       (
         <SliderBox
               images={artwork.imageUrl}
               sliderBoxHeight={250}
               dotColor="red"
               inactiveDotColor="#90A4AE"
         />
       )
       : 
       (
         <Lightbox>
           <Image 
             source={{ uri: artwork.imageUrl } } 
             style={{height: 200, width: null, flex: 1}}
             resizeMode="contain"
           />
         </Lightbox>
       )
       }

        <CardItem>
         <Left>
           <Body>
             <Text note>{ artwork.currency } { artwork.price }</Text>
               {/* <Text note>{artwork.artistName ? artwork.artistName : "Not Specified"}</Text> */}
           </Body>
         </Left>
         <Body>
             <Text note>{ artwork.country } </Text>
         </Body>
         <Right>
             <Text note> { artwork.duration }  secs</Text>
             {/* <Text note>{ artwork.category }</Text>   */}
         </Right>
       </CardItem>
        <CardItem>
        <Left>
            <Text note >{ artwork.isUsed ? "Auction Request submission by user successful" : "Awaiting Seller to submit Auction Request"}</Text>
        </Left>
         { artwork.isApproved ? (
             <Body>
             <TouchableOpacity
                onPress={this.checkStatus(artwork.verificationCode)}
             >
                <Text style={{ color: 'blue'}}> Check Status</Text>
             </TouchableOpacity>
         </Body>
         ) : null }
         <Right>
             <Text note>{ artwork.isApproved ? "Auction has been Approved" : "Awaiting Auction Approval" } </Text>
         </Right>
       </CardItem>
       <Accordion
          dataArray={[{title: "Auction Story", content: artwork.description }]}
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

