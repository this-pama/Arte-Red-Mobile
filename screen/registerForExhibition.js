import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Content,Item, Input, Form,  Spinner, Segment } from 'native-base';
import { View, KeyboardAvoidingView } from "react-native"
import FooterTabs from './service/footer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler} from "react-native"

class RegisterExhibitionScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            fullName: "",
            email: "",
            number: "",
            errMessage: "",
            disable: true,
        }
    }

    componentDidMount() {
      // handle hardware back button press
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.navigate("Exhibition")
        return true;
      });

    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    register = async () => {
        
        this.setState({ spin : true })
          var url = apiUrl + "exhibition/register/" + this.props.navigation.getParam("id", null);
          var result = await fetch(url, {
            method: 'POST',
            headers: { 
                'content-type': 'application/json',
                "Authorization": `Bearer ${this.props.jwt}`
             },
            body: JSON.stringify({
                name: this.state.fullName, 
                email: this.state.email,
                numberOfTicket: this.state.number,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
                userId: this.props.userId
            })
          });
          var response = await result;
          
          if(response.status !== 200 ){
              console.warn(response)
            this.setState({
              email: '',
              fullName: "",
              number: "",
              errMessage: "Erro occured while registering for exhibition",
              spin: false
            });
          }
          else{
            var res = await response.json();
            console.warn(res)
            if (res._id) {
              this.props.navigation.navigate("Exhibition")
            } 
            else if (res.message) {
                this.setState({
                    email: '',
                    fullName: "",
                    number: "",
                    errMessage: "Exhibition is sold out",
                    spin: false
                  });
              } 
            else  {
              this.setState({
                email: '',
                fullName: "",
                number: "",
                errMessage: "Erro occured while registering for exhibition",
                spin: false
              });
            }
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
            email : '',
            errMessage: 'Email cannot be empty'
          });
        }
      };

      handleNumber = number => {
        if (number) {
          this.setState(
            {
                number
            },
            this.validateForm
          );
        } else {
          this.setState({
            number: '',
            errMessage: 'Please specify the number of attendee.?'
          });
        }
      };

      handleName = fullName => {
            if (fullName.length > 0){
                this.setState({
                    fullName,
                    errMessage: ""
                })
            }else{
            this.setState({
                fullName: "",
                errMessage : "Full Name can not be empty"
            })
            }
      
        }


      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.fullName.length > 0 && 
          this.state.email.length > 0 &&
          this.state.number  &&
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

  render() {
    const add = <Text> Register </Text>
    const spinner = <Spinner color="white" />
    return (
        <Container>
            <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
            <Left>
                <Button transparent onPress={()=> this.props.navigation.navigate("Exhibition")}>
                <Icon name="arrow-back" />
                </Button>
            </Left>
            <Body>
                <Title>Exhibition</Title>
            </Body>
            <Right>
                <Button transparent>
                <Icon name="eye" />
                </Button>
            </Right>
            </Header>
            <Segment style={{  backgroundColor: "#cc0000"}}>
            <Button first active onPress={()=> this.props.navigation.navigate("")}>
                <Text>Recent Exhibition</Text>
            </Button>
            <Button  onPress={()=> {
                if(!this.props.userId){
                return  Toast.show({
                    text: "You need to sign in",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                })
            }
                this.props.navigation.navigate("CreateExhibition")
            }}>
                <Text>Create Exhibition</Text>
            </Button>
            </Segment>
            <KeyboardAwareScrollView
                extraScrollHeight={100}
                enableOnAndroid={true} 
                keyboardShouldPersistTaps='handled'
            >
            <Content padder>
            <Body>
                <Text note style={{ color: "red"}}>{this.state.errMessage}</Text>
            </Body>
            <Form>
                <Item stackedLabel>
                    <Label>Full Name</Label>
                    <Input onChangeText= {this.handleName  } value={this.state.fullName}  autoCapitalize='words'/>
                </Item>
                <Item stackedLabel>
                    <Label>Email</Label>
                    <Input onChangeText= { this.handleEmail } value={this.state.email}  autoCapitalize='words'/>
                </Item>
                <Item stackedLabel>
                    <Label>Number of Attendee</Label>
                    <Input onChangeText= { this.handleNumber } value={this.state.number}  keyboardType='numeric' />
                </Item>
            </Form>

            <View style={{ padding : 10}}>
              <Button  block danger 
                  disabled={this.state.disable}
                  onPress={this.register }
              >
                  {this.state.spin ? spinner : add }
              </Button>
            </View>
        </Content>
        </KeyboardAwareScrollView> 
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />  
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
     moreArtworkDetailsAction, getUserProfileAction })(RegisterExhibitionScreen)