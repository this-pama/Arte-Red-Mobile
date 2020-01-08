import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast, Footer, FooterTab } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {Share } from 'react-native';
import {BackHandler, View } from "react-native"

class ActivityScreen extends Component {

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

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Activities</Title>
          </Body>
        </Header>
        <Content style={{padding: 10 }}>
        <ListItem icon style={{ paddingTop: 20, paddingBottom: 40 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="notifications" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyNegotiation')}>My Negotiations</Text>
            </Body>
      </ListItem>
      <ListItem icon style={{ paddingTop: 20, paddingBottom: 40 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-briefcase" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyAuction')}>My Auction</Text>
            </Body>
      </ListItem>
      <ListItem icon style={{ paddingTop: 20, paddingBottom: 40 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-photos" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyExhibition')}>My Exhibition</Text>
            </Body>
      </ListItem>
      <ListItem icon style={{ paddingTop: 20, paddingBottom: 40 }}>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                  this.props.navigation.navigate('Network')
              }}>My Network</Text>
            </Body>
          </ListItem>

          <ListItem icon style={{ paddingTop: 20, paddingBottom: 40 }}>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="briefcase" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                  this.props.navigation.navigate('Sales')
              }}>My Sales</Text>
            </Body>
          </ListItem>
          
        </Content>
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Wallet")} >
              <Icon name="cash" />
              <Text>Wallet</Text>
            </Button>
          
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(ActivityScreen )