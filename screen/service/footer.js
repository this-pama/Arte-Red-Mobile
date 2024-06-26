import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, ActionSheet, Toast } from 'native-base';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'
import { cloudinaryUrl } from "./env"
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"

var BUTTONS = ["Camera", "Gallery", "Close"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

class FooterTabs extends Component {

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


    useCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.3,
        base64: true
      });

      if (!result.cancelled) {
        this.props.navigation.navigate("Post", {
          image : result
        })
      }
    }

    pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.3,
        base64: true
      });

      if (!result.cancelled) {
        this.props.navigation.navigate("Post", {
          image : result
        })
      }
    }


  render() {
    const loginMenu = (
      <Button vertical 
        active= { !this.props.activeNetwork ? false : true }
        onPress={()=> this.props.navigation.navigate("Login")}>
          <Icon name="log-in" />
          <Text>Login</Text>
      </Button>
    )

    const auction = (
      <Button vertical 
        active= { !this.props.activeNetwork ? false : true }
        onPress={()=> this.props.navigation.navigate("Auction")}>
          <Icon name="md-briefcase" />
          <Text>Auction</Text>
      </Button>
    )

    const post = (
      <Button vertical
              active= { !this.props.activePost ? false : true }
             onPress= {()=>{
               if(process.env.NODE_ENV === 'development'){
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: "Post An Artwork"
                  },
                  buttonIndex => {
                    this.setState({ clicked: BUTTONS[buttonIndex] });
                    if(BUTTONS[buttonIndex] === "Camera" ){
                      this.useCamera()
                    }
                    else if(BUTTONS[buttonIndex] === "Gallery" ){
                      this.pickImage()
                    }
                  }
                )
               }
              else if(this.props.userId && this.props.userId.length > 0){
              ActionSheet.show(
                {
                  options: BUTTONS,
                  cancelButtonIndex: CANCEL_INDEX,
                  destructiveButtonIndex: DESTRUCTIVE_INDEX,
                  title: "Post An Artwork"
                },
                buttonIndex => {
                  this.setState({ clicked: BUTTONS[buttonIndex] });
                  if(BUTTONS[buttonIndex] === "Camera" ){
                    this.useCamera()
                  }
                  else if(BUTTONS[buttonIndex] === "Gallery" ){
                    this.pickImage()
                  }
                }
              )
              }
              else{
                Toast.show({
                  text: "You need to sign in to make a post",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
            }}>
              <Icon name="camera" />
              <Text>Post</Text>
            </Button>
    )
    return (
      
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            active= { !this.props.activeMe ? false : true }>
              <Icon name="apps" />
              <Text>Me</Text>
            </Button>
            { this.props.userId && this.props.userId.length > 0 ? post : null }
            <Button vertical
              active= { !this.props.activeExhibition ? false : true }
             onPress={()=> this.props.navigation.navigate("Exhibition")} >
              <Icon active name="md-photos"  />
              <Text>Exhibition</Text>
            </Button>
            { this.props.userId && this.props.userId.length > 0 ? auction : loginMenu  }
            
          </FooterTab>
        </Footer>
      
    );
  }
}

FooterTabs.propTypes={
  navigation: PropTypes.object.isRequired,
  activeMe: PropTypes.bool,
  activeNetwork: PropTypes.bool,
  activePost: PropTypes.bool,
  activeWallet: PropTypes.bool
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction})(FooterTabs)