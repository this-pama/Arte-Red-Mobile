import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class SettingScreen extends Component {
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 20 }}>
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
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="wallet" />
              </Button>
            </Left>
            <Body>
                <TouchableOpacity 
                    onPress={()=>{
                        if(process.env.NODE_ENV == "development"){
                            this.props.navigation.navigate("Wallet")
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
                            this.props.navigation.navigate("Wallet")
                        }
                    }}
                >
                    <Text>Wallet</Text>
                    <Text note>Add new bank details</Text>
                </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="help" />
              </Button>
            </Left>
            <Body>
              <TouchableOpacity>
                <Text>Help</Text>
                <Text note>FAQ, Contact us, Privacy Policy ...</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon style={{ paddingTop: 20, paddingBottom: 50 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="people" />
              </Button>
            </Left>
            <Body>
              <TouchableOpacity>
                <Text>Invite a friend</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
        </Content>
      </Container>
    );
  }
}