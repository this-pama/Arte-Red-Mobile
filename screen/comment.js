import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button, Icon, Title, Footer, 
    FooterTab, Form, Textarea, Item, Input } from 'native-base';

import { Modal, TouchableHighlight, View, Alert } from 'react-native';

export default class CommentScreen extends Component {
    state = {
        modalVisible: false,
      };
    
setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
}

  render() {
      const comments = this.props.navigation.getParam("comment")
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Comments</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail source={require('../assets/splash.png')} />
              </Left>
              <Body>
                <Text>Kumar Pratik</Text>
                <Text note>This is a comment...</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>

        <Footer>
          <FooterTab style={{ backgroundColor: "#fff"}}>
          <Button vertical
            onPress={() => {
                this.setModalVisible(true);
            }}
          >
                <Icon name="brush" />
                <Text>Write Comment</Text>
          </Button>
          </FooterTab>
        </Footer>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22, padding: 20 }} >
          <Button bordered danger
                onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                }}
            >
                <Text >Close</Text>
            </Button>
            <View>
                <Textarea rowSpan={5} bordered placeholder="Write your comment about the post " />
                <View style={{ paddingTop: 30}}>
                        <Button bordered warning
                            onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        >
                            <Text >Post</Text>
                        </Button>            
                </View>
            </View>
          </View>
        </Modal>


      </Container>
    );
  }
}