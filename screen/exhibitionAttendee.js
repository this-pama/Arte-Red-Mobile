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

class ExhibitionAttendeeScreen extends Component {
    state = {
        modalVisible: false,
        data: [],
        routeName: "Home",
        allComment: [],
        fetch: false,
        artworkId: "",
        userComment: "",
        disable: true,
        count: 0
      };

  async componentDidMount(){
    const data = this.props.navigation.getParam("data", [])
    const routeName = this.props.navigation.getParam("routeName", "Home")
    await this.setState({ data, routeName })
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
    var allComment= await this.state.data.map((comment, index ) => 
      (
              <ListItem key={index}>
              <Body>
                <Text>{comment.name}</Text>
                <Text note>{comment.numberOfTicket} Ticket</Text>
              </Body>
              <Right>
                <Text note>{comment.time}</Text>
                <Text note>{comment.date}</Text>
              </Right>
            </ListItem>
          
      )
    )
    this.setState({ allComment, fetch: true })

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
            <Title>Attendee</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            { this.state.fetch ? this.state.allComment : <Body><Text>No registered Attendee</Text></Body>}
          </List>
        </Content>

        <Footer>
        <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical
              onPress={()=> this.props.navigation.navigate("MyExhibition")} >
              <Icon active name="md-photos"  />
              <Text>My Exhibition</Text>
            </Button>
          
          </FooterTab>
        </Footer>
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
   moreArtworkDetailsAction, getUserProfileAction })(ExhibitionAttendeeScreen)