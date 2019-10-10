import React, { Component } from 'react';
import { Container, Header, Content, Left, Body, Right, Form, Item, Label,
 Text, Button, Icon, Title, Segment, Input, Textarea, Spinner, DatePicker } from 'native-base';
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView, BackHandler, View } from "react-native"

export default class SubmitAuctionScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      register: "Register",
    }
  }


  render() {
      const imagePlaceholder =(
        <Image source={{uri: this.props.image }}
            style={{height: 300, width: null, flex: 1}}
        />
      )
    return (
              <View>
                <Item>
                  <Body>
                    <Text note style={{ color: "red"}}>{this.props.errMessage} </Text>
                  </Body>
                  <Right>
                    <Button transparent
                        onPress={this.props.pickImage }
                    >  
                      <Icon name="camera" active />
                        <Text> Upload Image </Text>
                    </Button>
                  </Right>
                </Item>
                {this.props.image  ? imagePlaceholder : null }
                {/* <KeyboardAvoidingView behavior="padding"> */}
                <Form>
                    <Item stackedLabel>
                        <Label>Title</Label>
                        <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Address</Label>
                        <Input onChangeText= { this.props.handleAddress } value={this.props.address}  autoCapitalize='words'/>
                    </Item>
                    <Item >
                    <DatePicker
                          defaultDate={new Date()}
                          minimumDate={new Date(2018, 1, 1)}
                          maximumDate={new Date(2030, 12, 31)}
                          locale={"en"}
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={"fade"}
                          androidMode={"default"}
                          placeHolderText="Select date"
                          textStyle={{ color: "green" }}
                          placeHolderTextStyle={{ color: "#000000" }}
                          onDateChange={this.props.handleDate}
                          disabled={false}
                          />
                    </Item>
                    <Item stackedLabel>
                        <Label>Short Description</Label>
                        <Input onChangeText= { this.props.handleShort } value={this.props.short} autoCapitalize='words'  />
                    </Item>
                      <Textarea rowSpan={5} bordered 
                        placeholder="Write a full description about about the exhibition."
                        value={this.props.long}
                        onChangeText={this.props.handleLong}
                      />
                    <Item stackedLabel>
                        <Label>Country</Label>
                        <Input onChangeText= {this.props.handleCountry} value={this.props.country }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Exhibition Capacity</Label>
                        <Input onChangeText= {this.props.handleCapacity} value={this.props.capacity }  keyboardType="numeric"/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Name</Label>
                        <Input onChangeText= {this.props.handleName } value={this.props.name }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Email</Label>
                        <Input onChangeText= {this.props.handleEmail } value={this.props.email }  autoCapitalize='words'/>
                    </Item>
                    
                </Form>
                {/* </KeyboardAvoidingView> */}
                <Button block danger
                  disabled={this.props.disable}
                  onPress={this.props.create}
                >
                    {
                      this.props.spin ? <Spinner color="white" /> 
                    : <Text> Create Exhibition </Text>
                    }
                </Button>
        </View>
        
    );
  }
}