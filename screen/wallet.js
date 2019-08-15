import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { login } from "../redux/loginAction"
import { apiUrl } from './service/env';
import { getUserProfileAction } from "../redux/userProfileAction"

class WalletScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      isFetch: false,
      wallet: 0,
      wallet: 0,
      withdrawable: 0,
      withdraws: [],
      totalEarning: 0,
      totalWithdraws: 0,
    }
  }

  componentDidMount(){
    if(!this.props.profile.walletId){
      this.setState({ isFetch: false })
    }
    else{
      const url = apiUrl + "wallet/" + this.props.profile.walletId;
       fetch(url,{
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
       })
      .then(resp => resp.json())
      .then(result => {
        this.setState({
          wallet: result.wallet,
          withdrawable: result.withdrawable,
          withdraws: result.withdraws,
          totalEarning: result.totalEarning,
          totalWithdraws: result.totalWithdraws,
          isFetch: true
        })
      })
      .catch(err=> this.props.navigation.goBack())
        alert("Error occured while checking for wallet")
    }
  }

  render() {
    if(!this.state.isFetch){
      setTimeout(()=> this.setState({ isFetch: true }), 10000 )
      return(
        <Container>
        <Header  style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>My Wallet</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="wallet" />
            </Button>
          </Right>
        </Header>
        <Grid>
          <Col style={{ backgroundColor: "#e60000", height: 150}}>
            <Body style={{ color: "#ffffff", justifyContent: "center", alignItems: "center",  alignContent: "center" }}>
                    <Icon name="cash" style={{color: "#ffffff" }} />
                    <Text style={{color: "#ffffff", fontWeight: "bold" }}>Total Earning</Text>
                    <Text style={{color: "#ffffff" }}>NGN 0</Text>
            </Body>
          </Col>
          <Col style={{ backgroundColor: "#cc0000", height: 150}}>
            <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }}>
                    <Icon name="cash" style={{color: "#ffffff" }} />
                    <Text style={{color: "#ffffff", fontWeight: "bold" }}>Balance</Text>
                    <Text style={{color: "#ffffff" }}>NGN 0</Text>
            </Body>
          </Col>
          <Col style={{ backgroundColor: "#e60000", height: 150 }}>
            <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }} >
                    <Icon  name="cash" style={{color: "#ffffff" }}/>
                    <Text style={{color: "#ffffff", fontWeight: "bold" }} > Ledger Balance</Text>
                    <Text style={{color: "#ffffff" }} >NGN 0</Text>
            </Body>
          </Col>
        </Grid>
        <Content style={{color: "#000000", padding: 10 }}>
          <Body>
            <Spinner color="red" />
          </Body>
        </Content>
        </Container>
      )
    }
    else{
      return (
        <Container>
          <Header  style={{ backgroundColor: "#990000"}}>
            <Left>
              <Button transparent onPress={()=> this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>My Wallet</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="wallet" />
              </Button>
            </Right>
          </Header>
          <Grid>
            <Col style={{ backgroundColor: "#e60000", height: 150}}>
              <Body style={{ color: "#ffffff", justifyContent: "center", alignItems: "center",  alignContent: "center" }}>
                      <Icon name="cash" style={{color: "#ffffff" }} />
                      <Text style={{color: "#ffffff", fontWeight: "bold" }}>Total Earning</Text>
                      <Text style={{color: "#ffffff" }}>NGN 0</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#cc0000", height: 150}}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }}>
                      <Icon name="cash" style={{color: "#ffffff" }} />
                      <Text style={{color: "#ffffff", fontWeight: "bold" }}>Balance</Text>
                      <Text style={{color: "#ffffff" }}>NGN 0</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#e60000", height: 150 }}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }} >
                      <Icon  name="cash" style={{color: "#ffffff" }}/>
                      <Text style={{color: "#ffffff", fontWeight: "bold" }} > Ledger Balance</Text>
                      <Text style={{color: "#ffffff" }} >NGN 0</Text>
              </Body>
            </Col>
          </Grid>
          <Content style={{color: "#000000", padding: 10 }}>
              <List >
                  <ListItem >
                      <Left style={{ paddingLeft: 20}}>
                          <TouchableOpacity
                              onPress={()=>{
                                  this.props.navigation.navigate("Bank")
                              }}
                          >
                              <Icon name="add" />
                              <Text>Add my Bank Detail</Text>
                          </TouchableOpacity>
                      </Left>
                      <Right style={{ paddingRight: 20}}>
                          <TouchableOpacity
                              onPress={()=>{
                                  this.props.navigation.navigate("Withdraw")
                              }}
                          >
                              <Icon name="open" />
                              <Text>Withdraw</Text>
                          </TouchableOpacity>
                      </Right>
                  </ListItem>
              </List>
          </Content>
          <FooterTabs 
              navigation={this.props.navigation}
          />
        </Container>
      )
    }
  }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.login.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {login, getUserProfileAction })(WalletScreen)