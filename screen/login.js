import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Header,
Left, Icon, Body, Right, Title  } from 'native-base';
import {View, TouchableHighlight } from 'react-native'
import PropType from "prop-types"
import {NavigationActions} from 'react-navigation';

import HeaderTheme from './service/header'

export default class LoginScreen extends Component {

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
  }

  render() {
    return (
      <Container style={{backgroundColor: "#e6e6e6",}}>
        <Header style={{ backgroundColor: "#990000", paddingTop: 20 }} >
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate('Landing') }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Sign In</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content style={{  padding: 20 }}>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail } value={this.props.email}  autoCapitalize='none'/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input onChangeText= { this.props.handlePassword } value={this.props.password } autoCapitalize='none' />
            </Item>
            
          </Form>
          <View style={{ paddingTop: 40}}>
            <Button  block danger 
              disabled= { this.props.disable }
              onPress={ this.props.login }
            ><Text> Sign In </Text></Button>
            <TouchableHighlight 
                onPress={()=> this.props.navigation.navigate('SignUp') }
                style={{ paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Don't have an account? Register here.</Text>
            </TouchableHighlight>
          </View>         
        </Content>
      </Container>
    );
  }
}

LoginScreen.propTypes ={
  email: PropType.string.isRequired,
  password: PropType.string.isRequired,
  login: PropType.func.isRequired,
  handleEmail: PropType.func.isRequired,
  handlePassword: PropType.func.isRequired,
  disable: PropType.bool.isRequired,
}