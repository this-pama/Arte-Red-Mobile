import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {Container,Text,ListItem, Icon, Left, Body, Right, Button, Card, CardItem, Toast, } from 'native-base';
import { DrawerActions } from 'react-navigation';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      message: '',
    };
  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer())
  }

  render () {
    const logout = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="log-out" />
              </Button>
            </Left>
            <Body>
              <Text onPress={async ()=>{
                await this.props.loginAction({})
                await  this.props.getUserIdAction({})
                await this.props.getUserProfileAction({})
                this.props.navigation.navigate("Landing")
              }}>Logout</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )


    const login = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="log-in" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('Login')}>Login</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )

    const wallet = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-wallet" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> {
                if(this.props.userId  && this.props.userId.length > 0 ){
                  this.props.navigation.navigate('Wallet')
                }
                else{
                  Toast.show({
                    text: "You need to sign in to access your Wallet",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
              }}>Wallet</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
    )

    const myNegotiations = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="notifications" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyNegotiation')}>My Negotiations</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )

    const myAuctions = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-briefcase" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyAuction')}>My Auction</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )

    const myExhibition = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-photos" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('MyExhibition')}>My Exhibition</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )
    const community = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('Community')}>Community</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    )


    const partner = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('Partner')}>Member</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
      </ListItem>
    ) 

    const network = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="md-people" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                if(process.env.NODE_ENV === 'development'){
                  this.props.navigation.navigate('Network')
                }
                else if(this.props.userId  && this.props.userId.length > 0 ){
                  this.props.navigation.navigate('Network')
                }
                else{
                  Toast.show({
                    text: "You need to sign in to access your Network",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
              }}>My Network</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
    )

    const activities = (
      <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="pulse" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=>{
                if(process.env.NODE_ENV === 'development'){
                  this.props.navigation.navigate('Activities')
                }
                else if(this.props.userId  && this.props.userId.length > 0 ){
                  this.props.navigation.navigate('Activities')
                }
                else{
                  Toast.show({
                    text: "You need to sign in to access your Activities",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
              }}>Activities</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
    )


    return (
          <Container>

          <Card>
            <CardItem>
              <Left>
                < Icon name='md-person' />
                <Body>
                  <Text>Welcome</Text>
                  <Text note>{ this.props.profile.firstName && this.props.profile.firstName.length > 0
                  ? `${this.props.profile.firstName.charAt(0).toUpperCase() + this.props.profile.firstName.slice(1)} ${this.props.profile.lastName.charAt(0).toUpperCase() + this.props.profile.lastName.slice(1)}` : null }</Text>
                </Body>
              </Left>
            </CardItem>
            

          </Card>

          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#990000" }}>
                <Icon active name="apps" />
              </Button>
            </Left>
            <Body>
              <Text onPress={this.navigateToScreen('Home')}>Home</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          { this.props.userId  && this.props.userId.length > 0 ? wallet : null }
          { this.props.userId  && this.props.userId.length > 0 ? activities : null }
          {/* { this.props.userId  && this.props.userId.length > 0 ? myNegotiations : null }
          { this.props.userId  && this.props.userId.length > 0 ? myAuctions : null }
          { this.props.userId  && this.props.userId.length > 0 ? myExhibition : null } */}
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="md-cog" />
              </Button>
            </Left>
            <Body>
              <Text onPress={()=> this.props.navigation.navigate('Setting')}>Setting</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          {community}
          { this.props.profile.isPartner  && this.props.profile.partnerId.length > 0 ? partner : null }
          { this.props.userId  && this.props.userId.length > 0 ? logout: login }
          
    </Container>    
    );
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(DrawerScreen)