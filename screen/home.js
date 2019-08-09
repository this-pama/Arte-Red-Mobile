import React, { Component } from 'react';
import { Image, Modal, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Textarea } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class HomeScreen extends Component {
  
  render() {
    return (
      <Container>
        <Content >
          <Card>
            <CardItem>
              <Left>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate("Profile")}
                >
                 <Thumbnail source={ require('../assets/splash.png') } />
                </TouchableOpacity>
                <Body>
                  <Text>Artwork Title</Text>
                  <TouchableOpacity  onPress={()=> this.props.navigation.navigate("Profile")} >
                    <Text note style={{ color : "blue"}}>User Full Name</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Button transparent onPress={() => this.props.navigation.navigate("Detail") }>
                    <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                    {/* <Text>info</Text> */}
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={ require('../assets/splash.png') } style={{height: 200, width: null, flex: 1}}/>
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
                <Button transparent onPress= {()=> this.props.navigation.navigate("Buy")}>
                    <Icon active name="pricetag" />
                    <Text>NGN {this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 }</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Left>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate("Profile")}
                >
                 <Thumbnail source={ require('../assets/splash.png') } />
                </TouchableOpacity>
                <Body>
                  <Text>Artwork Title</Text>
                  <TouchableOpacity  onPress={()=> this.props.navigation.navigate("Profile")} >
                    <Text note style={{ color : "blue"}}>User Full Name</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Button transparent onPress={() => this.props.navigation.navigate("Detail") }>
                    <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                    {/* <Text>info</Text> */}
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={ require('../assets/splash.png') } style={{height: 200, width: null, flex: 1}}/>
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
                <Button transparent onPress= {()=> this.props.navigation.navigate("Buy")}>
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
            activeMe = { true } 
            // post= {this._pickImage}
        />

      </Container>
    );
  }
}