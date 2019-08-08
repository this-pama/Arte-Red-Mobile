import React, { Component } from 'react';
import { Container, Header, Left, Button,Icon, Body,Title,Right,
Text, Label, Footer, Content, List, ListItem, Item, Picker,
Input, Form,  } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, KeyboardAvoidingView } from "react-native"
import FooterTabs from './service/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class BankScreen extends Component {
  render() {
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
                        <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Last Name</Label>
                        <Input onChangeText= { this.props.handleArtistName } value={this.props.artistName}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Account Number</Label>
                        <Input onChangeText= { this.props.handleSize } value={this.props.size}  keyboardType='numeric' />
                    </Item>
                    <Item stackedLabel>
                        <Label>Email</Label>
                        <Input onChangeText= { this.props.handleSize } value={this.props.size}  keyboardType='numeric' />
                    </Item>
                    <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            placeholder="Bank Name"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.props.category}
                            onValueChange={ this.props.handleCategory }
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

            <Button  block danger 
                // disabled={this.props.disable}
                onPress={()=> this.props.navigation.navigate("Wallet") }
            >
                <Text> Add Bank </Text>
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