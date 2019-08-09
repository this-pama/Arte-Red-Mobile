import React, { Component } from 'react';
import { Image, Modal, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, 
  Toast, Textarea } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      like: 0,
      comment: 0
    }
  }
  
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
                <Button transparent onPress={()=>{
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to like this artwork",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.like++
                      })
                  }
                }}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.state.like  } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> {
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to comment",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.comment++
                      })
                  }
                }
              }>
                  <Icon active name="chatbubbles" />
                  <Text>{ this.state.comment } Comments</Text>
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
                <Button transparent onPress={()=>{
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to like this artwork",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.like++
                      })
                  }
                }}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.state.like  } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> {
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to comment",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.comment++
                      })
                  }
                }
              }>
                  <Icon active name="chatbubbles" />
                  <Text>{ this.state.comment } Comments</Text>
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