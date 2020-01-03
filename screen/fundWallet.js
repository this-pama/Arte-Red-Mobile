import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
  Text, Label, Footer, FooterTab, Content, List, ListItem, Item, Picker,
  Input, Form, Spinner,  } from 'native-base';
import PropTypes from "prop-types"
import { View, KeyboardAvoidingView } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {BackHandler} from "react-native"
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import { buyArtworkAction } from "../redux/buyAction"
import {apiUrl} from "./service/env"
import {connect} from 'react-redux'
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { WebView } from 'react-native-webview';


class FundWalletScreen extends Component{
  constructor(props){
    super(props);
    this.state={
        errMessage: '',
        myBank: {},
        disable: true,
        amount: '',
        currency: '',
        showCard : false,
        showAmount: true,
        showAddress: false,
        cardno: '',
        cvv: '',
        expiry: '',
        name: '',
        nextCard: false,
        wallet: {},
        modalVisible: false,
        showOtp: false,
        showPin: false,
        showWebView: false,
        url: '',
        authMode: null,
        pin: '',
        billingaddress: '',
        billingcity: '',
        billingcountry: '',
        billingstate: '',
        billingzip: '',
        otp: '',
        otpReference: '',
        fetched: true,

    }
}

  componentDidMount() {
    //get bank details
    this.getWalletDetails()

    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Wallet")
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getWalletDetails= async ()=>{
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
    if(response.status != 200){
        this.setState({ 
            wallet: {},
           message: "We couldn't get your wallet details", 
           modalVisible: true, 
          })
    }
    else{
        var res = await response.json()
        // console.warn('response message', res.message)
        if(res.success ){
        this.setState({
            wallet: res.message,
            currency: res.message.currency,
            // fetchBank: false
        })
        }
        else{
        this.setState({ 
            wallet: {},
            message: "Error occurred while getting your wallet details", 
            modalVisible: true, 
            })
        }
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

  handlePin = pin => {
    if (pin ) {
      this.setState(
        {
          pin,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        pin: '',
        errMessage: 'Input PIN'
      });
    }
  };

  handleOtp = otp => {
    if (otp ) {
      this.setState(
        {
          otp,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        otp: '',
        errMessage: 'Input OTP'
      });
    }
  };

  processOtp= async ()=>{
    this.setState({ fetched : false })
    var url = apiUrl + "wallet/payment/validate";
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        reference: this.state.otpReference, 
        otp: this.state.otp
      })
    });
    var response = await result;
    if(response.status !== 200 ){
      this.setState({
        message: 'Transaction Validation failed',
        modalVisible: true,
        fetched : true
      })
    }
    else{
        var res = await response.json()
        // console.warn('response message', res.message)
        if(res.success ){
          this.setState({
            message: 'Transaction successful',
            modalVisible: true,
            showAmount: true,
            showOtp: false,
            fetched : true,
            errMessage: '',
          })
        }
        else{
          this.setState({
            message: 'Transaction Validation failed',
            modalVisible: true,
            fetched : true,
          })
        }
    }
    
  }

  handleBillingZip = billingzip => {
    if (billingzip) {
      this.setState(
        {
          billingzip,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        billingzip: '',
        errMessage: 'Input Billing Zip'
      });
    }
  };

  handleBillingState = billingstate => {
    if (billingstate) {
      this.setState(
        {
          billingstate,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        billingstate: '',
        errMessage: 'Input Billing State'
      });
    }
  };

  handleBillingCountry = billingcountry => {
    if (billingcountry) {
      this.setState(
        {
          billingcountry,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        billingcountry: '',
        errMessage: 'Input Billing Country'
      });
    }
  };

  handleBillingCity = billingcity => {
    if (billingcity) {
      this.setState(
        {
          billingcity,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        billingcity: '',
        errMessage: 'Input Billing City'
      });
    }
  };

  handleBillingAddress = billingaddress => {
    if (billingaddress) {
      this.setState(
        {
          billingaddress,
          disable: false,
          errMessage: ''
        },
        this.validateFormAmount
      );
    } else {
      this.setState({
        billingaddress: '',
        errMessage: 'Input Billing Address'
      });
    }
  };


  validateFormAmount = () => {
    if( +this.state.amount > 0 && this.state.currency.length > 0 && 
      this.state.currency.length < 4){
        this.setState({ disable: false, errMessage: ''})
      }
      else{
        this.setState({ disable: true, showCard: false })
      }
  }

  nextAmount= () =>{
    this.setState({
      showCard: true,
      showAmount: false,
    })
  }

  _onChange = form => {
    let cardno = form.values.number.replace(/\s/g,'')
      this.setState({
          cardno,
          cvv: form.values.cvc,
          expiry: form.values.expiry,
          name: form.values.name
      })

      if(form.status.expiry == "valid" && form.status.name == "valid" && form.status.cvc == "valid"){
          this.setState({ nextCard : true })
      }
      else{
        this.setState({ nextCard : false })
      }
}

