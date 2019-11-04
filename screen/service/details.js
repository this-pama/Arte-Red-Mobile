import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import {apiUrl} from "./env"
import { like, unLike, rating } from "../../controller/api"
import { Rating, AirbnbRating } from 'react-native-ratings';
import Lightbox from "react-native-lightbox"
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler} from "react-native"



class ArtworkDetailScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      artwork: {},
      artworkId: "",
      fetch: false
    }
  }


  async componentDidMount(){
   await  this.setState({
      artwork: {},
      artworkId: this.props.artworkId
    })


    var url = apiUrl + "artwork/" + this.state.artworkId;
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
      this.setState({
        artwork: {}
      })
      
      return
    }
    else{
      var res = await response.json();
      if (res._id) {
        this.setState({
          artwork: res,
          fetch: true
        })
      }

      else  {
        console.warn("Can't get artwork")
        this.setState({
          artwork: {}
        })
        
      }
    }

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate(this.props.navigation.getParam("routeName", "Home"))
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    const routeName= this.props.navigation.getParam("routeName", "Home")
    const forSale= artwork => (
      <Body>
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
      </Body>
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

      const quantity = (
        <Button transparent textStyle={{color: '#87838B'}}
          onPress= {()=> { 
            this.props.buyArtworkAction({id: this.state.artwork._id})
            this.props.navigation.navigate("Buy", {routeName : "Detail"})} 
          }
          >
            <Icon name="barcode" />
            <Text>Quantity: {!this.state.artwork.numberAvailable ? "0" : this.state.artwork.numberAvailable }</Text>
          </Button>
      )
      
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> {
            this.props.navigation.navigate(routeName)}}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Artwork</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="open" />
            </Button>
          </Right>
        </Header>
        <Content>
          { this.state.fetch ? (
            <Body>
            <Spinner color="red" />
          </Body>
          ) : null }
          <Card key={this.state.artworkId}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!this.state.artwork.title ? null : this.state.artwork.title} {!this.state.artwork.year ? new Date().getFullYear() : this.state.artwork.year}</Text>
                  <Text note>{!this.state.artwork.size ? null : this.state.artwork.size + " Inches"}</Text>
                  <TouchableOpacity 
                      onPress={()=> this.props.navigation.navigate("Profile", {id: this.state.artwork.userId})}>
                    <Text style={{color : "blue"}} note >Sponsor</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Body>
                    <Text note >{!this.state.artwork.artistName ? null : this.state.artwork.artistName}</Text>
                  <Text note>{!this.state.artwork.location ? null : this.state.artwork.location}</Text>
                  <Text note>{!this.state.artwork.category ? null : this.state.artwork.category}</Text>
                </Body>
              </Right>
            </CardItem>
            {/* <CardItem> */}
              <SliderBox
                images={this.state.artwork.imageURL}
                sliderBoxHeight={400}
                onCurrentImagePressed={index =>
                    console.warn(`image ${index} pressed`)
                }
                dotColor="red"
                inactiveDotColor="#90A4AE"
              />
              {/* <Image source={{uri : this.state.artwork.imageURL }} style={{height: 300, width: null, flex: 1}} /> */}
            {/* </CardItem> */}
            <CardItem>
              <Body>
                <Text icon style={{ paddingTop: 20}}>
                  {!this.state.artwork.story ? "No story about the artwork" : this.state.artwork.story }
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
              { this.state.artwork.forSale ? quantity : 
                (this.state.artwork.showcase ? null : 
                  ( this.state.artwork.progressShot ? null : null ))
              }
              </Left>
              <Body>
                { this.state.artwork.forSale ? forSale(this.state.artwork) : 
                  (this.state.artwork.showcase ? showcase : 
                    ( this.state.artwork.progressShot ? progressShot : forSale(this.state.artwork)))
                }
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile,
  artworkId: state.artworkDetails.artworkId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, buyArtworkAction, moreArtworkDetailsAction })(ArtworkDetailScreen )