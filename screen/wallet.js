import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, FooterTab, Content, List, ListItem, Spinner } from 'native-base';
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
import {BackHandler} from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

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
      activeHistory: true,
      message: '',
      data: {},
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

 async componentDidMount(){

    this.fetchBankDetails()

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack()
      return true
    });

  }

  fetchBankDetails=async ()=>{
      const url = apiUrl + "wallet/mywallet/" + this.props.userId;
       var result = await fetch(url,{
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
       })
       
        if(result.status !== 200){
          this.setState({
            message: 'Error while checking wallet details',
            isFetch: true
          })
        }
        else {
          var resp = await result.json()
          // console.warn(resp)
          if(resp.success){
            this.setState({
              data: resp.message,
              isFetch: true
            })
          }
          else{
            this.setState({
              message: 'Error occurred',
              isFetch: true
            })
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

    const transaction =  this.state.data.transaction ? (
      this.state.data.transaction.reverse().map((elem, index) =>(
        <ListItem key={index} noIndent style={{ backgroundColor: !elem.debit ? "#ffffff"  : '#f2f2f2' }}>
        <Left>
          <Text>{elem.currency} {elem.amount}</Text>
          {/* <Text note>{new Date(elem.date).toLocaleDateString()}  {new Date(elem.date).toLocaleTimeString()}</Text> */}
        </Left>
        {/* <Body></Body> */}
        <Right>
          {/* <Text> { elem.success ? "Successful" : "Failed" }</Text> */}
          <Text note>{new Date(elem.date).toLocaleDateString()}  {new Date(elem.date).toLocaleTimeString()}</Text>
        </Right>
      </ListItem>
      ))
    ) : null 


      return (
        <Container>
          <Header  style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
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
          <Content style={{color: "#000000"}}>
          <Grid>
            <Col style={{ backgroundColor: "#e60000", height: 150}}>
              <Body style={{ color: "#ffffff", justifyContent: "center", alignItems: "center",  alignContent: "center" }}>
                      <Icon name="cash" style={{color: "#ffffff" }} />
                      <Text style={{color: "#ffffff", fontWeight: "bold" }}>Total Earning</Text>
                      <Text style={{color: "#ffffff" }}>{this.state.data.currency} {this.state.data.totalEarning}</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#cc0000", height: 150}}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }}>
                      <Icon name="cash" style={{color: "#ffffff" }} />
                      <Text style={{color: "#ffffff", fontWeight: "bold" }}>Balance</Text>
                      <Text style={{color: "#ffffff" }}>{this.state.data.currency} {this.state.data.withdrawable}</Text>
              </Body>
            </Col>
            <Col style={{ backgroundColor: "#e60000", height: 150 }}>
              <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }} >
                      <Icon  name="cash" style={{color: "#ffffff" }}/>
                      <Text style={{color: "#ffffff", fontWeight: "bold" }} >Ledger Balance</Text>
                      <Text style={{color: "#ffffff" }} >{this.state.data.currency} {this.state.data.currentBalance}</Text>
              </Body>
            </Col>
          </Grid>
          
            {!this.state.isFetch ? (<Body><Spinner color="red" /></Body>) : null }

              <View>
                {/* <Text>History</Text> */}
                <List>
                  { transaction }
                </List>
              </View>
              
              {this.state.myDetails ? <BankDetail /> : null}

              {this.state.history ? <History withdraws={this.state.withdraws} /> : null}

          </Content>
          <Footer >
            <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
              <Button vertical active
              // onPress={()=> this.props.navigation.navigate("Home")}
              >
                <Icon name="stats" />
                <Text>Stats</Text>
              </Button>
          
              <Button vertical 
                onPress={()=> this.props.navigation.navigate("Withdraw")} >
                <Icon active name="open" />
              <Text>Withdraw</Text>
              </Button>
              <Button vertical 
                onPress={()=> this.props.navigation.navigate("BankDetails")} >
                <Icon name="home" />
                <Text>Bank</Text>
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
                  <View style= {{ padding : 12 }}>
                    <Body>
                      <Text >{ this.state.message }</Text>
                    </Body>
                  </View>
                </ModalContent>
              </Modal>

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