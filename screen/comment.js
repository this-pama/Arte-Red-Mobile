import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Toast, Text, Button, Icon, Title, Footer, 
FooterTab,Textarea } from 'native-base';
import { Modal, BackHandler, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'

class CommentScreen extends Component {
    state = {
        modalVisible: false,
        comment: [],
        routeName: "Home",
        allComment: [],
        fetch: false,
        artworkId: "",
        artworkUserId : '',
        userComment: "",
        disable: true,
        count: 0
      };

  async componentDidMount(){
    const comment = this.props.navigation.getParam("comment", []);
    const routeName = this.props.navigation.getParam("routeName", "Home");
    const artworkId = this.props.navigation.getParam("id", null);
    const artworkUserId = this.props.navigation.getParam("artworkUserId", null);
    await this.setState({ comment, routeName, artworkId, artworkUserId })
    this.mapAllComment()

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate(this.state.routeName)
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  mapAllComment = async ()=>{
    var allComment= await this.state.comment.map(comment => 
      (
          <TouchableOpacity key={this.state.count++}
            onPress={()=>{ 
              if(!this.props.userId){
                return Toast.show({
                  text: "You need to sign in",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
              this.props.navigation.navigate("Profile", {id: comment.userId })
            }}
          >
              <ListItem avatar>
              <Body>
                <Text>{comment.name}</Text>
                <Text note>{comment.comment}</Text>
              </Body>
              <Right>
                <Text note>{comment.time}</Text>
                <Text note>{comment.date}</Text>
              </Right>
            </ListItem>
          </TouchableOpacity>
      )
    )
    this.setState({ allComment, fetch: true })

  }


  writeComment = async () =>{
    var url = apiUrl + "artwork/comment/" + this.state.artworkId;
      var result = await fetch(url, {
        method: 'POST',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt.jwt}`
         },
         body: JSON.stringify({
          name: `${this.props.profile.firstName} ${this.props.profile.lastName}`,
          comment: this.state.userComment,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          userId: this.props.userId
        })
      });

      var response = await result;
      if(response.status !== 200 ){
        console.warn("fetching comment failed")
        this.setModalVisible(!this.state.modalVisible)
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          if( this.props.userId != this.state.artworkUserId){
            this.sendPushNotification(this.state.artworkUserId, "Notification", `${this.props.profile.firstName} ${this.props.profile.lastName} just commented on your artwork`)
          }

          this.props.navigation.navigate(this.state.routeName)
        }

        else  {
          console.warn("Can't save comment")
          this.setModalVisible(!this.state.modalVisible)
        }
      }
  }

  sendPushNotification = async (userId, title, message) =>{
    var url = apiUrl + "user/send-notification/direct-message"
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId,
        title,
        message
      })
    });
    var response = await result;
    if(response.status !== 200 ){
      return
    }
    else{
      return
    }
  }
    
setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
}

validateComment=()=>{
  if(this.state.userComment.length > 0 ){
    this.setState({ disable : false })
  }
}

handleComment= comment =>{
  if( comment.length > 0 ){
    this.setState({ userComment: comment }, this.validateComment)
  }
  else{
    this.setState({ userComment: "" })
  }
}

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(this.state.routeName)}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Comments</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="chatbubbles" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            { this.state.fetch ? this.state.allComment : <Body><Text>No comment</Text></Body>}
          </List>
        </Content>

        <Footer>
          <FooterTab style={{ backgroundColor: "#fff"}}>
          <Button vertical 
            onPress={() => {
              if(!this.props.userId){
                return Toast.show({
                  text: "You need to sign in",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
                this.setModalVisible(true);
            }}
          >
                <Icon name="brush" />
                <Text>Write Comment</Text>
          </Button>
          </FooterTab>
        </Footer>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22, padding: 20 }} >
          <Button bordered danger
                onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                }}
            >
                <Text >Close</Text>
            </Button>
            <View>
                <Textarea rowSpan={5} bordered placeholder="Write your comment about the post "
                onChangeText={this.handleComment} value={this.state.userComment} />
                <View style={{ paddingTop: 30}}>
                        <Button bordered warning
                        disabled={ this.state.disable }
                            onPress={() => {
                              
                              this.writeComment()
                            } }
                        >
                            <Text >Post</Text>
                        </Button>            
                </View>
            </View>
          </View>
        </Modal>


      </Container>
    );
  }
}

const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(CommentScreen)