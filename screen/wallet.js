import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class WalletScreen extends Component {
  render() {
    return (
      <Container>
        <Header  style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>My Wallet</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="wallet" />
            </Button>
          </Right>
        </Header>
        <Grid>
          <Col style={{ backgroundColor: "#e60000", height: 150}}>
            <Body style={{ color: "#ffffff", justifyContent: "center", alignItems: "center",  alignContent: "center" }}>
                    <Icon name="cash" style={{color: "#ffffff" }} />
                    <Text style={{color: "#ffffff", fontWeight: "bold" }}>Total Earning</Text>
                    <Text style={{color: "#ffffff" }}>NGN 0</Text>
            </Body>
          </Col>
          <Col style={{ backgroundColor: "#cc0000", height: 150}}>
            <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }}>
                    <Icon name="cash" style={{color: "#ffffff" }} />
                    <Text style={{color: "#ffffff", fontWeight: "bold" }}>Balance</Text>
                    <Text style={{color: "#ffffff" }}>NGN 0</Text>
            </Body>
          </Col>
          <Col style={{ backgroundColor: "#e60000", height: 150 }}>
            <Body style={{ justifyContent: "center", alignItems: "center",  alignContent: "center", color: "#ffffff" }} >
                    <Icon  name="cash" style={{color: "#ffffff" }}/>
                    <Text style={{color: "#ffffff", fontWeight: "bold" }} > Ledger Balance</Text>
                    <Text style={{color: "#ffffff" }} >NGN 0</Text>
            </Body>
          </Col>
        </Grid>
        <Content style={{color: "#000000", padding: 10 }}>
            <List >
                <ListItem >
                    <Left style={{ paddingLeft: 20}}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate("Bank")
                            }}
                        >
                            <Icon name="add" />
                            <Text>Add my Bank Detail</Text>
                        </TouchableOpacity>
                    </Left>
                    <Right style={{ paddingRight: 20}}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate("Withdraw")
                            }}
                        >
                            <Icon name="open" />
                            <Text>Withdraw</Text>
                        </TouchableOpacity>
                    </Right>
                </ListItem>
            </List>
        </Content>
        <FooterTabs 
            activeWallet= { true }
            navigation={this.props.navigation}
        />
      </Container>
    );
  }
}