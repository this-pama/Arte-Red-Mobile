import React, { Component } from 'react';
import { Image, Modal, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, 
  Toast, Textarea, Spinner } from 'native-base';
import FooterScreen from './service/footer'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {connect} from 'react-redux'

class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      like: 0,
      comment: 0,
      image: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png",
    }
  }
  
  componentDidMount(){
    this.fetchUserProfile()

    if(this.props.image){
      this.setState({ image : this.props.image })
    }
    
  }


  fetchUserProfile= async () =>{
    if(!this.props.userId || this.props.userId.length <= 0  || !this.props.jwt[0].jwt 
      || this.props.jwt[0].jwt.length <=0 ){
      return
    }

    var url = apiUrl + "user/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt[0].jwt}`
       }
    });
    var response = await result;
    
    if(response.status !== 200 ){
      console.warn("fetching user failed response")
      return
    }
    else{
      var res = await response.json();
      if (res._id) {
        // set state in redux store
        this.props.getUserProfileAction(res)

      } 
      else  {
        console.warn("fetching user profile failed")
        return
      }
    }
  }
  
  render() {
    return (
      <Container>
        <Content >
          <Card>
            <CardItem>
              <Left>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate("Profile")}
                >
                 <Thumbnail source={{ uri : this.state.image }} />
                </TouchableOpacity>
                <Body>
                  <Text>Artwork Title</Text>
                  <TouchableOpacity  onPress={()=> this.props.navigation.navigate("Profile")} >
                    <Text note style={{ color : "blue"}}>User Full Name</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Button transparent onPress={() => this.props.navigation.navigate("Detail") }>
                    <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                     <Text>More</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: "https://res.cloudinary.com/artered/image/upload/v1565393034/ykxz7pqmbr8qtxinfoea.jpg"} } style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={()=>{
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to like this artwork",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.like++
                      })
                  }
                }}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.state.like  } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> {
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to comment",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.comment++
                      })
                  }
                }
              }>
                  <Icon active name="chatbubbles" />
                  <Text>{ this.state.comment } Comments</Text>
                </Button>
                
              </Body>
              <Right>
                <Button transparent onPress= {()=> this.props.navigation.navigate("Buy")}>
                    <Icon active name="pricetag" />
                    <Text>NGN {this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 }</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Left>
                <TouchableOpacity
                  onPress={()=> this.props.navigation.navigate("Profile")}
                >
                 <Thumbnail source={{ uri : this.state.image }}  />
                </TouchableOpacity>
                <Body>
                  <Text>Artwork Title</Text>
                  <TouchableOpacity  onPress={()=> this.props.navigation.navigate("Profile")} >
                    <Text note style={{ color : "blue"}}>User Full Name</Text>
                  </TouchableOpacity>
                </Body>
              </Left>
              <Right>
                <Button transparent onPress={() => this.props.navigation.navigate("Detail") }>
                    <Icon active name="open" style={{ paddingRight: 25, fontSize: 20}} />
                    <Text>More</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={ require('../assets/splash.png') } style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent onPress={()=>{
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to like this artwork",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.like++
                      })
                  }
                }}>
                  <Icon active name="thumbs-up" />
                  <Text>{this.state.like  } Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent onPress={()=> {
                  if(!this.props.userId){
                      Toast.show({
                        text: "You need to sign in to comment",
                        buttonText: "Okay",
                        duration: 3000,
                        type: 'danger'
                      })
                  }
                  else{
                      this.setState({
                        like: this.state.comment++
                      })
                  }
                }
              }>
                  <Icon active name="chatbubbles" />
                  <Text>{ this.state.comment } Comments</Text>
                </Button>
                
              </Body>
              <Right>
                <Button transparent onPress= {()=> this.props.navigation.navigate("Buy")}>
                    <Icon active name="pricetag" />
                    <Text>NGN {this.props.comment != null || this.props.comment != undefined  ? this.props.comment : 0 }</Text>
                </Button>

                {/* <Text>{this.props.time != null || this.props.time != undefined  ? this.props.time : 0 }h ago</Text> */}
              </Right>
            </CardItem>
          </Card>
        </Content>
        <FooterScreen 
            navigation={this.props.navigation}
            activeMe = { true } 
            // post= {this._pickImage}
        />

      </Container>
    );
  }
}



const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(HomeScreen)