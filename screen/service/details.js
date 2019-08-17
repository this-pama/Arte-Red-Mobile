import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ArtworkDetailScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      artwork: {}
    }
  }
  componentDidMount(){
    const artwork = this.props.navigation.getParam("artwork")
    this.setState({ artwork })
  }
  render() {
    if(!("_id" in this.state.artwork)){
      return(
        <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 40, paddingBottom: 30 }}>
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
        <Header style={{ backgroundColor: "#990000", paddingTop: 40, paddingBottom: 30 }}>
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
                  <Text>{!this.state.artwork.title ? "Title" : this.state.artwork.title} {!this.state.artwork.year ? "2019" : this.state.artwork.year}</Text>
                  <Text note>{!this.state.artwork.size ? "Size in inches" : this.state.artwork.size + " Inches"}</Text>
                  <TouchableOpacity 
                      onPress={()=> this.props.navigation.navigate("Profile", {profileId: this.state.artwork.userId})}>
                    <Text style={{color : "blue"}} note >Sponsorer</Text>
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
            <CardItem>
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
                onPress= {()=> this.props.navigation.navigate("Buy", { artworkId : this.state.artwork._id} )}
                >
                  <Icon name="pricetag" />
                  <Text>NGN {!this.state.artwork.price ? "0" : this.state.artwork.price}</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}
                onPress= {()=> this.props.navigation.navigate("Buy", { artworkId : this.state.artwork._id})}
                >
                  <Icon name="barcode" />
                  <Text>Quantity: {!this.state.artwork.numberAvailable ? "0" : this.state.artwork.numberAvailable }</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent 
                  onPress= {()=> this.props.navigation.navigate("Buy", { artworkId : this.state.artwork._id})}
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