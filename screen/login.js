import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import {View, TouchableHighlight } from 'react-native'
import PropType from "prop-types"
import { DrawerActions } from 'react-navigation';

import HeaderTheme from './service/header'

export default class LoginScreen extends Component {
  render() {
    return (
      <Container style={{backgroundColor: "#e6e6e6",}}>
        {/* <HeaderTheme 
            title="Sign In"
            drawer= {()=> this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }
        /> */}
        <Content style={{  padding: 20 }}>
          <Form>
            <Item floatingLabel>
              <Label>Email/Username</Label>
              <Input onChangeText= {()=>this.props.handleEmail } value={this.props.email}  autoCapitalize='none'/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input onChangeText= {()=> this.props.handlePassword} value={this.props.password }/>
            </Item>
            
          </Form>
          <View style={{ paddingTop: 40}}>
            <Button  block danger 
              disabled= { this.props.disable }
              onPress={()=> this.props.login }
            ><Text> Sign In </Text></Button>
            <TouchableHighlight 
                onPress={()=> this.props.navigation.navigate("SignUp")}
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
  disable: PropType.bool.isRequired
}