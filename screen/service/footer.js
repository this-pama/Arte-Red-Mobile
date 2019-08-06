import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
export default class FooterTabs extends Component {
  render() {
    return (
      
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical>
              <Icon name="apps" />
              <Text>Me</Text>
            </Button>
            <Button vertical>
              <Icon name="camera" />
              <Text>Post</Text>
            </Button>
            <Button vertical active>
              <Icon active name="wallet" />
              <Text>Wallet</Text>
            </Button>
            <Button vertical>
              <Icon name="people" />
              <Text>Network</Text>
            </Button>
          </FooterTab>
        </Footer>
      
    );
  }
}