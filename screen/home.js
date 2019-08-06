import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Footer, FooterTab, } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';

export default class HomeScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            image: ''
        }
    }
    
componentDidMount() {
    this.getPermissionAsync();
    }

getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to post!');
        }
    }
}


_pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.warn(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  
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
                    <Icon active name="cash" />
                    <Text>{this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 } Price</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
          </Card>
        </Content>
        <FooterScreen 
            navigation={this.props.navigation} 
            post= {this._pickImage}
        />
      </Container>
    );
  }
}