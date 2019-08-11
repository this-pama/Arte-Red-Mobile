import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Form,
    Label, Item, Input, Text, Button, Icon, Left, Body, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Rave from 'react-native-rave';

export default class BuyScreen extends Component {

    state={
        quantity: null
    }
  render() {
      const title= this.props.navigation.getParam("title")
      const year = this.props.navigation.getParam("year")
      const artistName = this.props.navigation.getParam("artistName")
      const location = this.props.navigation.getParam("location")
      const size = this.props.navigation.getParam("size")
      const category = this.props.navigation.getParam("category")
      const price = this.props.navigation.getParam("price")
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
              <Icon name="open" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={{flex: 0}}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!title ? "Title" : title}</Text>
                  <Text note>{!year ? "2019" : year}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                  <TouchableOpacity
                    onPress={()=> this.props.navigation.navigate("Profile")}
                  >
                    <Text style={{ color: "blue" }}>{!artistName ? "Artist Name" : artistName}</Text>
                  </TouchableOpacity>
                  {/* <Text note>{!location ? "Lagos" : location}</Text>
                  <Text note>{!category ? "Painting" : category}</Text> */}
                </Body>
              </Right>
            </CardItem>
            <CardItem>
              {/* <Body> */}
                <Image source={ require('../assets/splash.png') } style={{height: 200, width: 400, flex: 1}} />
              {/* </Body> */}
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="pricetag" />
                  <Text>NGN {!price ? "0" : price}</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
          <Form style={{ paddingTop: 20, paddingBottom: 20}}>
            <Text style={{fontWeight: "bold", paddingLeft: 40}}>Total Cost</Text>
            <Text note style={{ paddingLeft: 40 }}>NGN {price ? (price*this.state.quantity) : price || 0}</Text>
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