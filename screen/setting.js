import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {Share } from 'react-native';
import {BackHandler} from "react-native"

class SettingScreen extends Component {

  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Home")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        title: "Arte Red",
        message:
          'Arte Red | Check out this platform. It is an app that i use to connect with other stakeholders in the Art industry. Get it from www.artered.com',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.warn(result)
        } else {
          // shared
          console.warn(result)
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        return
      }
    } catch (error) {
      return
    }
  };

  render() {

    const myProfile = (
      <ListItem icon style={{ paddingTop: 50, paddingBottom: 50  }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="person" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("MyProfile")
                        }
                        else if(!this.props.userId){
                            Toast.show({
                                text: "You need to sign in to update profile",
                                buttonText: "Okay",
                                duration: 3000,
                                type: 'danger'
                              })
                        }
                        else{
                            this.props.navigation.navigate("MyProfile")
                        }
                    }}
                >
                    <Text>Profile</Text>
                    <Text note>Update Profile, Bio, Nick Name ...</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
    )

    const account = (
      <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="key" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("Account")
                        }
                        else if(!this.props.userId){
                            Toast.show({
                                text: "You need to sign in to see Account",
                                buttonText: "Okay",
                                duration: 3000,
                                type: 'danger'
                              })
                        }
                        else{
                            this.props.navigation.navigate("Account")
                        }
                    }}
                >
                    <Text>Accout</Text>
                    <Text note>Account Details ...</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
    )

    const wallet = (
      <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="wallet" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("ChangeWalletCurrency")
                        }
                        else if(!this.props.userId){
                            Toast.show({
                                text: "You need to sign in to see your Wallet",
                                buttonText: "Okay",
                                duration: 3000,
                                type: 'danger'
                              })
                        }
                        else{
                            this.props.navigation.navigate("ChangeWalletCurrencyt")
                        }
                    }}
                >
                    <Text>Wallet</Text>
                    <Text note>Change Wallet Currency</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
    )

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cog" />
            </Button>
          </Right>
        </Header>
        <Content style={{padding: 10 }}>
         { this.props.userId  && this.props.userId.length > 0 ? myProfile : null }
         { this.props.userId  && this.props.userId.length > 0 ? account : null }
         { this.props.userId  && this.props.userId.length > 0 ? wallet : null }

          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="help" />
              </Button>
            </Left>
            <Body>
              <TouchableOpacity
                onPress={()=> this.props.navigation.navigate("Help")}
              >
                <Text>Help</Text>
                <Text note>FAQ, Privacy Policy ...</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="people" />
              </Button>
            </Left>
            <Body>
              <TouchableOpacity
                onPress={()=> {
                  this.onShare()
                }}
              >
                <Text>Invite a friend</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="information-circle" />
              </Button>
            </Left>
            <Body>
              <TouchableOpacity
              onPress={()=> this.props.navigation.navigate("About")}
              >
                <Text>About</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(SettingScreen)