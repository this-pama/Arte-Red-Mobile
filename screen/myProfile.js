import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, 
    Toast, Button, Icon, Title, Segment } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';


export default class ProfileScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          register: "Register",
          follow : "Follow",
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
      const image = ( <Thumbnail source={ require('../assets/splash.png') } /> )
      const imageUri = ( <Thumbnail source={{ uri: this.state.image }} />)
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 40, paddingBottom: 30 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Setting")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>My Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="person" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <List>
              <ListItem avatar>
                <Left>
                    <TouchableOpacity 
                        onPress={ this.pickImage }
                    >
                        { this.state.image ? imageUri : image }
                    </TouchableOpacity>
                </Left>
                <Body>
                  <Text>Full Name</Text>
                  <Text note> Nick Name</Text>
                  <Text note>Telephone</Text>
                </Body>
                <Right>
                    <Text note>User Type</Text>
                    <Text note>Address</Text>
                    <Text note>Country</Text>
                </Right>
              </ListItem>
              <ListItem>
                 <Text note>This is about the Artist. This is about the Artist. This is about the Artist.</Text>
              </ListItem>
              <ListItem>
                  <Left>
                      <Text note>
                        Following {!this.props.following ? 0 : this.props.following}
                      </Text>
                  </Left>
                  <Right>
                    <Text note>
                        {!this.props.follower ? 0 : this.props.follower} Followers
                      </Text>
                  </Right>
              </ListItem>
              <ListItem>
                  <Left>
                    <Text note>
                        Email
                    </Text>
                  </Left>
                  <Right>
                    <TouchableOpacity 
                        onPress={()=>{
                            if(process.env.NODE_ENV === 'development'){
                                this.props.navigation.navigate("EditProfile")
                            }
                            else if(!this.props.userId){
                                Toast.show({
                                    text: "You need to sign in to edit",
                                    buttonText: "Okay",
                                    duration: 3000,
                                    type: 'danger'
                                  })
                            }
                            else{
                                this.props.navigation.navigate("EditProfile")
                            }
                        }}
                    >
                        <Text note style={{ color: "blue"}}>
                            Edit
                         </Text>
                    </TouchableOpacity>
                  </Right>
              </ListItem>
            </List>
        </Content>
      </Container>
    );
  }
}