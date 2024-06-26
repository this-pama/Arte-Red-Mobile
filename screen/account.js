import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast, ActionSheet } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"
import {BackHandler, RefreshControl } from "react-native"
import {
  Notifications,
} from 'expo';


var BUTTONS = ["Delete", "Close"];
var CANCEL_INDEX = 1;
 class AccountScreen extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }
  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Setting")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  delete = async () => {
      var url = apiUrl + "user/" + this.props.userId;
      var result = await fetch(url, {
        method: 'DELETE',
        headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt}`,
       },
      });
      var response = await result;
      
      if(response.status !== 200 ){
        alert("Could not delete account")
      }
      else{
        var res = await response.json();
        if (res.message) {
          this.props.navigation.navigate("Home")
        } 
        else  {
          this.props.navigation.navigate("Setting")
        }
      }
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 40, paddingBottom: 30 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Setting")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Account</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="settings" />
            </Button>
          </Right>
        </Header>
        <Content style={{padding: 10 }}>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="swap" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                       this.props.navigation.navigate("ChangePassword")
                    }}
                >
                    <Text>Change Password</Text>
                    {/* <Text note>Account Details ...</Text> */}
                </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="trash" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                          ActionSheet.show(
                            {
                              options: BUTTONS,
                              cancelButtonIndex: CANCEL_INDEX,
                              title: "Delete Account"
                            },
                            buttonIndex => {
                              this.setState({ clicked: BUTTONS[buttonIndex] });
                              if(BUTTONS[buttonIndex] === "Delete" ){
                                this.delete()
                              }

                              else{
                                this.props.navigation.navigate("Setting")
                              }
                              
                            }
                          )
                            
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
                          ActionSheet.show(
                            {
                              options: BUTTONS,
                              cancelButtonIndex: CANCEL_INDEX,
                              title: "Delete Account"
                            },
                            buttonIndex => {
                              this.setState({ clicked: BUTTONS[buttonIndex] });
                              if(BUTTONS[buttonIndex] === "Delete" ){
                                this.delete()
                              }

                              else{
                                this.props.navigation.navigate("Setting")
                              }
                              
                            }
                          )
                        }
                    }}
                >
                    <Text>Delete Account</Text>
                    {/* <Text note>Add new bank details</Text> */}
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

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
  moreArtworkDetailsAction, getUserProfileAction })(AccountScreen)