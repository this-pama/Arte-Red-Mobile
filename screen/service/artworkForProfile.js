import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body,
Segment } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ProfileArtworkScreen extends Component {
  render() {
      const story = this.props.navigation.getParam("story")
      const title= this.props.navigation.getParam("title")
      const year = this.props.navigation.getParam("year")
      const artistName = this.props.navigation.getParam("artistName")
      const location = this.props.navigation.getParam("location")
      const size = this.props.navigation.getParam("size")
      const category = this.props.navigation.getParam("category")
      const available = this.props.navigation.getParam("available")
      const price = this.props.navigation.getParam("price")
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first onPress={()=> this.props.navigation.navigate("Profile")} >
            <Text>About</Text>
          </Button>
          <Button active >
            <Text>Artworks</Text>
          </Button>
          <Button last onPress={()=> this.props.navigation.navigate("")} >
            <Text>Collections</Text>
          </Button>
        </Segment>
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
              <Body>
                  <Text icon>Sold 0</Text>
              </Body>

              <Right>
                <Body>
                  <TouchableOpacity 
                    onPress={()=> this.props.navigation.navigate("Profile") }>
                    <Text style={{color : "blue"}} >{!artistName ? "Artist Name" : artistName}</Text>
                  </TouchableOpacity>
                  <Text note>{!location ? "Lagos" : location}</Text>
                  <Text note>{!category ? "Painting" : category}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={ require('../../assets/splash.png') } style={{height: 200, width: 400, flex: 1}} />
                <TouchableOpacity onPress={()=> this.props.navigation.navigate("Detail")}>
                    <Text icon style={{ color: "blue", paddingTop: 20}}>
                    Learn More...
                    </Text>
                </TouchableOpacity>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}
                onPress= {()=> this.props.navigation.navigate("Buy")}
                >
                  <Icon name="pricetag" />
                  <Text>NGN {!price ? "0" : price}</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}
                onPress= {()=> this.props.navigation.navigate("Buy")}
                >
                  <Icon name="barcode" />
                  <Text>Quantity: {!available ? "0" : available }</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent 
                  onPress= {()=> this.props.navigation.navigate("Buy")}
                  textStyle={{color: '#87838B'}}>
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