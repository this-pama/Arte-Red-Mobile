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
  }

  render() {
    const routeName= this.props.navigation.getParam("routeName", "Home")
    if(!(this.state.fetch)){
      return(
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
          <Body>
            <Spinner color="red" />
          </Body>
        </Content>  
        </Container>
      )
    }
    else{
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
          <Card style={{flex: 0}} key={this.state.artworkId}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!this.state.artwork.title ? "Title" : this.state.artwork.title} {!this.state.artwork.year ? "2019" : this.state.artwork.year}</Text>
                  <Text note>{!this.state.artwork.size ? "Size in inches" : this.state.artwork.size + " Inches"}</Text>
                  <TouchableOpacity 
                      onPress={()=> this.props.navigation.navigate("Profile", {id: this.state.artwork.userId})}>
                    <Text style={{color : "blue"}} note >Sponsor</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Body>
                    <Text note >{!this.state.artwork.artistName ? "Artist Name" : this.state.artwork.artistName}</Text>
                  <Text note>{!this.state.artwork.location ? "Location" : this.state.artwork.location}</Text>
                  <Text note>{!this.state.artwork.category ? "Painting" : this.state.artwork.category}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri : this.state.artwork.imageURL }} style={{height: 300, width: null, flex: 1}} />
            </CardItem>
            <CardItem>
              <Body>
                <Text icon style={{ paddingTop: 20}}>
                  {!this.state.artwork.story ? "No story about the artwork" : this.state.artwork.story }
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}
                onPress= {()=>{ 
                  this.props.buyArtworkAction({id: this.state.artwork._id})
                  this.props.navigation.navigate("Buy", {routeName : "Detail"})} 
                }
                >
                  <Icon name="pricetag" />
                  <Text>NGN {!this.state.artwork.price ? "0" : this.state.artwork.price}</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}
                onPress= {()=> { 
                  this.props.buyArtworkAction({id: this.state.artwork._id})
                  this.props.navigation.navigate("Buy", {routeName : "Detail"})} 
                }
                >
                  <Icon name="barcode" />
                  <Text>Quantity: {!this.state.artwork.numberAvailable ? "0" : this.state.artwork.numberAvailable }</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent 
                  onPress= {()=> { 
                    this.props.buyArtworkAction({id: this.state.artwork._id})
                    this.props.navigation.navigate("Buy", {routeName : "Detail"})} 
                  }
                  textStyle={{color: '#87838B'}}>
                  <Icon name="cart" />
                  <Text>Buy</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
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
    getUserProfileAction, buyArtworkAction, moreArtworkDetailsAction })(ArtworkDetailScreen )