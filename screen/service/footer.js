import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, ActionSheet } from 'native-base';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'

var BUTTONS = ["Camera", "Gallery", "Close"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

export default class FooterTabs extends Component {

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
        aspect: [4, 3],
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
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        // this.setState({ image: result.uri });
        this.props.navigation.navigate("Post", {
          image : result
        })
      }
    }


  render() {
    return (
      
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            active= { !this.props.activeMe ? false : true }>
              <Icon name="apps" />
              <Text>Me</Text>
            </Button>
            <Button vertical
            active= { !this.props.activePost ? false : true }
             onPress= {()=>{
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
              )}
            }>
              <Icon name="camera" />
              <Text>Post</Text>
            </Button>
            <Button vertical
              active= { !this.props.activeWallet ? false : true }
             onPress={()=> this.props.navigation.navigate("Wallet")} >
              <Icon active name="wallet" />
              <Text>Wallet</Text>
            </Button>
            <Button vertical 
            active= { !this.props.activeNetwork ? false : true }
            onPress={()=> this.props.navigation.navigate("Network")}>
              <Icon name="people" />
              <Text>Network</Text>
            </Button>
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