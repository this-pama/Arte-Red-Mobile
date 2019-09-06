import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Input, Footer, Content, Item, ListItem, Spinner, FooterTab, Drawer,
Badge, 
Toast} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { login } from "../../redux/loginAction"
import { apiUrl } from './env';
import { getUserProfileAction } from "../../redux/userProfileAction"
import { getUserIdAction } from "../../redux/getUserId"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Sidebar from "../chatService/drawer"
import io from 'socket.io-client';
import {BackHandler} from "react-native"


class ChatScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      isFetch: false,
      text: "",
  
    }
  }

  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Home")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open()
  };

  handleText= text =>{
    if(text.length > 0){
      this.setState({ text })
    }
    else{
      this.setState({ text: ""})
    }
  }

  send= async () =>{
    var result = await fetch('http://localhost:3000/v1/chat/5d628a6d0cb3f55d6830754e',{
      method: 'PUT',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt}`
       },
      body: JSON.stringify({
        date: new Date().toLocaleDateString,
        time: new Date().toLocaleTimeString,
        message: this.state.text,
        senderName:` ${this.props.profile.firstName} ${this.props.profile.lastName}`,
        senderId: this.props.userId
      })
    })

    var response = await result;
        
    if(response.status !== 200 ){
      console.warn("response failure")
      Toast.show({
        duration: 2000,
        buttonText: "Okay",
        position: "top",
        type: "danger",
        text: "Error while sending message"
      })
    }
    else{
      this.setState({text: ""})
      var res = await response.json();
      if (res._id) {
        console.warn(res)
      } 
      else  {
        console.warn("error")
        Toast.show({
          duration: 2000,
          type: DangerZone,
          text: "Error while sending message",
          buttonText: "Okay",
          position: "top"
        })
      }
    }

  }

 async componentDidMount(){
  const socket = io.connect('http://192.168.99.1:3000/v1/chat');

  socket.on("connection", ()=>{
    console.warn("connected to socket server")
  })

  socket.on("message", data=>{
    console.warn("message",data)
  } )
}



  render() {
      return (
        <Container>
          <Header  style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50}}>
            <Left>
              <Button transparent onPress={()=> this.props.navigation.navigate(this.props.navigation.getParam("routeName", "Home"),{
                id: this.props.navigation.getParam("id", null)
              })}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Chat</Title>
              <Text note>Bode Ade </Text>
            </Body>
            <Right>
              <Button transparent 
                onPress={()=> this.openDrawer() }
              >
                <Icon name="more" />
                <Badge ><Text>3</Text></Badge>
              </Button>
            </Right>
          </Header>
          <Drawer
            ref={(ref) => { this.drawer = ref; }}
            content={<Sidebar/>}
            onClose={() => this.closeDrawer()} 
          >
          <Content style={ {
              flex: 1
            }}>
            <Body >
              <Item rounded>
                <Input style={{ color: "black" }} block placeholder='Send message'
                  onChangeText={this.handleText} value={this.state.text}
                />
                <TouchableOpacity>
                <Icon name="brush" />
                  
                </TouchableOpacity>
                <TouchableOpacity>
                  <Button transparent 
                      onPress={ this.send}
                    > 
                      <Text>Send</Text>
                  </Button>
                </ TouchableOpacity>
              </Item>
            </Body>
            <Text>
              {/* { this.listenToEvent() } */}
            </Text>
          </Content>
          </Drawer>
        </Container>
      )
  }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {login,getUserIdAction, getUserProfileAction })(ChatScreen)