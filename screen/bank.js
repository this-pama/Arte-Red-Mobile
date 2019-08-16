import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Item, Picker,
Input, Form,  Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from "prop-types"

export default class BankScreen extends Component {
  render() {
    const add = <Text> Add Bank </Text>
    const spinner = <Spinner color="white" />
    return (
      <Container>
        <Header  style={{ backgroundColor: "#990000"}}>
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
        <Content style={{ paddingBottom: 20}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Form>
                    <Item stackedLabel>
                        <Label>First Name</Label>
                        <Input onChangeText= {this.props.handleFirstname  } value={this.props.firstName}  autoCapitalize='words'/>
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
                    <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            placeholder="Bank Name"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.props.bankName}
                            onValueChange={ this.props.handlebankName }
                        >
                            <Picker.Item label="Bank Name" value="Bank Name" />
                            <Picker.Item label="GTB" value="GTB" />
                            <Picker.Item label="Access Bank" value="Access Bank" />
                            <Picker.Item label="First Bank" value="First Bank" />
                            <Picker.Item label="Fidelity" value="Fidelity" />
                        </Picker>
                    </Item>
                </Form>
                
            </KeyboardAvoidingView>

            <View style={{ padding : 10}}>
              <Button  block danger 
                  disabled={this.props.disable}
                  onPress={this.props.addBank }
              >
                  {this.props.spin ? spinner : add }
              </Button>
            </View>
        </Content>
        
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
  handleFirstname: PropTypes.func.isRequired,
  handleLastName: PropTypes.func.isRequired,
  handleAccountNumber: PropTypes.func.isRequired,
  handlebankName: PropTypes.func.isRequired,
  handleEmail: PropTypes.func.isRequired,
  addBank: PropTypes.func.isRequired
}