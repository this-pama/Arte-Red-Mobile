import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body } from 'native-base';

export default class ArtworkDetailScreen extends Component {
  render() {
      const story = this.props.navigation.getParam("story")
      const title= this.props.navigation.getParam("title")
      const year = this.props.navigation.getParam("year")
      const artistName = this.props.navigation.getParam("artistName")
      const location = this.props.navigation.getParam("location")
      const size = this.props.navigation.getParam("size")
      const category = this.props.navigation.getParam("category")
      const available = this.props.navigation.getParam("available")
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
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
          <Card style={{flex: 0}}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!title ? "Title" : title}</Text>
                  <Text note>{!year ? "2019" : year}</Text>
                  <Text note>{!size ? "12 inches" : size}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                  <Text>{!artistName ? "Artist Name" : artistName}</Text>
                  <Text note>{!location ? "Lagos" : location}</Text>
                  <Text note>{!category ? "Painting" : category}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={ require('../../assets/splash.png') } style={{height: 200, width: 400, flex: 1}} />
                <Text>
                  {!story ? "Artwork details goes here." : story }
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="pricetag" />
                  <Text>NGN {this.props.price}</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="barcode" />
                  <Text>Quantity: {!available ? "0" : available }</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="cart" />
                  <Text>Buy</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}