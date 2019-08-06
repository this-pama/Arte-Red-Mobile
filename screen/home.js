import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Footer, FooterTab, } from 'native-base';
import FooterScreen from './service/footer'

export default class HomeScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>User Full Name</Text>
                  <Text note>User Nick Name</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={this.props.like}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.props.like != null || this.props.like != undefined  ? this.props.like : 0 } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> console.warn("comment")}>
                  <Icon active name="chatbubbles" />
                  <Text>{this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 } Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text>
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>User Full Name</Text>
                  <Text note>User Nick Name</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={this.props.like}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.props.like != null || this.props.like != undefined  ? this.props.like : 0 } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> console.warn("comment")}>
                  <Icon active name="chatbubbles" />
                  <Text>{this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 } Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text>
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>User Full Name</Text>
                  <Text note>User Nick Name</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={this.props.like}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.props.like != null || this.props.like != undefined  ? this.props.like : 0 } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> console.warn("comment")}>
                  <Icon active name="chatbubbles" />
                  <Text>{this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 } Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
        <FooterScreen />
      </Container>
    );
  }
}