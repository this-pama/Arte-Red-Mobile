import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import { like } from "../controller/api"

class HelpScreen extends Component {
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
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
                       this.props.navigation.navigate("")
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
                       this.props.navigation.navigate("")
                    }}
                >
                    <Text>Privacy Policy</Text>
                    {/* <Text note>Account Details ...</Text> */}
                </TouchableOpacity>
            </Body>
          </ListItem>
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

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(HelpScreen)