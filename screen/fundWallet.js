import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
  Text, Label, Footer, FooterTab, Content, List, ListItem, Item, Picker,
  Input, Form, Spinner,  } from 'native-base';
import PropTypes from "prop-types"
import { View, KeyboardAvoidingView } from "react-native"
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
        cardno: '',
        cvv: '',
        expiry: '',
        name: '',
        nextCard: false,
        wallet: {},
        modalVisible: false,
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
      this.setState({
          cardno : form.values.number,
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

    render(){
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
          <Body><Text style={{ color : 'red'}}>{ this.state.errMessage }</Text></Body>
          { this.state.showCard ? (<CreditCardInput onChange={this._onChange} requiresName= { true } requiresCVC= { true} />) : null }

          { this.state.nextCard ? (
              <View style={{ paddingTop: 20 }}>
                  <Button  block danger 
                    //   disabled={this.state.disable}
                    onPress={ this.nextAmount }
                >
                    <Text> Next </Text>
                </Button>
              </View>
          ) : null }

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
              onPress={()=> this.props.navigation.navigate("Bank")} >
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

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(FundWalletScreen )