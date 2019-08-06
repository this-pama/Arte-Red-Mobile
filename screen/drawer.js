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
    return (
          <Container>

          <Card>
            <CardItem>
              <Left>
                < Icon name='md-person' />
                <Body>
                  <Text>Welcome</Text>
                  <Text note>{}</Text>
                </Body>
              </Left>
            </CardItem>
            

          </Card>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="home" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('')}>Home</Text>
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
              <Text onPress={this.navigateToScreen('')}>Wallet</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#DDA0DD" }}>
                <Icon active name="md-people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                }
              }>My Network</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#008080" }}>
                <Icon active name="md-briefcase" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                }
              }>Artworks</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#4682B4" }}>
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
              <Button style={{ backgroundColor: "#DA70D6" }}>
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

    </Container>
      
    );
  }
}

