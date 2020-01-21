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

 class ChangeWalletScreen extends Component {
  constructor(props){
    super(props);
    this.state={
        errMessage: '',
        currency: '',
        otherCurrency: false,
        disable : true,
        fetch: false,
        process : true,
        selectCurrency: true,
        showAmount: true,
        modalVisible: false,
        message: '',
        wallet: {},
    }
}

  componentDidMount() {
    this.getWallet()

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Wallet")
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getWallet= async ()=>{
    // this.setState({ fetchBank: true })
    var url = apiUrl + "wallet/mywallet/" + this.props.userId;
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
    console.warn('response message', res)
    if(res.success ){
      this.setState({
        wallet: res.message,
        fetch: true
      })
    }
    else{
      this.setState({ 
        message: 'Error occured while verifying wallet details',
        modalVisible: true,
        fetch: true
      })
    }
    
  }

  handleCurrency = currency => {
    if (currency.length > 0 && currency.length < 4) {
      this.setState(
        {
          currency: currency.toUpperCase(),
          errMessage: ''
        },
        this.validate
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
        this.validate
      );
    }
    else if (currency.length > 0 && currency != "Select Currency") {
      this.setState(
        {
          currency,
          errMessage: ''
        },
        this.validate
      );
    } 
    else {
      this.setState({
        currency: '',
        errMessage: 'Select Currency'
      });
    }
  };


  changeCurrency = async () =>{
    this.setState({ process : false })
    var url = apiUrl + "wallet/mywallet/change/currency/" + this.props.userId;
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        currency: this.state.currency
      })
    });
    var response = await result;
    console.warn(response)
    if(response.status !== 200 ){
      this.setState({
        message: 'Transaction Error occured',
        modalVisible: true,
        process: true,
        otherCurrency: false,
        selectCurrency: true,
      })
    }
    else{
      var res = await response.json();
      console.warn(res)
      if(res.success) {
        this.setState({
            process: true,
            otherCurrency: false,
            selectCurrency: true,
        })
        this.props.navigation.navigate("Wallet")
      } 
      else if(res.message.includes('Currency')){
        this.setState({ 
          message: 'Currency conversion error',
          modalVisible: true,
          process: true,
            otherCurrency: false,
            selectCurrency: true,
        })
      }
      else  {
        this.setState({
          message: 'It seems there is an error',
          modalVisible: true,
          process: true,
            otherCurrency: false,
            selectCurrency: true,
        })
      }
    }
  }

  validate = () => {
    if( this.state.currency.length > 0 && 
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

    const selectCurrency = (
    <View>
      <ListItem>
        <Body>
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
        </Body>
      </ListItem>
      <View style={{ padding : 24 }} >
          <Button block danger 
            disabled={ this.state.disable}
            onPress={ this.changeCurrency }
          >
              { this.state.process ? <Text>Change Currency</Text> : <Spinner color='white' /> }
          </Button>
      </View>
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
            <Title>Change Wallet Currency</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content>
        {!this.state.fetch ? (
                <Body>
                    <Spinner color='red' />
                </Body>
            ) : null }

            
                <Body>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', paddingTop: 20  }}>{ this.state.wallet.currency } {this.state.wallet.withdrawable} </Text>
                </Body>
             
            { selectCurrency }

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

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(ChangeWalletScreen)