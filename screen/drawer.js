import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
// import PropTypes from 'prop-types';
import {ScrollView,  View} from 'react-native';

import { Image, Container, Header, Text,Content, List, ListItem, Icon, Left, Body, Right, 
  Switch, Button, Card, CardItem, Toast, } from 'native-base';

import { DrawerActions } from 'react-navigation';


export default class DrawerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      message: '',
    };

  }



  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer())
  }


  render () {
    const logout = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="log-out" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('Landing')}>Logout</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
       </ListItem>
    )


    const login = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="log-in" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('Login')}>Login</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )
    return (
          <Container>

          <Card>
            <CardItem>
              <Left>
                < Icon name='md-person' />
                <Body>
                  <Text>Welcome</Text>
                  <Text note>Artist Name</Text>
                </Body>
              </Left>
            </CardItem>
            

          </Card>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="apps" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('Home')}>Home</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-wallet" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> {
                if(!this.props.userId){
                  Toast.show({
                    text: "You need to sign in to access your Wallet",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
                else{
                  this.navigateToScreen('Wallet', {
                    userId: "123456"
                  })
                }
              }}>Wallet</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                if(!this.props.userId){
                  Toast.show({
                    text: "You need to sign in to see your Network",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
                else{
                  this.navigateToScreen('Network')
                }
              }}>My Network</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          {/* <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-briefcase" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>this.props.navigation.navigate("Network")}>Artworks</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem> */}
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-contract" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('')}>About</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-cog" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('')}>Setting</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          { !this.props.userId ? login: logout }
          
    </Container>
      
    );
  }
}