initiatePayment= async () =>{
    this.setState({ processWithdrawal : false })
    var url = apiUrl + "wallet/payment/card/" + this.props.userId;
    const expiry = this.state.expiry.replace('/', '')
    let month = expiry.substring(0, 2);
    let year = expiry.substring(2, this.state.expiry.length - 1);
    let data

    switch (this.state.authMode) {
      case "PIN":
        data = {
          amount : this.state.amount,
          currency: this.state.currency,
          cardno : this.state.cardno,
          cvv: this.state.cvv,
          expiryMonth : month,
          expiryYear: year,
          pin: this.state.pin,
          auth: "PIN"
        }
        break;

      case 'AVS_VBVSECURECODE':
          data = {
            amount : this.state.amount,
            currency: this.state.currency,
            cardno : this.state.cardno,
            cvv: this.state.cvv,
            expiryMonth : month,
            expiryYear: year,
            pin: this.state.pin,
            auth: "AVS_VBVSECURECODE",
            billingzip: this.state.billingzip,
            billingcity: this.state.billingcity,
            billingaddress: this.state.billingaddress,
            billingstate: this.state.billingstate,
            billingcountry: this.state.billingcountry,
          }
        
        break;

      case "NOAUTH_INTERNATIONAL":
         data = {
            amount : this.state.amount,
            currency: this.state.currency,
            cardno : this.state.cardno,
            cvv: this.state.cvv,
            expiryMonth : month,
            expiryYear: year,
            pin: this.state.pin,
            auth: "NOAUTH_INTERNATIONAL",
            billingzip: this.state.billingzip,
            billingcity: this.state.billingcity,
            billingaddress: this.state.billingaddress,
            billingstate: this.state.billingstate,
            billingcountry: this.state.billingcountry,
          }
        break;

      default: 
      data = {
        amount : this.state.amount,
        currency: this.state.currency,
        cardno : this.state.cardno,
        cvv: this.state.cvv,
        expiryMonth : month,
        expiryYear: year,
      }
    }

    this.setState({ fetched : false })
    // make card request to server
    var result = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });
    var response = await result;
    if(response.status !== 200 ){
      this.setState({
        message: 'Transaction Error occured',
        modalVisible: true,
        fetched : true
      })
    }
    else{
      var res = await response.json();
      console.warn(res)
      if(res.success) {
          if(res.data.data.suggested_auth && res.data.data.suggested_auth == 'PIN'){
              this.setState({
                  showOtp: false,
                  showPin: true,
                  showCard: false,
                  showAmount: false,
                  showAddress: false,
                  errMessage: "Input Card PIN",
                  nextCard: false,
                  authMode: res.data.data.suggested_auth,
                  fetched : true
              })
          }

          else if(res.instruction && res.instruction.includes('OTP') && res.url  && res.url.length > 0 && res.reference && res.reference.length > 0 ){
            this.setState({
                showOtp: true,
                showPin: false,
                showCard: false,
                showAmount: false,
                showAddress: false,
                errMessage: res.instruction,
                nextCard: false,
                otpReference: res.reference,
                fetched : true
            })
          }
          else if(res.data.data.suggested_auth && (res.data.data.suggested_auth == "NOAUTH_INTERNATIONAL" || res.data.data.suggested_auth == "AVS_VBVSECURECODE" )){
            this.setState({
                showOtp: false,
                showPin: false,
                showCard: false,
                showAmount: false,
                showAddress: true,
                errMessage: "",
                nextCard: false,
                authMode: res.data.data.suggested_auth,
                fetched : true
            })
        }
          // else if( res.message.includes('Requires validation') && res.url && res.url.length > 0){
          //   // console.warn(res.instruction)
          //     this.setState({
          //         errMessage: res.instruction,
          //         showWebView : true,
          //         showAmount: false,
          //         showCard: false,
          //         nextCard: false,
          //         url: res.url,
          //     })

          //     return 
          // }
          else{
              this.setState({
                  message: 'Transaction failed',
                  modalVisible: true,
                  errMessage: '',
                  showOtp: false,
                  showAmount: false,
                  showCard: false,
                  nextCard: false,
                  showWebView: false,
                  showOtp: false,
                  showPin: false,
                  showAddress: false,
              })
          }
 
      } 
      else  {
        this.setState({
          message: 'There seems to be an error',
          modalVisible: true,
          showOtp: false,
            showAmount: false,
            showCard: false,
            showWebView: false,
            nextCard: false,
            showAddress: false,
            errMessage: res.instruction
        })
      }
    }
  }

  webview = null;

  handleWebViewNavigationStateChange = newNavState => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;
    if (!url) return;

    // one way to handle a successful form submit is via query strings
    if (url.includes('message=Approved.+Successful&receiptno')) {
      this.webview.stopLoading();
      // maybe close this view?
      this.setState({
        showWebView: false,
        showAmount: true,
        modalVisible: true,
        message: "Transaction Successful",
        errMessage: '',
      })
    }
    // one way to handle errors is via query string
    if (url.includes('?response=')) {
      this.webview.stopLoading();
      this.setState({
        showWebView: false,
        showAmount: true,
        modalVisible: true,
        message: "Transaction failed",
        errMessage: '',
      })
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
      this.setState({
        showWebView: false,
        showAmount: true,
        modalVisible: true,
        message: "Error occurred",
        errMessage: '',
      })
    }

    // else{
    //     this.webview.stopLoading();
    //     alert('Nothing happened')
    // }

  };

    render(){
      const showOtp = (
            <View>
                <ListItem>
                <Body>
                  <Item stackedLabel>
                      <Label>OTP</Label>
                      <Input onChangeText= {this.handleOtp  } value={this.state.otp}  keyboardType='numeric' />
                  </Item>
                </Body>
            </ListItem>
            <Button  block danger 
                disabled={this.state.disable}
                onPress={ this.processOtp }
            >
                { this.state.fetched ? <Text> Next </Text> : <Spinner color='white' /> }
            </Button>
          </View>
      )

      const showPin = (
        <View>
            <ListItem>
            <Body>
              <Item stackedLabel>
                  <Label>PIN</Label>
                  <Input onChangeText= {this.handlePin  } value={this.state.pin}  keyboardType='numeric' />
              </Item>
            </Body>
        </ListItem>
        <Button  block danger 
            disabled={this.state.disable}
            onPress={ this.initiatePayment }
        >
            { this.state.fetched ? <Text> Next </Text> : <Spinner color='white' /> }
        </Button>
      </View>
  )

  showAddress= (
    <View>
      <Item stackedLabel>
          <Label>Billing Address</Label>
          <Input onChangeText= { this.handleBillingAddress} value={this.state.billingaddress }   />
      </Item>
      <Item stackedLabel>
          <Label>Billing City</Label>
          <Input onChangeText= { this.handleBillingCity} value={this.state.billingcity}   />
      </Item>
      <Item stackedLabel>
          <Label>Billing Zip</Label>
          <Input onChangeText= { this.handleBillingZip } value={this.state.billingzip }   />
      </Item>
      <Item stackedLabel>
          <Label>Billing State</Label>
          <Input onChangeText= { this.handleBillingState} value={this.state.billingstate }   />
      </Item>
      <Item stackedLabel>
          <Label>Billing Country</Label>
          <Input onChangeText= { this.handleBillingCountry} value={this.state.billingcountry}   />
      </Item>
      <Button  block danger 
            disabled={this.state.disable}
            onPress={ this.initiatePayment }
        >
            { this.state.fetched ? <Text> Next </Text> : <Spinner color='white' /> }
        </Button>
    </View>
  )

      const run = `
      document.body.style.backgroundColor = 'red';
      true;
    `;

      const showWebView = (
        <WebView
          ref={ref => (this.webview = ref)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
          style={{ marginTop: 50 }}
          scalesPageToFit= { false }
          startInLoadingState={true}
          renderLoading={() => <Spinner color='red' /> }
          // injectedJavaScript={run}
          onMessage={event => {
            console.warn('event.nativeEvent.data', event.nativeEvent.data);
            if(event.nativeEvent.data.include('"response":"{}"')){
              this.setState({
                showAmount: true,
                showWebView: false,
                modalVisible: true,
                message: "Transaction failed"
              })
            }
            // else if(event.nativeEvent.data.include()){
            //   this.setState({
            //     showAmount: true,
            //     showWebView: false,
            //     modalVisible: true,
            //     message: "Transaction failed"
            //   })
            // }
            else{
              this.setState({
                showAmount: true,
                showWebView: false,
                modalVisible: true,
                message: "Transaction failed"
              })
            }
            
          }}
        />
      )

      if(!this.state.showWebView){
        return(
          <Container>
        <Header  style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Wallet")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Fund Wallet</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content style={{ padding: 20,}}>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
          <Body><Text style={{ color : 'red'}}>{ this.state.errMessage }</Text></Body>
          { this.state.showCard ? (<CreditCardInput onChange={this._onChange} requiresName= { true } requiresCVC= { true} allowScroll= { true } />) : null }

          { this.state.nextCard ? (
              <View style={{ paddingTop: 20 }}>
                  <Button  block danger 
                    //   disabled={this.state.disable}
                    onPress={ this.initiatePayment }
                >
                    { this.state.fetched ? <Text> Next </Text> : <Spinner color='white' /> }
                </Button>
              </View>
          ) : null }

          { this.state.showOtp ? showOtp : null } 

          { this.state.showPin ? showPin : null }

          { this.state.showAddress ? showAddress : null }
          
          { this.state.showAmount ? (
            <View>
                <ListItem>
                <Left>
                    <Item stackedLabel>
                        <Label>{this.state.currency}</Label>
                    </Item>
                </Left>
                <Body>
                <Item stackedLabel>
                    <Label>Amount</Label>
                    <Input onChangeText= {this.handleAmount  } value={this.state.amount}  keyboardType='numeric' />
                </Item>
                </Body>
            </ListItem>
            <Button  block danger 
                disabled={this.state.disable}
                onPress={ this.nextAmount }
            >
                <Text> Next </Text>
            </Button>
          </View>
          ) : null }
          </KeyboardAwareScrollView>
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
      else{
        return showWebView
      }
    }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(FundWalletScreen )