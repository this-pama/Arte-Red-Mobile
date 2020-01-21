import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, 
    Title, Left, Body, Right, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {Share, View } from 'react-native';
import {BackHandler} from "react-native"

class AboutScreen extends Component {

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


  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Setting")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>About</Title>
          </Body>
        </Header>
        <Content style={{padding: 10, paddingLeft: 15 }}>
            <View>
                <Text>Version</Text>
                <Text note>1.0.0.1420</Text>
            </View>

            <View style={{ paddingTop: 20 }}>
                <TouchableOpacity>
                <Text>Term of Service</Text>
                </TouchableOpacity>
            </View>

            <View style={{ paddingTop: 20 }}>
                <TouchableOpacity>
                <Text>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            <View style={{ paddingTop: 20 }}>
                <TouchableOpacity>
                <Text>Membership Policy</Text>
                </TouchableOpacity>
            </View>


        </Content>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(AboutScreen)