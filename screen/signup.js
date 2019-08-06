import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import {View, TouchableHighlight } from 'react-native'
import {KeyboardAvoidingView} from 'react-native';
import { DrawerActions } from 'react-navigation';

import HeaderTheme from './service/header'

export default class SignUpScreen extends Component {
  render() {
    return (
      <Container style={{backgroundColor: "#e6e6e6",}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Content>
            <Form>
                <Item stackedLabel>
                    <Label>First Name</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Last Name</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Nick Name</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Bio</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Email</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Address</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Country</Label>
                    <Input />
                </Item>
                <Item stackedLabel>
                    <Label>Telephone</Label>
                    <Input />
                </Item>
                <Item stackedLabel last>
                    <Label>User Type</Label>
                    <Input />
                </Item>
            </Form>
            
          <View style={{ paddingTop: 20}}>
            <Button  block danger ><Text> Sign Up </Text></Button>
            <TouchableHighlight 
                onPress={()=> this.props.navigation.navigate("Login")}
                style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Already have an account. Sign In!</Text>
            </TouchableHighlight>
          </View>         
        </Content>
        </KeyboardAvoidingView>
      </Container>
      
    );
  }
}

const styles = {
    container: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 10,
        paddingLeft: 10
    }
}