import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, 
    Toast, Button, Icon, Title, Segment, Footer, FooterTab, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { apiUrl, cloudinaryUrl } from './service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import {getUserProfileAction } from "../redux/userProfileAction"
import {connect} from 'react-redux'
import {BackHandler, View } from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class PartnerProfileScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          partnerId: "",
          modalVisible: false,
          message: '',
          profile: {},
          spin: true
        }
      }

      componentWillUnmount() {
        this.backHandler.remove();
      }
      async componentDidMount() {

        await this.setState({
          partnerId: this.props.navigation.getParam("id", null )
        })

        this.getPartnerProfile()

        // handle hardware back button press
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          this.props.navigation.navigate("Community")
          return true;
        });

      }


      getPartnerProfile = async ()=>{
        var url = apiUrl + "partner/" + this.state.partnerId;
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        this.setState({ spin : false, message: "Error occured", modalVisible: true })
        // console.warn("fetching user failed response")
        return
      }
      else{
        var res = await response.json();
        // console.warn(res)
        if (res.success) {
          await this.setState({
              profile: res.message,
              spin : false,
          })
        //   console.warn(this.state.profile.profileImage)
        }

        else  {
            this.setState({ spin : false, message: "Error occured", modalVisible: true })
            return
        }
      }
      }
    


  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Community")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Member Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="person" />
            </Button>
          </Right>
        </Header>
        <Content padder>
            { this.state.spin ? <Body><Spinner color='red' /></Body> : null }
        <List>
              <ListItem avatar>
                <Left>
                <Thumbnail source={{ uri: this.state.profile.profileImage }} />
                </Left>
                <Body>
                  <Text>{this.state.profile.companyName}</Text>
                  <Text note> {this.state.profile.city}</Text>
                  {/* <Text note>{this.state.profile.country}</Text> */}
                </Body>
                <Right>
                    <Text note>{this.state.profile.tel}</Text>
                    <Text note>{this.state.profile.country}</Text>
                    {/* <Text note>{this.state.profile.address}</Text> */}
                    {/* <Text note>{this.state.profile.email}</Text> */}
                </Right>
              </ListItem>
              <ListItem>
                <Body>
                  <Text note> Address: {this.state.profile.address}</Text>
                  <Text note>Website: {this.state.profile.website}</Text>
                  
                </Body>
              </ListItem>
              <ListItem>
               <Text note>Bio: {this.state.profile.bio}</Text>
              </ListItem>
              <ListItem>
                  <Left>
                    <Text note>
                        Linkedln {this.state.profile.linkedln }
                      </Text>
                  </Left>
                  <Body>
                      <Text note>
                        Twitter { this.state.profile.twitter }
                      </Text>
                  </Body>
                  <Right>
                    <Text note>
                        Facebook {this.state.profile.facebook }
                    </Text>
                  </Right>
              </ListItem>
              <ListItem>
                  <Left>
                    <TouchableOpacity>
                    <Text note>Email: {this.state.profile.email}</Text>  
                    </TouchableOpacity>
                  </Left>
                  <Right>
                          <Text note >
                              Nick Name: {this.state.profile.shortName}
                          </Text>
                  </Right>
              </ListItem>
            </List>

        </Content>
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Community")} >
              <Icon name="people" />
              <Text>Community</Text>
            </Button>
          
          </FooterTab>
        </Footer>

        {/* modalVisisble */}
        <Modal
        visible={this.state.modalVisible}
        modalTitle={<ModalTitle title="Message" />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside= { () => {
          this.setState({ modalVisible: false });
        }}
        width
        footer={
          <ModalFooter>
            <ModalButton
              text="Exit"
              onPress={() => this.setState({ modalVisible: false })}
            />
          </ModalFooter>
        }
      >
        <ModalContent >
          <View style= {{ padding : 12, paddingBottom: 40 }}>
            <Body>
              <Text >{ this.state.message }</Text>
            </Body>
          </View>
        </ModalContent>
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

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(PartnerProfileScreen)