import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Header,
Left, Icon, Body, Right, Title, Spinner, Footer, FooterTab  } from 'native-base';
import {View, TouchableHighlight, BackHandler } from 'react-native'
import PropType from "prop-types"
import {NavigationActions} from 'react-navigation';
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';
import HeaderTheme from './service/header'

export default class LoginScreen extends Component {

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
    const signin = <Text> Sign In </Text>
    return (
      <Container >
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }} >
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
        <Content style={{  padding: 10 }}>
        <Body>
          <Text note style={{ color: "red"}}>{this.props.errMessage} </Text>
        </Body>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input autoCompleteType='email' onChangeText= { this.props.handleEmail } value={this.props.email}  autoCapitalize='none'/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input onChangeText= { this.props.handlePassword } value={this.props.password } autoCapitalize='none'
              autoCompleteType='password' secureTextEntry={true}/>
            </Item>
          </Form>
          <Item >
            <Right>
              <Button transparent
                onPress={()=> this.props.navigation.navigate('ForgetPassword')}
              >
                <Text> Forget Password</Text>
              </Button>
            </Right>
          </Item>
          <View style={{ paddingTop: 40}}>
            <Button  block danger 
              disabled= { this.props.disable }
              onPress={ this.props.login }
            >
              { this.props.spin ? spinner : signin }
            </Button>
            {/* <TouchableHighlight 
                onPress={()=> this.props.navigation.navigate('SignUp') }
                style={{ paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Don't have an account? Register here.</Text>
            </TouchableHighlight> */}
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
              onPress={()=> this.props.navigation.navigate("SignUp")} >
              <Icon active name="log-in"  />
              <Text>Register</Text>
            </Button>
          
          </FooterTab>
        </Footer>

        <Modal
                visible={this.props.modalVisible}
                modalTitle={<ModalTitle title="Message" />}
                modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
                })}
                onTouchOutside={ this.props.closeModal }
                width
                footer={
                  <ModalFooter>
                    <ModalButton
                      text="Exit"
                      onPress={ this.props.closeModal }
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View style={{ padding: 20, paddingBottom: 40 }}>
                    <Body>
                      <Text>{ this.props.message }</Text>
                    </Body>
                  </View>
                </ModalContent>
              </Modal>

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
  spin: PropType.bool.isRequired,
  modalVisible: PropType.bool.isRequired,
  closeModal: PropType.func.isRequired,
  message: PropType.string.isRequired,
}