import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Picker, Icon } from 'native-base';
import {View, TouchableHighlight } from 'react-native'
import {KeyboardAvoidingView} from 'react-native';
import PropTypes from 'prop-types'

export default class SignUpScreen extends Component {
  render() {
    return (
      <Container style={{backgroundColor: "#e6e6e6",}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Content>
            <Form>
                <Item stackedLabel>
                    <Label>First Name</Label>
                    <Input onChangeText= { this.props.handleFirstName } value={this.props.firstName}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Last Name</Label>
                    <Input onChangeText= { this.props.handleLastName } value={this.props.lastName}  autoCapitalize='none' />
                </Item>
                <Item stackedLabel>
                    <Label>Nick Name</Label>
                    <Input onChangeText= { this.props.handleNickName } value={this.props.nickName}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Bio</Label>
                    <Input onChangeText= { this.props.handleBio } value={this.props.bio}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Email</Label>
                    <Input onChangeText= { this.props.handleEmail } value={this.props.email}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Address</Label>
                    <Input onChangeText= { this.props.handleAddress } value={this.props.address}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Country</Label>
                    <Input onChangeText= { this.props.handleCountry } value={this.props.country}  autoCapitalize='none'/>
                </Item>
                <Item stackedLabel>
                    <Label>Telephone</Label>
                    <Input onChangeText= { this.props.handleTelephone } value={this.props.telephone}  autoCapitalize='none'/>
                </Item>
                <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="User Category"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.props.userType}
                        onValueChange={ this.props.handleUserType }
                    >
                        <Picker.Item label="User Categories" value="Categories" />
                        <Picker.Item label="Artist" value="Artist" />
                        <Picker.Item label="Collector" value="Collector" />
                        <Picker.Item label="Curator" value="Curator" />
                        <Picker.Item label="Gallery" value="Gallery" />
                        <Picker.Item label="Organization" value="Organization" />
                        <Picker.Item label="Art lover" value="Art lover" />

                    </Picker>
                </Item>
                {/* <Item stackedLabel last>
                    <Label>User Type</Label>
                    <Input onChangeText= { this.props.handleUserType } value={this.props.userType}  autoCapitalize='none'/>
                </Item> */}
            </Form>
            
          <View style={{ paddingTop: 20}}>
            <Button  block danger 
                disabled={this.props.disable}
                onPress={()=> this.props.signUp }
            >
                <Text> Sign Up </Text>
            </Button>
            <TouchableHighlight 
                onPress={()=> this.props.navigation.navigate("Login")}
                style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Already have an account. Sign In!</Text>
            </TouchableHighlight>
          </View>         
        </Content>
        </KeyboardAvoidingView>
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

SignUpScreen.propTypes= {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    nickName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    telephone: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
    handleFirstName: PropTypes.func.isRequired,
    handleLastName: PropTypes.func.isRequired,
    handleNickName: PropTypes.func.isRequired,
    handleBio: PropTypes.func.isRequired,
    handleEmail: PropTypes.func.isRequired,
    handleAddress: PropTypes.func.isRequired,
    handleCountry: PropTypes.func.isRequired,
    handleTelephone: PropTypes.func.isRequired,
    handleUserType: PropTypes.func.isRequired,
    disable: PropTypes.bool.isRequired,
    signUp: PropTypes.func.isRequired
}