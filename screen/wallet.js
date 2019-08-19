import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from "react-native"
import FooterTabs from './wallet/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { login } from "../redux/loginAction"
import { apiUrl } from './service/env';
import { getUserProfileAction } from "../redux/userProfileAction"
import { getUserIdAction } from "../redux/getUserId"
import { getBankDetailsAction } from "../redux/getBankDetails"
import BankDetail from './wallet/bankDetails';
import History from "./wallet/history"

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
      activeDetails: false,
      activeHistory: true
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
            this.setState({
              wallet: resp.wallet,
              withdrawable: resp.withdrawable,
              withdraws: resp.withdraws,
              totalEarning: resp.totalEarning,
              totalWithdraws: resp.totalWithdraws,
              isFetch: true,
              myDetails: false,
              history: true
            })
          }
          else{
            alert("No wallet found")
          }
        }
        
    }

    this.fetchBankDetails()
  }

  fetchBankDetails=async ()=>{
      const url = apiUrl + "wallet/bank/" + this.props.userId;
       var result = await fetch(url,{
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
       })
       
        if(result.status !== 200){
          alert("Error while checking for registered bank details")
        }
        else {
          var resp = await result.json()
          // console.warn(resp)
          if(resp._id){
            this.props.getBankDetailsAction(resp)
          }
          else{
            alert("No bank found")
          }
        }
 
  }

  myDetails= ()=>{
    this.setState({ myDetails : true, history: false, activeDetails: true, activeHistory: false })
  }

  history= ()=>{
    this.setState({ history : true, myDetails: false, activeDetails: false, activeHistory: true })
  }


  render() {
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
                      <Text style={{color: "#ffffff" }}>NGN {this.state.totalEarning}</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#cc0000", height: 150}}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }}>
                      <Icon name="cash" style={{color: "#ffffff" }} />
                      <Text style={{color: "#ffffff", fontWeight: "bold" }}>Balance</Text>
                      <Text style={{color: "#ffffff" }}>NGN {this.state.wallet}</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#e60000", height: 150 }}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }} >
                      <Icon  name="cash" style={{color: "#ffffff" }}/>
                      <Text style={{color: "#ffffff", fontWeight: "bold" }} >Ledger Balance</Text>
                      <Text style={{color: "#ffffff" }} >NGN {this.state.withdrawable}</Text>
              </Body>
            </Col>
          </Grid>
          <Content style={{color: "#000000", padding: 10 }}>
            {!this.state.isFetch ? (<Body>
                                      <Spinner color="red" />
                                    </Body>) : null }
              
              {this.state.myDetails ? <BankDetail /> : null}

              {this.state.history ? <History withdraws={this.state.withdraws} /> : null}

          </Content>
          <FooterTabs 
              navigation={this.props.navigation}
              myDetail= { this.myDetails}
              history={ this.history}
              activeDetails= { this.state.activeDetails}
              activeHistory= { this.state.activeHistory}
          />
        </Container>
      )
  }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {login,getUserIdAction, getUserProfileAction })(WalletScreen)