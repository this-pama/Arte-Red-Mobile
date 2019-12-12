import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, FooterTab, Content, List, ListItem, Item, Picker,
Input, Form, Spinner,  } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import {BackHandler} from "react-native"
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import { buyArtworkAction } from "../redux/buyAction"
import {apiUrl} from "./service/env"
import { like, unLike, rating } from "../controller/api"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

 class WithdrawScreen extends Component {
  constructor(props){
    super(props);
    this.state={
        errMessage: '',
        currency: '',
        amount: '',
        otherCurrency: false,
        disable : true,
        myBank: {},
        fetchBank: false,
        showBankDetails: false,
        selectCurrency: true,
        showAmount: true,
        nextAmount: true,
        showBankDetails: false,
        nextBankDetails: false,
        modalVisible: false,
        message: '',
        data: {},
        isWalletFetch: false,
        showTransactionDetails: false,
        processWithdrawal: true,
    }
}

  componentDidMount() {
    //get bank details
    this.getMyBankDetails()

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Wallet")
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getMyBankDetails= async ()=>{
    // this.setState({ fetchBank: true })
    var url = apiUrl + "wallet/bank/" + this.props.userId;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt}`
       }
    })
    var response = await result
    // console.warn(response)
    var res = await response.json()
    // console.warn('response message', res.message)
    if(res.success ){
      this.setState({
        myBank: res.message,
        // fetchBank: false
      })
    }
    else{
      this.setState({ myBank: {}})
    }
    
  }

  handleAmount = amount => {
    if (+amount > 0) {
      this.setState(
        {
          amount,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        amount: '',
        errMessage: 'Specify Amount'
      });
    }
  };

  handleCurrency = currency => {
    if (currency.length > 0 && currency.length < 4) {
      this.setState(
        {
          currency,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        currency: '',
        errMessage: 'Specify Currency'
      });
    }
  };

  selectCurrency = currency => {
    if (currency == "Other Currency") {
      this.setState(
        {
          otherCurrency : true,
          selectCurrency: false, 
          errMessage: ''
        },
        this.validateFormAmount
      );
    }
    else if (currency.length > 0 && currency != "Select Currency") {
      this.setState(
        {
          currency,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } 
    else {
      this.setState({
        currency: '',
        errMessage: 'Select Currency'
      });
    }
  };

  nextAmount= () =>{
    this.getWalletBalance()
    this.setState({
      showBankDetails: true,
      otherCurrency: false,
      selectCurrency: false,
      showAmount: false,
      nextAmount: false,
      showBankDetails: true,
      nextBankDetails: true,
    })

    if(this.state.myBank.length <= 0 && !this.state.myBank.accountNumber ){
      this.setState({ modalVisible: true, message: "It seems you don't have any saved bank details"})
    }

  }

  nextBankDetails= () =>{
    this.setState({
      showBankDetails: true,
      otherCurrency: false,
      selectCurrency: false,
      showAmount: false,
      nextAmount: false,
      showBankDetails: false,
      nextBankDetails: false,
      showTransactionDetails: true,
    })
  }

  getWalletBalance = async () =>{
    var url = apiUrl + "wallet/withdraw/initiate/" + this.props.userId;
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        amount : this.state.amount,
        currency: this.state.currency
      })
    });
    var response = await result;
    console.warn(response)
    if(response.status !== 200 ){
      this.setState({
        message: 'Error occured while verifying wallet details',
        modalVisible: true,
        isWalletFetch: true,
        showBankDetails: true,
        otherCurrency: false,
        selectCurrency: false,
        showAmount: false,
        nextAmount: false,
        showBankDetails: false,
        nextBankDetails: false,
      })
    }
    else{
      var res = await response.json();
      console.warn(res)
      if (res.success) {
        this.setState({
          data: res.message,
          isWalletFetch: true,
        })
      } 
      else if(res.message.includes('Insufficient')){
        this.setState({ 
          message: 'Insufficient fund in wallet',
          modalVisible: true,
          isWalletFetch: true,
        })
      }
      else  {
        this.setState({
          message: 'It seems there is an error',
          modalVisible: true,
          isWalletFetch: true,
        })
      }
    }

  }

  processWithdrawal= async () =>{
    this.setState({ processWithdrawal : false })
    var url = apiUrl + "bank/transfer/saved/bank/" + this.props.userId;
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        amount : this.state.amount,
        currency: this.state.currency
      })
    });
    var response = await result;
    console.warn(response)
    if(response.status !== 200 ){
      this.setState({
        message: 'Transaction Error occured',
        modalVisible: true,
        isWalletFetch: true,
        showBankDetails: true,
        otherCurrency: false,
        selectCurrency: false,
        showAmount: false,
        nextAmount: false,
        showBankDetails: false,
        nextBankDetails: false,
        processWithdrawal: true
      })
    }
    else{
      var res = await response.json();
      console.warn(res)
      if(res.success) {
        this.setState({
          message: "Transaction successful",
          modalVisible: true,
          isWalletFetch: true,
          processWithdrawal: true
        })
      } 
      else if(res.message.includes('Insufficient')){
        this.setState({ 
          message: 'Insufficient fund in wallet',
          modalVisible: true,
          isWalletFetch: true,
          processWithdrawal: true
        })
      }
      else  {
        this.setState({
          message: 'It seems there is an error',
          modalVisible: true,
          isWalletFetch: true,
          processWithdrawal: true
        })
      }
    }
  }

  validateFormAmount = () => {
    if( +this.state.amount > 0 && this.state.currency.length > 0 && 
      this.state.currency.length < 4){
        this.setState({ disable: false, errMessage: ''})
      }
      else{
        this.setState({ disable: true })
      }
  }

  render() {
    const currency = ["NGN", "GHS", "KES", "UGX", "TZS", "USD", "GBP", "EUR", "AUD"]
    const currencyList = currency.map((currency, index) => (<Picker.Item key={index} label={`${currency}`} value={`${currency}`} /> ))

    const showAmount = (
      <ListItem>
        <Left>
          { this.state.otherCurrency ? (
            <Item stackedLabel>
                <Label>Currency</Label>
                <Input onChangeText= {this.handleCurrency  } value={this.state.currency}  keyboardType= 'default' />
            </Item>
          ) : (
            this.state.selectCurrency ? (
              <Item picker>
            <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: 50 }}
                placeholder="Branch Name"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.currency}
                onValueChange={ this.selectCurrency }
            >
                <Picker.Item label="Select Currency" value="Select Currency" />
                  { currencyList }
                <Picker.Item label="Other Currency" value="Other Currency" />
            </Picker>
          </Item>
            ) : null 
          )}
        </Left>
        <Body>
        <Item stackedLabel>
              <Label>Amount</Label>
              <Input onChangeText= {this.handleAmount  } value={this.state.amount}  keyboardType='numeric' />
          </Item>
        </Body>
      </ListItem>
    )

    const bankDetails = (
      <View style={{ padding: 20 }}>
        <Text>Amount: {this.state.currency } { this.state.amount }</Text>
        <Text>Bank Name: {this.state.myBank.bankName }</Text>
        <Text>Account Number: {this.state.myBank.accountNumber } </Text>
        <Text>Full Name: {this.state.myBank.fullName} </Text>
        {/* <Text>Account Currency: {this.state.myBank.currency} </Text> */}
        { this.state.myBank.length > 0 ? (
          <View>
            !this.state.myBank.meta[0].RoutingNumber ? null : (<Text>Routing Number: {this.state.myBank.meta[0].RoutingNumber} </Text>)
           !this.state.myBank.meta[0].SwiftCode ? null : <Text>Swift Code: {this.state.myBank.meta[0].SwiftCode} </Text>
           !this.state.myBank.meta[0].BeneficiaryAddress ? null : <Text>Beneficiary Address: {this.state.myBank.meta[0].BeneficiaryAddress } </Text>
           !this.state.myBank.meta[0].PostalCode ? null : <Text>Postal Code: {this.state.myBank.meta[0].PostalCode } </Text>
           !this.state.myBank.meta[0].StreetNumber ? null : <Text>Street Number: {this.state.myBank.meta[0].StreetNumber} </Text>
           !this.state.myBank.meta[0].StreetName ? null : <Text>Street Name: {this.state.myBank.meta[0].StreetName } </Text>
           !this.state.myBank.meta[0].City ? null : <Text>City: {this.state.myBank.meta[0].City } </Text>
           !this.state.myBank.meta[0].BeneficiaryCountry ? null : <Text>Beneficiary Country: {this.state.myBank.meta[0].BeneficiaryCountry } </Text>
          </View>
        ) : null }
      </View> 
    )

    const showTransactionDetails = (
      <View style={{ padding: 20 }}>
        <Body>
          <Text style={{ fontWeight: 'bold', padding: 12 }}>Transaction Details</Text>
        </Body>
        <Text>Amount: {this.state.data.currency } {this.state.data.amount } </Text>
        <Text>Service charge: {this.state.data.currency } {this.state.data.fee}</Text>

        { this.state.data.amount ? (
            <View style={{ paddingTop: 20 }}>
              <Button  block danger 
                  disabled={ this.state.data.amount ? false : true }
                  onPress={ this.processWithdrawal }
              >
                  { this.state.processWithdrawal ? <Text> Withdraw </Text> : <Spinner color='white' /> }
              </Button>
            </View>
            ) : null }
        
      </View>
    )

    return (
      <Container>
        <Header  style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Wallet")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Cash Out</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content style={{ paddingBottom: 20}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Body><Text style={{ color : 'red'}}>{ this.state.errMessage }</Text></Body>
                { this.state.showAmount ? showAmount : null }
                { this.state.showBankDetails ? bankDetails : null }

                { this.state.showTransactionDetails ? ( this.state.isWalletFetch  ? showTransactionDetails : <Spinner color='red' /> ) : null}

            </KeyboardAvoidingView>

            { this.state.nextAmount ? (
              <View style={{ padding: 20 }}>
              <Button  block danger 
                  disabled={this.state.disable}
                  onPress={ this.nextAmount }
              >
                  <Text> Next </Text>
              </Button>
            </View>
            ) : null }

            { this.state.nextBankDetails ? (
              <View style={{ padding: 20 }}>
              <Button  block danger 
                  // disabled={ this.state.myBank.accountNumber && this.state.myBank.bankName ? false : true }
                  onPress={ this.nextBankDetails }
              >
                  <Text> Next </Text>
              </Button>
            </View>
            ) : null }
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
              onPress={()=> this.props.navigation.navigate("Wallet")} >
              <Icon name="cash" />
              <Text>Wallet</Text>
            </Button>
            {/* <Button vertical 
              onPress={()=> this.props.navigation.navigate("")} >
              <Icon name="cash" />
              <Text>Transfer</Text>
            </Button> */}
          
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
    );
  }
}

const styles = {
    container: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 10,
        paddingLeft: 10
    }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(WithdrawScreen)