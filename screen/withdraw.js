import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Item, Picker,
Input, Form,  } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import {BackHandler} from "react-native"

export default class WithdrawScreen extends Component {
  componentDidMount() {
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Landing")
      return true;
    });

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <Container>
        <Header  style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Wallet")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Withdraw</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content style={{ paddingBottom: 20}}>
            <Button  block bordered danger 
                // disabled={this.props.disable}
                onPress={()=> alert("Token has been sent to your registered email.") }
            >
                <Text> Request Token </Text>
            </Button>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Form>
                    <Item stackedLabel>
                        <Label>Amount</Label>
                        <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Token</Label>
                        <Input onChangeText= { this.props.handleArtistName } value={this.props.artistName}  autoCapitalize='words'/>
                    </Item>
                    
                </Form>
                
            </KeyboardAvoidingView>

            <Button  block danger 
                // disabled={this.props.disable}
                onPress={()=> this.props.navigation.navigate("Wallet") }
            >
                <Text> Withdraw </Text>
            </Button>
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