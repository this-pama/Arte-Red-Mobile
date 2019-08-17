import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Form,
    Label, Item, Input, Text, Button, Icon, Left, Body, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {apiUrl} from "./service/env"


class BuyScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      artwork: {},
      quantity: 0
    }
  }

    async componentDidMount(){
      const artworkId = this.props.navigation.getParam("artworkId")
      var url = apiUrl + "artwork/" + artworkId;
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
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          this.setState({
            artwork: res
          })
        }

        else  {
          console.warn("Can't get artwork")
          
        }
      }
    }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Buy Artwork</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={{flex: 0}}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!this.state.artwork.title ? "Title" : this.state.artwork.title}</Text>
                  <Text note>{!this.state.artwork.year ? "Year Unknown" : this.state.artwork.year}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                  <TouchableOpacity>
                    <Text note>{!this.state.artwork.artistName ? "Artist Unknown" : this.state.artwork.artistName}</Text>
                  </TouchableOpacity>
                  <Text note >{!this.state.artwork.location ? "Location Unknown" : this.state.artwork.location }</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem>
              {/* <Body> */}
                <Image source={{uri : this.state.artwork.imageURL }} style={{height: 200, width: 400, flex: 1}} />
              {/* </Body> */}
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="pricetag" />
                  <Text>NGN {!this.state.artwork.price ? "0" : this.state.artwork.price}</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
          <Form style={{ paddingTop: 20, paddingBottom: 20}}>
            <Text style={{fontWeight: "bold", paddingLeft: 40}}>Total Cost</Text>
            <Text note style={{ paddingLeft: 40 }}>NGN {this.state.artwork.price ? (this.state.artwork.price*this.state.quantity) : this.state.artwork.price || 0}</Text>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Quantity</Label>
              <Input keyboardType="numeric" />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>First Name</Label>
              <Input  />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Last Name</Label>
              <Input  />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Email</Label>
              <Input  />
            </Item>
          </Form>
          <Button block danger
            onPress={()=> {
              if(process.env.NODE_ENV === "development"){
                this.props.navigation.navigate("Rave")
              }
              else if(!this.props.userId){
                Toast.show({
                  text: "You need to sign in to buy the artwork",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
              else{ this.props.navigation.navigate("Rave") }
            }}
          >
              <Text>Proceed To Payment</Text>
          </Button>
        </Content>
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
    getUserProfileAction })(BuyScreen )