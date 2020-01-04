import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, FooterTab, Content, List, ListItem, Item, Picker,
Input, Form,  Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from "prop-types"
import { BackHandler} from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

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
    const listCountry = country.map((ele , index)=><Picker.Item  key={index} label={`${ele}`} value={`${ele}`} />)

    const banks = this.props.bank;
    const bankList = banks.map((bank, index ) => (<Picker.Item  key={index}label={`${bank}`} value={`${bank}`} /> ))

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

    const branchList = this.props.branchList.map((bank, index) => (<Picker.Item key={index} label={`${bank.BranchName}`} value={`${bank.BranchName}`} /> ))
    const showGhanaBranchList = (
      <Item picker>
          <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Branch Name"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.props.branch}
              onValueChange={ this.props.selectBranch }
          >
              <Picker.Item label="Select Branch" value="Select Branch" />
              { branchList }
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
    const showOt= (
      <View>
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
              <Input onChangeText= { this.props.handleAccountNumber } value={this.props.accountNumber}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Bank Name</Label>
              <Input onChangeText= { this.props.handleInternationalBankName } value={this.props.internationalBankName}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail} value={this.props.email}   />
          </Item>
          <Item stackedLabel>
              <Label>Routing Number</Label>
              <Input onChangeText= { this.props.handleRoutingNumber} value={this.props.routingNumber}   />
          </Item>
          <Item stackedLabel>
              <Label>Swift Code</Label>
              <Input onChangeText= { this.props.handleSwiftCode} value={this.props.swiftCode}   />
          </Item>
          <Item stackedLabel>
              <Label>Beneficiary Address</Label>
              <Input onChangeText= { this.props.handleBeneficiaryAddress} value={this.props.beneficiaryAddress}   />
          </Item>
      </Form>
      <View style={{ padding : 10}}>
      <Button  block danger 
          disabled={this.props.accountNumber.length <= 0 || this.props.firstName.length <= 0 ||
            this.props.lastName.length <= 0 || this.props.internationalBankName.length <= 0 ||
            this.props.email.length <= 0 || this.props.routingNumber.length <= 0 ||
            this.props.swiftCode.length <= 0 || this.props.beneficiaryAddress.length <= 0 ? true : false }
          onPress={this.props.next }
      >
          <Text> Next </Text>
      </Button>
    </View>
    </View>
    )

    const showUs= (
      <View>
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
              <Input onChangeText= { this.props.handleAccountNumber } value={this.props.accountNumber}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Bank Name</Label>
              <Input onChangeText= { this.props.handleInternationalBankName } value={this.props.internationalBankName}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail} value={this.props.email}   />
          </Item>
          <Item stackedLabel>
              <Label>Routing Number</Label>
              <Input onChangeText= { this.props.handleRoutingNumber} value={this.props.routingNumber}   />
          </Item>
          <Item stackedLabel>
              <Label>Swift Code</Label>
              <Input onChangeText= { this.props.handleSwiftCode} value={this.props.swiftCode}   />
          </Item>
          <Item stackedLabel>
              <Label>Beneficiary Address</Label>
              <Input onChangeText= { this.props.handleBeneficiaryAddress} value={this.props.beneficiaryAddress}   />
          </Item>
          {/* <Item stackedLabel>
              <Label>Swift Code</Label>
              <Input onChangeText= { this.props.handleSwiftCode} value={this.props.swiftCode}   />
          </Item> */}
          
      </Form>
      <View style={{ padding : 10}}>
        <Button  block danger 
            disabled={this.props.accountNumber.length <= 0 || this.props.firstName.length <= 0 ||
              this.props.lastName.length <= 0 || this.props.internationalBankName.length <= 0 ||
              this.props.email.length <= 0 || this.props.routingNumber.length <= 0 ||
              this.props.swiftCode.length <= 0 || this.props.beneficiaryAddress.length <= 0 ? true : false }
            onPress={this.props.next }
        >
            <Text> Next </Text>
        </Button>
      </View>
      </View>
    )

    const showEur= (
      <View>
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
              <Input onChangeText= { this.props.handleAccountNumber } value={this.props.accountNumber}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Bank Name</Label>
              <Input onChangeText= { this.props.handleInternationalBankName } value={this.props.internationalBankName}  keyboardType='words' />
          </Item>
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.props.handleEmail} value={this.props.email}   />
          </Item>
          <Item stackedLabel>
              <Label>Routing Number</Label>
              <Input onChangeText= { this.props.handleRoutingNumber} value={this.props.routingNumber}   />
          </Item>
          <Item stackedLabel>
              <Label>Swift Code</Label>
              <Input onChangeText= { this.props.handleSwiftCode} value={this.props.swiftCode}   />
          </Item>
          <Item stackedLabel>
              <Label>Beneficiary Address</Label>
              <Input onChangeText= { this.props.handleBeneficiaryAddress } value={this.props.beneficiaryAddress}   />
          </Item>
          <Item stackedLabel>
              <Label>Beneficiary Country Code</Label>
              <Input onChangeText= { this.props.handleBeneficiaryCountry} value={this.props.beneficiaryCountry}   />
          </Item>
          <Item stackedLabel>
              <Label>Postal Code</Label>
              <Input onChangeText= { this.props.handlePostalCode} value={this.props.postalCode}   />
          </Item>
          <Item stackedLabel>
              <Label>Street Number</Label>
              <Input onChangeText= { this.props.handleStreetNumber} value={this.props.streetNumber}   />
          </Item>
          <Item stackedLabel>
              <Label>Street Name</Label>
              <Input onChangeText= { this.props.handleStreetName} value={this.props.streetName}   />
          </Item>
          <Item stackedLabel>
              <Label>City</Label>
              <Input onChangeText= { this.props.handleCity} value={this.props.city}   />
          </Item>
      </Form>
      <View style={{ padding : 10}}>
      <Button  block danger 
          disabled={this.props.accountNumber.length <= 0 || this.props.firstName.length <= 0 ||
            this.props.lastName.length <= 0 || this.props.internationalBankName.length <= 0 ||
            this.props.email.length <= 0 || this.props.routingNumber.length <= 0 || 
            this.props.swiftCode.length <= 0 || this.props.beneficiaryAddress.length <= 0 || 
            this.props.beneficiaryCountry.length <= 0 || this.props.postalCode.length <= 0 ||
            this.props.streetNumber.length <= 0 || this.props.streetName.length <= 0 || this.props.city.length <= 0 ? true : false}
          onPress={this.props.next }
      >
          <Text> Next </Text>
      </Button>
    </View>
    </View>
    )

    const next =(
      <View style={{ padding : 10}}>
        <Button  block danger 
            disabled={this.props.accountNumber.length <= 0 || this.props.firstName.length <= 0 ||
              this.props.lastName.length <= 0 || this.props.email.length <= 0  ? true : false}
            onPress={this.props.next }
        >
            <Text> Next </Text>
        </Button>
      </View>
    )

    const otSummary = (
      <View>
          <Text >Full Name: {this.props.firstName} {this.props.lastName} </Text>
          <Text> Bank Name: {this.props.bankName} </Text>
          <Text> Account Number: {this.props.accountNumber}</Text>
          <Text> Country: {this.props.country} </Text>
          <Text> Routing Number: {this.props.routingNumber} </Text>
          <Text> Swift Code: {this.props.swiftCode} </Text>
          <Text> Beneficiary Address: {this.props.beneficiaryAddress} </Text>
      </View>
    )

    const eurSummary = (
      <View>
          <Text >Full Name: {this.props.firstName} {this.props.lastName} </Text>
          <Text> Bank Name: {this.props.bankName} </Text>
          <Text> Account Number: {this.props.accountNumber}</Text>
          <Text> Country: {this.props.country} </Text>
          <Text> Routing Number: {this.props.routingNumber} </Text>
          <Text> Swift Code: {this.props.swiftCode} </Text>
          <Text> Beneficiary Address: { this.props.beneficiaryAddress } </Text>
          <Text> Beneficiary Country: {this.props.beneficiaryCountry} </Text>
          <Text> Postal Code: {this.props.postalCode} </Text>
          <Text> Street Number: {this.props.streetNumber} </Text>
          <Text> Street Name: {this.props.streetName} </Text>
          <Text> City: {this.props.city} </Text>
      </View>
    )

    const summary = (<View>{ this.props.showUsSummary ? otSummary : ( this.props.showEurSummary ? eurSummary : 
      (
        <View>
          <Text >Full Name: {this.props.firstName} {this.props.lastName} </Text>
          <Text> Bank Name: {this.props.bankName} </Text>
          <Text> Account Number: {this.props.accountNumber}</Text>
          <Text> Country: {this.props.country} </Text>
          <Text> Email: {this.props.email} </Text>
        </View>
      )
      )}</View>)

    const otherCountriesOption = (
    <List>
      <ListItem>
        <Button transparent onPress= { this.props.us}>
          <Text>United State of Amenrica</Text>
        </Button>
      </ListItem>
      <ListItem>
        <Button transparent onPress={ this.props.eur }>
          <Text>European Countries</Text>
        </Button>
      </ListItem>
      <ListItem>
        <Button transparent onPress={this.props.ot }>
          <Text>Other Countries</Text>
        </Button>
      </ListItem>
    </List>
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
          {/* <Text note>You can also transfer directly to other banks if your country is not listed here.</Text> */}
          {/* <TouchableOpacity>
            <Text note style={{ color: 'blue'}}>Direct transfer</Text>
          </TouchableOpacity> */}
          <Body>
            <Text style={{ color: 'red'}}>{this.props.errMessage}</Text>
          </Body>
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
                  <Picker.Item label="Other Countries" value="Other Countries" />
              </Picker>
          </Item>
          ) : null }
          { this.props.otherCountries ? otherCountriesOption : null }

          { this.props.showOt ? showOt : null }
          {this.props.showUs  ? showUs : null }
          { this.props.showEur ? showEur : null }

          { this.props.showBankList ? showBankList : null }
          { this.props.isGhana ? showGhanaBranchList : null }

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
                visible={this.props.modalVisible}
                modalTitle={<ModalTitle title="Message" />}
                modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
                })}
                onTouchOutside= { this.props.onTouchOutside }
                width
                footer={
                  <ModalFooter>
                    <ModalButton
                      text="Exit"
                      onPress={this.props.onTouchOutside }
                    />
                  </ModalFooter>
                }
              >
                <ModalContent >
                  <View style= {{ padding : 12 }}>
                    <Text >{ this.props.message }</Text>
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
  branchList: PropTypes.object.isRequired,
  selectBank : PropTypes.func.isRequired,
  otherCountries : PropTypes.bool.isRequired,
  ot: PropTypes.func.isRequired,
  us: PropTypes.func.isRequired,
  eur: PropTypes.func.isRequired,
  showOt: PropTypes.bool.isRequired,
  showUs : PropTypes.bool.isRequired,
  showEur : PropTypes.bool.isRequired,
  handleRoutingNumber: PropTypes.func.isRequired,
  handleSwiftCode: PropTypes.func.isRequired,
  handleBeneficiaryAddress: PropTypes.func.isRequired,
  swiftCode: PropTypes.string.isRequired,
  routingNumber: PropTypes.string.isRequired,
  beneficiaryAddress: PropTypes.string.isRequired,
  handleBeneficiaryCountry: PropTypes.func.isRequired,
  handleCity: PropTypes.func.isRequired,
  handlePostalCode: PropTypes.func.isRequired,
  handleStreetName: PropTypes.func.isRequired,
  handleStreetNumber: PropTypes.func.isRequired,
  handleInternationalBankName: PropTypes.func.isRequired,
  internationalBankName: PropTypes.string.isRequired,
  beneficiaryCountry: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  streetName: PropTypes.string.isRequired,
  streetNumber: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  showUsSummary : PropTypes.bool.isRequired,
  showEurSummary : PropTypes.bool.isRequired,
  isGhana: PropTypes.bool.isRequired,
  branch: PropTypes.string.isRequired,
  selectBranch: PropTypes.func.isRequired,
  errMessage: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onTouchOutside: PropTypes.func.isRequired,

}