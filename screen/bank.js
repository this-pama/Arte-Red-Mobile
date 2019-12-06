import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Item, Picker,
Input, Form,  Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from "prop-types"
import { BackHandler} from "react-native"

export default class BankScreen extends Component {

  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Wallet")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    const add = <Text> Add Bank </Text>
    const spinner = <Spinner color="white" />
    const country = Object.keys(this.props.bankList)
    const listCountry = country.map(ele=><Picker.Item label={`${ele}`} value={`${ele}`} />)

    const banks = this.props.bank;
    const bankList = banks.map(bank => (<Picker.Item label={`${bank}`} value={`${bank}`} /> ))

    const showBankList = (
      <Item picker>
          <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Bank Name"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.props.bankName}
              onValueChange={ this.props.selectBank }
          >
              <Picker.Item label="Select A Bank" value="Select A Bank" />
              { bankList }
          </Picker>
      </Item>
    )
    const details= (
      <Form>
          <Item stackedLabel>
              <Label>First Name</Label>
              <Input onChangeText= {this.props.handleFirstName  } value={this.props.firstName}  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Last Name</Label>
              <Input onChangeText= { this.props.handleLastName } value={this.props.lastName}  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Account Number</Label>
              <Input onChangeText= { this.props.handleAccountNumber } value={this.props.accountNumber}  keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail} value={this.props.email}   />
          </Item>
      </Form>
    )

    const next =(
      <View style={{ padding : 10}}>
        <Button  block danger 
            disabled={this.props.disable}
            onPress={this.props.next }
        >
            <Text> Next </Text>
        </Button>
      </View>
    )

    const summary = (
      <View>
        <Text >Full Name: {this.props.firstName} {this.props.lastName} </Text>
        <Text> Bank Name: {this.props.bankName} </Text>
        <Text> Account Number: {this.props.accountNumber}</Text>
        <Text> Country: {this.props.country} </Text>
        <Text> Email: {this.props.email} </Text>
      </View>
    )

    return (
      <Container>
        <Header  style={{  backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Wallet")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Bank Detail</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
        <Content style={{ paddingBottom: 20, padding: 30 }}>
          <Text note>You can also transfer directly to other banks if your country is not listed here.</Text>
          <TouchableOpacity>
            <Text note style={{ color: 'blue'}}> Transfer in other countries</Text>
          </TouchableOpacity>
          { this.props.showCountry ? (
            <Item picker>
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Select Country"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.props.country}
                  onValueChange={ this.props.selectCountry }
              >
                  <Picker.Item label="Select Country" value="Select Country" />
                  { listCountry }
              </Picker>
          </Item>
          ) : null }
          { this.props.showBankList ? showBankList : null }

          {this.props.showDetails ? details : null }

          { this.props.showDetails ? next  : null }
          
          { this.props.ready ? summary : null }


          { this.props.ready ? (
            <View style={{ paddingTop : 20}}>
            <Button  block danger 
                // disabled={this.props.disable}
                onPress={this.props.addBank }
            >
                {this.props.spin ? spinner : add }
            </Button>
          </View>
          ) : null }

        </Content>
        </KeyboardAwareScrollView>
        
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

BankScreen.propsType={
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  accountNumber: PropTypes.string.isRequired,
  bankName: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,
  spin: PropTypes.string.isRequired,
  handleFirstName: PropTypes.func.isRequired,
  handleLastName: PropTypes.func.isRequired,
  handleAccountNumber: PropTypes.func.isRequired,
  handlebankName: PropTypes.func.isRequired,
  handleEmail: PropTypes.func.isRequired,
  addBank: PropTypes.func.isRequired,
  bankList: PropTypes.object,
  country: PropTypes.string.isRequired,
  selectCountry: PropTypes.func.isRequired,
  showBankList: PropTypes.bool.isRequired,
  showDetails: PropTypes.bool.isRequired,
  showCountry: PropTypes.bool.isRequired,
  ready: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  bank: PropTypes.object.isRequired,
  selectBank : PropTypes.func.isRequired
}