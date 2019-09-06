import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body,
 Toast, View, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler} from "react-native"

class ExpandExhibitionScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          like: 0,
          comment: 0,
          register: "Register",
          exhibition: {},
          fetch: false
        }
      }

      componentWillUnmount() {
        this.backHandler.remove();
      }
      
      async componentDidMount(){
        const id= this.props.navigation.getParam("id", null )

        var url = apiUrl + "exhibition/" + id;
        var result = await fetch(url, {
          method: 'GET',
          headers: { 
            'content-type': 'application/json',
            "Authorization": `Bearer ${this.props.jwt}`
          }
        });
        var response = await result;
        if(response.status !== 200 ){
          console.warn("fetching exhibition failed response")
          this.setState({
            exhibition: {}
          })
          
          return
        }
        else{
          var res = await response.json();
          if (res._id) {
            this.setState({
              exhibition: res,
              fetch: true
            })
          }

          else  {
            console.warn("Can't get exhibition")
            this.setState({
              exhibition: {}
            })
            
          }
        }

        // handle hardware back button press
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          this.props.navigation.navigate("Landing")
          return true;
        });

      }

      
  render() {

    if(!this.state.fetch){
      return(
        <Container>
        <Header style={{ backgroundColor: "#990000",paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Exhibition") }>
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
        <Content>
          <Body>
            <Spinner color="red" />
          </Body>
        </Content>
        </Container>
      )
    }
      else {
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000",paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Exhibition") }>
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
        <Content>
          <Card style={{flex: 0}}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{this.state.exhibition.title}</Text>
                  <Text note>{this.state.exhibition.country}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                    <Text note >{this.state.exhibition.organizerName}</Text>
                  <Text note>{this.state.exhibition.date}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: this.state.exhibition.imageUrl } } style={{height: 300, width: null, flex: 1}}/>
            </CardItem>
            <CardItem >
                <Text>
                  {this.state.exhibition.longDescription}
                </Text>
            </CardItem>
            <CardItem >
                <Text note >
                  {this.state.exhibition.address}
                </Text>
            </CardItem>
            <View style={{ paddingTop: 30 }} >
                <Button block danger
                  onPress={()=>{
                    if(!this.props.userId){
                        Toast.show({
                          text: "You need to sign in to register",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                    }
                    else{
                      this.props.navigation.navigate("RegisterForExhibition", {
                        id: this.state.exhibition._id
                      })
                    }
                  }} >
                  <Text>{this.state.register}</Text>
                </Button>
            </View>
          </Card>
        </Content>
      </Container>
    );}
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(ExpandExhibitionScreen)