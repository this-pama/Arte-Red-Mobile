import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right,
  Card, CardItem, Thumbnail, Text, Button, Icon, Title, Segment } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ExhibitionScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      register: "Register"
    }
  }

  render() {
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Exhibition</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="eye" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active onPress={()=> this.props.navigation.navigate("")}>
            <Text>Recent Exhibition</Text>
          </Button>
          <Button  onPress={()=> this.props.navigation.navigate("CreateExhibition")}>
            <Text>Create Exhibition</Text>
          </Button>
        </Segment>
        <Content padder>
        <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Body>
                  <Text>Organizer</Text>
                  {/* <Text note>April 15, 2016</Text> */}
                  <Text note>Country</Text>
                </Body>
              </Left>
              <Right>
                <Button transparent active
                  onPress={()=> this.props.navigation.navigate("ExpandExhibition")}
                 >
                  <Icon active name="open" />
                  <Text style={{ color: "blue" }}>Learn More</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: "https://res.cloudinary.com/artered/image/upload/v1565393034/ykxz7pqmbr8qtxinfoea.jpg"} } style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem >
                <Text>
                  The course introduces advanced ...
                </Text>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="time" />
                  <Text>April 15, 2016</Text>
                </Button>
              </Left>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}
                  onPress={()=> this.setState({ register: "Registered"})}
                >
                  <Text>{this.state.register}</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}