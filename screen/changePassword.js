import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Header,
Left, Icon, Body, Right, Title, Spinner, Footer, FooterTab,  } from 'native-base';
import {View, TouchableHighlight, BackHandler } from 'react-native'
import PropType from "prop-types"
import {NavigationActions} from 'react-navigation';
import { apiUrl } from './service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'


class ChangePasswordScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            spin: false,
            disable: true,
            password: '',
            confirmPassword: '',
            oldPassword: '',
            errMessage: '',
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
      this.props.navigation.navigate("Setting")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  validateForm2 = () => {
    if (
      this.state.password.length > 0 &&
      this.state.confirmPassword.length > 0 &&
      this.state.oldPassword.length > 0 && 
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


  handleOldPassword = oldPassword => {
    if (oldPassword.length > 0) {
      this.setState(
        {
          oldPassword
        },
        this.validateForm2
      );
    } else {
      this.setState({
        oldPassword: '',
        errMessage: 'Please input old password'
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

  changePassword = async () => {
    this.setState({ spin : true })
      var url = apiUrl + "account/changepassword";
      var result = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            oldpassword: this.state.oldPassword,
            newpassword: this.state.password,
            userId: this.props.userId,
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
            oldPassword: '',
            password: '',
            confirmPassword: '',
            errMessage: "Password Successfully changed",
            spin: false
          })

            this.props.loginAction({})
            this.props.getUserIdAction({})
            this.props.getUserProfileAction({})
            this.props.navigation.navigate("Landing")
        }
        else if(res.message) {
            this.setState({
                errMessage: res.message,
                spin: false
            })
        }
        else  {
          this.setState({
            email: '',
            spin: false,
            errMessage: "Something went wrong!! Please try again after sometimes."
          });
        }
      }
      
  };

  render() {
    const spinner = <Spinner color='white' />
    const signin = <Text> Change Password </Text>
    return (
      <Container >
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }} >
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate('Setting') }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Change Password</Title>
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
          <Form>
            <Item floatingLabel>
              <Label>Old Password</Label>
              <Input secureTextEntry onChangeText= { this.handleOldPassword } value={this.state.oldPassword}  autoCapitalize='none'/>
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
              { this.state.spin ? spinner : signin }
            </Button>
          </View>
        </Content>
          <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Setting")}
           >
              <Icon name="cog" />
              <Text>Setting</Text>
            </Button>
        
            <Button vertical
             onPress={()=> this.props.navigation.navigate("Home")} >
              <Icon active name="home"  />
              <Text>Home</Text>
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
  
  export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
    moreArtworkDetailsAction, getUserProfileAction })(ChangePasswordScreen)
