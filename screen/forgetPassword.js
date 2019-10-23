import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Header,
Left, Icon, Body, Right, Title, Spinner, Footer, FooterTab,  } from 'native-base';
import {View, TouchableHighlight, BackHandler } from 'react-native'
import PropType from "prop-types"
import {NavigationActions} from 'react-navigation';
import { apiUrl } from './service/env'

export default class ForgetPasswordScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            spin: false,
            email: '',
            disable: true,
            errMessage: '',
            showEmail: true,
            showNewPassword: false,
            token: '',
            password: '',
            confirmPassword: '',
        }
      }
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

  validateForm = () => {
    let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      this.state.email.length > 0 &&
      testEmail.test(this.state.email) 
    ) {
      this.setState({
        disable: false,
        errMessage: ''
      });
    } else {
      this.setState({
        disable: true
      });
    }
  };

  validateForm2 = () => {
    if (
      this.state.password.length > 0 &&
      this.state.confirmPassword.length > 0 &&
      this.state.token.length > 0 && 
      this.state.password === this.state.confirmPassword
    ) {
      this.setState({
        disable: false,
        errMessage: ''
      });
    } else {
      this.setState({
        disable: true
      });
    }
  };

  handleEmail = email => {
    if (email.length > 0) {
      this.setState(
        {
          email
        },
        this.validateForm
      );
    } else {
      this.setState({
        email: '',
        errMessage: 'Email cannot be empty'
      });
    }
  };

  handlePassword = password => {
    if (password.length > 0) {
      this.setState(
        {
          password
        },
        this.validateForm2
      );
    } else {
      this.setState({
        password: '',
        errMessage: 'Password cannot be empty'
      });
    }
  };

  handleConfirmPassword = confirmPassword => {
    if (this.state.password === confirmPassword ) {
      this.setState(
        {
          confirmPassword
        },
        this.validateForm2
      );
    } else {
      this.setState({
        confirmPassword,
        errMessage: 'Confrim Password'
      });
    }
  };

  handleToken = token => {
    if (token.length > 0) {
      this.setState(
        {
          token
        },
        this.validateForm2
      );
    } else {
      this.setState({
        token: '',
        errMessage: 'Please input the token sent to your email'
      });
    }
  };

  requestToken = async () => {
    this.setState({ spin : true })
      var url = apiUrl + "account/forgot";
      var result = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          
        })
      });
      var response = await result;
      
      if(response.status !== 200 ){
        this.setState({
          email: '',
          spin: false,
          errMessage: "Network Error"
        });
      }
      else{
        var res = await response.json();
        if (res.success) {
          this.setState({
            email: '',
            spin: false,
            showEmail: false,
            showNewPassword: true,
            disable: true,
          });
        } 
        else  {
          this.setState({
            email: '',
            spin: false,
            errMessage: "Email account is not registered"
          });
        }
      }
      
  };


  changePassword = async () => {
    this.setState({ spin : true })
      var url = apiUrl + "account/reset/" + this.state.token;
      var result = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            password: this.state.password,
          
        })
      });
      var response = await result;
      
      if(response.status !== 200 ){
        this.setState({
          email: '',
          spin: false,
          errMessage: "Network Error"
        });
      }
      else{
        var res = await response.json();
        if (res.success) {
          this.setState({
            token: '',
            password: '',
            confirmPassword: '',
            errMessage: "Password Successfully changed",
            spin: false
          });
        } 
        else  {
          this.setState({
            email: '',
            spin: false,
            errMessage: "Password reset token is invalid or has expired."
          });
        }
      }
      
  };

  render() {
    const spinner = <Spinner color='white' />
    const signin = <Text> Reset Password </Text>
    const newPass = <Text> Change Password </Text>

    const newPassword = (
        <View>
            <Form>
                <Item floatingLabel>
                    <Text note>This has been sent to your email</Text>
                    <Label>Reset Token</Label>
                    {/* <Text note>This has been sent to your email</Text> */}
                    <Input onChangeText= { this.handleToken } value={this.state.token}  autoCapitalize='none'/>
                </Item>
                <Item floatingLabel>
                    <Label>New Password</Label>
                    <Input secureTextEntry onChangeText= { this.handlePassword } value={this.state.password}  autoCapitalize='none'/>
                </Item>
                <Item floatingLabel>
                    <Label>Confirm Password</Label>
                    <Input secureTextEntry onChangeText= { this.handleConfirmPassword } value={this.state.confirmPassword}  autoCapitalize='none'/>
                </Item>
            </Form>
            
            <View style={{ paddingTop: 40}}>
                <Button  block danger 
                disabled= { this.state.disable }
                onPress={ this.changePassword }
                >
                { this.state.spin ? spinner : newPass }
                </Button>
            </View>
        </View>
    )

    return (
      <Container >
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }} >
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate('Landing') }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Reset Password</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="log-in" />
            </Button>
          </Right>
        </Header>
        <Content style={{  padding: 10 }}>
        <Body>
          <Text note style={{ color: "red"}}>{this.state.errMessage} </Text>
        </Body>
        { this.state.showEmail ? (
            <View>
                <Form>
                    <Item floatingLabel>
                    <Label>Email</Label>
                    <Input onChangeText= { this.handleEmail } value={this.state.email}  autoCapitalize='none'/>
                    </Item>
                </Form>
                
                <View style={{ paddingTop: 40}}>
                    <Button  block danger 
                    disabled= { this.state.disable }
                    onPress={ this.requestToken }
                    >
                    { this.state.spin ? spinner : signin }
                    </Button>
                </View>
            </View>
        ) : null }

          { this.state.showNewPassword ? newPassword : null }
        </Content>
          <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Login")}
            active= { !this.props.activeMe ? false : true }>
              <Icon name="log-out" />
              <Text>Sign In</Text>
            </Button>
        
            <Button vertical
              active= { !this.props.activeExhibition ? false : true }
             onPress={()=> this.props.navigation.navigate("SignUp")} >
              <Icon active name="log-in"  />
              <Text>Register</Text>
            </Button>
          
          </FooterTab>
        </Footer>
    </Container>
    );
  }
}

