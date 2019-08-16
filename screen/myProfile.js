import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, 
    Toast, Button, Icon, Title, Segment } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { apiUrl, cloudinaryUrl } from './service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import {getUserProfileAction } from "../redux/userProfileAction"
import {connect} from 'react-redux'

class ProfileScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          register: "Register",
          follow : "Follow",
        }
      }
    
      componentDidMount() {
        this.getPermissionAsync();

        //check if image url link exist and set state if true
        // if(this.props.profile[0]){
        //   this.setState({ image : this.props.profile[0].profileImage })
        // }

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
            this.setState({ 
              image: result.uri,
             })

             // upload image to cloudinary
             this.uploadImage(result.base64)
          }
        }

        uploadImage= async (base64) => {
          let base64Img = `data:image/jpg;base64,${base64}`
          let data = {
            "file": base64Img,
            "upload_preset": "artered",
          }
  
          fetch(cloudinaryUrl, {
            body: JSON.stringify(data),
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST',
          })
          .then(async r => {
              let data = await r.json()
              // this.setState({ imageUrl : data.secure_url })
              this.saveToDb(data.secure_url)
          })
          .catch(err=>console.warn(err))
  
      };

      saveToDb = async (uri) => {
          var url = apiUrl + "user/add/" + this.props.userId;
          var result = await fetch(url, {
            method: 'POST',
            headers: { 
              'content-type': 'application/json',
              "Authorization": `Bearer ${this.props.jwt.jwt}`
           },
            body: JSON.stringify({
              profileImage: uri
            })
          });
          var response = await result;
          
          if(response.status !== 200 ){
            console.warn("failed response")
            return
          }
          else{
            var res = await response.json();
            if (res._id) {
              console.warn("success")
              return
            } 
            else  {
              console.warn("failed")
              return
            }
          }
          
      };


  render() {
      const image = ( <Thumbnail source={{ uri: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png"}} /> )
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
                    { this.props.profile.profileImage && 
                        this.props.profile.profileImage.length > 0 
                          ? imageUri  : image
                      }
                    </TouchableOpacity>
                </Left>
                <Body>
                  <Text>{this.props.profile.firstName ? this.props.profile.firstName : "First Name"}</Text>
                  <Text note> {this.props.profile.lastName ? this.props.profile.lastName : "Last Name"}</Text>
                  <Text note>{this.props.profile.telephone ? this.props.profile.telephone : "Telephone"}</Text>
                </Body>
                <Right>
                    <Text note>{this.props.profile.userType ? this.props.profile.userType : "Type of User"}</Text>
                    <Text note>{this.props.profile.address ? this.props.profile.address : "Address"}</Text>
                    <Text note>{this.props.profile.country ? this.props.profile.country : "Country"}</Text>
                </Right>
              </ListItem>
              <ListItem>
                 <Text note>{this.props.profile.description ? this.props.profile.description : "About me"}</Text>
              </ListItem>
              <ListItem>
                  <Left>
                      <Text note>
                        Following {!this.props.profile.following ? 0 : this.props.profile.following}
                      </Text>
                  </Left>
                  <Right>
                    <Text note>
                        {!this.props.profile.follower ? 0 : this.props.profile.follower} Followers
                      </Text>
                  </Right>
              </ListItem>
              <ListItem>
                  <Left>
                    <Text note>
                        {this.props.profile.email ? this.props.profile.email : "Email"}
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

const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(ProfileScreen)