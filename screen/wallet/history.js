import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
export default class History extends Component {
  render() {
      if(this.props.withdraws.length < 1){
          return (<Body><Text>No Withraw history</Text></Body>)
      }
      else{
            return (
                <List>
                    <ListItem >
                    <Body>
                        <Text>Withraw</Text>
                        <Text note>Full Name</Text>
                        <Text note>Account Number</Text>
                        <Text note>Bank</Text>
                        <Text note>Amount</Text>
                    </Body>
                    <Right>
                        <Text note>Date</Text>
                    </Right>
                    </ListItem>
                </List>
            );
        }
  }
}