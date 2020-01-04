import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
  Text, Label, Footer, FooterTab, Content, List, ListItem, Item, Picker,
  Input, Form, Spinner,  } from 'native-base';
import PropTypes from "prop-types"
import { View, KeyboardAvoidingView } from "react-native"
import {BackHandler} from "react-native"
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import { buyArtworkAction } from "../../redux/buyAction"
import {apiUrl} from "../service/env"
import {connect} from 'react-redux'
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class BankDetail extends Component{
  constructor(props){
    super(props);
    this.state={
        errMessage: '',
        myBank: {},
        fetchBank: false,
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
    this.setState({ fetchBank: true })
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
        fetchBank: false
      })
    }
    else{
      this.setState({ myBank: {}, fetchBank: false})
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
            <Title>Account Details</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content style={{ paddingBottom: 20}}>
          { this.state.fetchBank ? <Spinner color='red' /> : null }
          
          <Body><Text style={{ color : 'red'}}>{ this.state.errMessage }</Text></Body>
          <List>
            {/* <ListItem >
              <Body>
                <Text>Bank Name</Text>
                <Text note>{this.state.myBank.bankName }</Text>
              </Body>
            </ListItem> */}
            <ListItem >
              <Body>
                <Text>Bank Name</Text>
                <Text note>{this.state.myBank.bankName }</Text>
              </Body>
            </ListItem>
            <ListItem >
              <Body>
                <Text>Account Number</Text>
                <Text note>{this.state.myBank.accountNumber }</Text>
              </Body>
            </ListItem>
            <ListItem >
              <Body>
                <Text>Full Name</Text>
                <Text note>{this.state.myBank.fullName}</Text>
              </Body>
            </ListItem>
            { this.state.myBank.length > 0 ? (
                <View>
                  !this.state.myBank.meta[0].RoutingNumber ? null : (
                    <ListItem >
                      <Body>
                        <Text>Routing Number</Text>
                        <Text note>{this.state.myBank.meta[0].RoutingNumber}</Text>
                      </Body>
                    </ListItem>)
                !this.state.myBank.meta[0].SwiftCode ? null : (
                  <ListItem >
                      <Body>
                        <Text>Swift Code</Text>
                        <Text note>{this.state.myBank.meta[0].SwiftCode}</Text>
                      </Body>
                    </ListItem>
                )
                !this.state.myBank.meta[0].BeneficiaryAddress ? null : (
                  <ListItem >
                      <Body>
                        <Text>Beneficiary Address</Text>
                        <Text note>{this.state.myBank.meta[0].BeneficiaryAddress }</Text>
                      </Body>
                    </ListItem>
                )
                !this.state.myBank.meta[0].PostalCode ? null : (
                  <ListItem >
                      <Body>
                        <Text>Postal Code</Text>
                        <Text note>{this.state.myBank.meta[0].PostalCode }</Text>
                      </Body>
                    </ListItem>
                ) 
                !this.state.myBank.meta[0].StreetNumber ? null : (
                  <ListItem >
                      <Body>
                        <Text>Street Number</Text>
                        <Text note>{this.state.myBank.meta[0].StreetNumber}</Text>
                      </Body>
                    </ListItem>
                ) 
                !this.state.myBank.meta[0].StreetName ? null : (
                  <ListItem >
                      <Body>
                        <Text>Street Name</Text>
                        <Text note>{this.state.myBank.meta[0].StreetName }</Text>
                      </Body>
                    </ListItem>
                ) 
                !this.state.myBank.meta[0].City ? null : (
                  <ListItem >
                      <Body>
                        <Text>City</Text>
                        <Text note>{this.state.myBank.meta[0].City } </Text>
                      </Body>
                    </ListItem>
                )
                !this.state.myBank.meta[0].BeneficiaryCountry ? null : (
                  <ListItem >
                      <Body>
                        <Text>Beneficiary Country</Text>
                        <Text note>{this.state.myBank.meta[0].BeneficiaryCountry }  </Text>
                      </Body>
                    </ListItem>
                ) 
                </View>
              ) : null }
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
              onPress={()=> this.props.navigation.navigate("Wallet")} >
              <Icon name="cash" />
              <Text>Wallet</Text>
            </Button>
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Bank")} >
              <Icon name="add" />
              <Text>Add Bank</Text>
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
    getUserProfileAction, moreArtworkDetailsAction, buyArtworkAction })(BankDetail)