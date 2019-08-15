import React, { Component } from 'react';
import { Container, Header, Content, Left, Body, Right, Form, Item, Label,
 Text, Button, Icon, Title, Segment, Input, Textarea } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'

export default class CreateExhibitionScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      register: "Register",
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

    pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [6, 5],
        base64: true
      });

      if (!result.cancelled) {
        this.setState({ image: result.uri })
      }
    }

  render() {
      const imagePlaceholder =(
        <Image source={{uri: this.state.image }}
            style={{height: 300, width: null, flex: 1}}
        />
      )
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
          <Button first onPress={()=> this.props.navigation.navigate("Exhibition")}>
            <Text>Recent Exhibition</Text>
          </Button>
          <Button active  onPress={()=> this.props.navigation.navigate("")}>
            <Text>Create Exhibition</Text>
          </Button>
        </Segment>
        <Content padder style={{ paddingBottom: 20 }}>
                <Item>
                  <Right>
                    <Button transparent
                        onPress={this.pickImage }
                    >  
                      <Icon name="camera" active />
                        <Text> Upload Image </Text>
                    </Button>
                  </Right>
                </Item>
                {this.state.image  ? imagePlaceholder : null }
                <Form>
                    <Item stackedLabel>
                        <Label>Title</Label>
                        <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Address</Label>
                        <Input onChangeText= { this.props.handleArtistName } value={this.props.artistName}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Short Description</Label>
                        <Input onChangeText= { this.props.handleSize } value={this.props.size} autoCapitalize='words'  />
                    </Item>
                      <Textarea rowSpan={5} bordered 
                        placeholder="Write a full description about about the exhibition."
                        value={this.props.story}
                        onChangeText={this.props.handleStory}
                      />
                    <Item stackedLabel>
                        <Label>Country</Label>
                        <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer</Label>
                        <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
                    </Item>
                </Form>
                <Button block danger>
                    <Text> Create Exhibition </Text>
                </Button>
        </Content>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}