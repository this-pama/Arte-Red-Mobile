import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
export default class FooterTabs extends Component {
  render() {
    return (
      
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical active>
              <Icon name="apps" />
              <Text>Me</Text>
            </Button>
            <Button vertical onPress= {this.props.post}>
              <Icon name="camera" />
              <Text>Post</Text>
            </Button>
            <Button vertical >
              <Icon active name="wallet" />
              <Text>Wallet</Text>
            </Button>
            <Button vertical onPress={()=> this.props.navigation.navigate("Network")}>
              <Icon name="people" />
              <Text>Network</Text>
            </Button>
          </FooterTab>
        </Footer>
      
    );
  }
}