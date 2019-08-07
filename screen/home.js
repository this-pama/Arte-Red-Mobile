import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, ActionSheet } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';

export default class HomeScreen extends Component {
  render() {
    return (
      <Container>
        <Content >
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>User Full Name</Text>
                  <Text note>User Nick Name</Text>
                </Body>
              </Left>
              <Right>
                <Button transparent onPress={()=> this.props.navigation.navigate("", {
                        comments: []
                    })}>
                    <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                    {/* <Text>info</Text> */}
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
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
                <Button transparent onPress={()=> this.props.navigation.navigate("Comment", {
                    comments: []
                })}>
                  <Icon active name="chatbubbles" />
                  <Text>{this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 } Comments</Text>
                </Button>
                
              </Body>
              <Right>
                <Button transparent onPress={()=> this.props.navigation.navigate("", {
                        comments: []
                    })}>
                    <Icon active name="pricetag" />
                    <Text>NGN {this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 }</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
          </Card>
        </Content>
        <FooterScreen 
            navigation={this.props.navigation} 
            // post= {this._pickImage}
        />
      </Container>
    );
  }
}