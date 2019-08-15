import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast, ActionSheet } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env'


var BUTTONS = ["Delete", "Close"];
var CANCEL_INDEX = 1;

export default class AccountScreen extends Component {
  constructor(props){
    super(props);
    this.state={
    }
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
          <ListItem icon style={{ paddingTop: 30, paddingBottom: 50  }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="swap" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("")
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
                            this.props.navigation.navigate("")
                        }
                    }}
                >
                    <Text>Change Email</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="swap" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("")
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
                            this.props.navigation.navigate("")
                        }
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