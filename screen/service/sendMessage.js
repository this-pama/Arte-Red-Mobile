import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Input, Footer, Content, Item, ListItem, Spinner, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { login } from "../../redux/loginAction"
import { apiUrl } from './env';
import { getUserProfileAction } from "../../redux/userProfileAction"
import { getUserIdAction } from "../../redux/getUserId"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


class ChatScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      isFetch: false,
  
    }
  }

 async componentDidMount(){
    if(!( "walletId" in this.props.profile)){
      this.setState({ isFetch: false })
    }
    else{
      const url = apiUrl + "wallet/" + this.props.profile.walletId;
       var result = await fetch(url,{
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
       })
       
        if(result.status !== 200){
          this.setState({ isFetch: true })
        }
        else {
          var resp = await result.json()
          // console.warn(resp)
          if(resp._id){
            return
          }
          else{
            alert("No wallet found")
          }
        }
        
    }

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
              <Button transparent>
                <Icon name="chatbubbles" />
              </Button>
            </Right>
          </Header>
          {/* <KeyboardAwareScrollView
            extraScrollHeight={100}
            enableOnAndroid={true} 
            keyboardShouldPersistTaps='handled'
          > */}
          <Content style={ {
              flex: 1
            }}>
            <Body >
              <Item rounded>
                <Input style={{ color: "black" }} block placeholder='Send message'/>
                <TouchableOpacity>
                  <Button transparent>
                    <Icon name="send" />
                    <Text>Send</Text>
                  </Button>
                </TouchableOpacity>
              </Item>
            </Body>
            {/* <EmojiInput
              onEmojiSelected={(emoji) => {console.log(emoji)}}
            /> */}
          </Content>
        {/* </KeyboardAwareScrollView> */}
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