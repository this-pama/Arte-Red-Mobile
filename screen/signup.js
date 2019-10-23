import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Header,
Left, Icon, Body, Right, Title, Spinner, Footer, FooterTab  } from 'native-base';
import {View, TouchableHighlight, TouchableOpacity } from 'react-native'
import PropType from "prop-types"
import {NavigationActions} from 'react-navigation';
import {BackHandler} from "react-native"
import HeaderTheme from './service/header'

export default class SignUpScreen extends Component {

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
  }

  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Landing")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  render() {
    const spinner = <Spinner color='white' />
    const signup = <Text> Register </Text>
    return (
      <Container >
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }} >
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate('Landing') }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Register</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content style={{  padding: 20 }}>
          <Body>
          <Text note style={{ color: "red"}}>{this.props.errMessage}</Text>
          </Body>

          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail } value={this.props.email}  autoCapitalize='none'/>
            </Item>
            <Item floatingLabel>
              <Label>Phone Number</Label>
              <Input onChangeText= { this.props.handlePhone } value={this.props.phone}  keyboardType= "numbers-and-punctuation" />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input onChangeText= { this.props.handlePassword } value={this.props.password}  autoCapitalize='none'/>
            </Item>
            <Item floatingLabel last>
              <Label>Confirm Password</Label>
              <Input onChangeText= { this.props.handleConfirm } value={this.props.confirm } autoCapitalize='none' />
            </Item>
            
          </Form>
          <View style={{ paddingTop: 40}}>
            <Button  block danger 
              disabled= { this.props.disable }
              onPress={ this.props.signUp }
            >
              { this.props.spin ? spinner : signup }
            </Button>
            {/* <TouchableOpacity
                onPress={()=> this.props.navigation.navigate('Login') }
                style={{ paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Already Registered. Sign In!</Text>
            </TouchableOpacity> */}
          </View>         
        </Content>
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Landing")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical
              onPress={()=> this.props.navigation.navigate("Login")} >
              <Icon active name="log-in"  />
              <Text>Sign in</Text>
            </Button>
          
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

SignUpScreen.propTypes ={
  email: PropType.string.isRequired,
  password: PropType.string.isRequired,
  phone: PropType.string.isRequired,
  confirm: PropType.string.isRequired,
  signUp: PropType.func.isRequired,
  handleEmail: PropType.func.isRequired,
  handlePhone: PropType.func.isRequired,
  handlePassword: PropType.func.isRequired,
  handleConfirm: PropType.func.isRequired,
  disable: PropType.bool.isRequired,
  spin: PropType.bool.isRequired
}