import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,
List,ListItem, Badge, Right } from 'native-base';
export default class ChatDrawer extends Component {
  render() {
    return (
        <Content style={{ backgroundColor: "white"}}>
          <Card >
            <CardItem >
            <Image source={require('../../assets/logo.jpg')} style={{height: 30, width: null, flex: 1}}/>
            </CardItem>
          </Card>
          <List>
            <ListItem>
              <Body>
                <Text >Kumar Pratik</Text>
              </Body>
              <Right>
                  <Badge danger>
                    <Text>2</Text>
                  </Badge>
                
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text >Kumar Prat</Text>
              </Body>
              <Right>
                  <Badge danger>
                    <Text>1</Text>
                  </Badge>
                
              </Right>
            </ListItem>
          </List>
        </Content>
    );
  }
}