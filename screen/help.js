import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class HelpScreen extends Component {
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
            <Title>Help</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="help" />
            </Button>
          </Right>
        </Header>
        <Content style={{padding: 10 }}>
          <ListItem icon style={{ paddingTop: 30, paddingBottom: 50  }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="help" />
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
                    <Text>FAQ</Text>
                    <Text note>Frequently Ask Question</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="book" />
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
                    <Text>Privacy Policy</Text>
                    {/* <Text note>Account Details ...</Text> */}
                </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="call" />
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
                                text: "You need to sign in to see your Wallet",
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
                    <Text>Contact Us</Text>
                    {/* <Text note>Add new bank details</Text> */}
                </TouchableOpacity>
            </Body>
          </ListItem>
        </Content>
      </Container>
    );
  }
}