import React, { Component } from 'react';
import { Container, Header, Content, Left, Body, Right, Form, Item, Label,
 Text, Button, Icon, Title, Segment, Input, Textarea, Spinner } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

      const routeName = this.props.navigation.getParam("routeName", "Home")
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(routeName)}>
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
        <KeyboardAwareScrollView>
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
                        <Input onChangeText= { this.props.handleAddress } value={this.props.address}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Short Description</Label>
                        <Input onChangeText= { this.props.handleShort } value={this.props.short} autoCapitalize='words'  />
                    </Item>
                      <Textarea rowSpan={5} bordered 
                        placeholder="Write a full description about about the exhibition."
                        value={this.props.long}
                        onChangeText={this.props.handleLong}
                      />
                    <Item stackedLabel>
                        <Label>Country</Label>
                        <Input onChangeText= {this.props.handleCountry} value={this.props.country }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Exhibition Capacity</Label>
                        <Input onChangeText= {this.props.handleCapacity} value={this.props.capacity }  keyboardType="numeric"/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Name</Label>
                        <Input onChangeText= {this.props.handleName } value={this.props.name }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Email</Label>
                        <Input onChangeText= {this.props.handleEmail } value={this.props.email }  autoCapitalize='words'/>
                    </Item>
                </Form>
                <Button block danger
                  disabled={ this.props.disable}
                  onPress={this.props.create}
                >
                    {
                      this.props.spin ? <Spinner color="white" /> 
                    : <Text> Create Exhibition </Text>
                    }
                </Button>
        </Content>
        </KeyboardAwareScrollView>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

CreateExhibitionScreen.propTypes={
  title: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  short : PropTypes.string.isRequired,
  long: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  capacity: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleTitle: PropTypes.func.isRequired,
  handleAddress: PropTypes.func.isRequired,
  handleShort: PropTypes.func.isRequired,
  handleLong: PropTypes.func.isRequired,
  handleCountry: PropTypes.func.isRequired,
  handleCapacity: PropTypes.func.isRequired,
  handleName: PropTypes.func.isRequired,
  handleEmail: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  disable : PropTypes.bool.isRequired,
  spin : PropTypes.bool.isRequired,
}