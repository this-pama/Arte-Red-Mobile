import React, { Component } from 'react';
import { Container, Header, Content, Left, Body, Right, Form, Item, Label,
 Text, Button, Icon, Title, Segment, Input, Textarea, Spinner, DatePicker } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from "react-native"
export default class CreateExhibitionScreen extends Component {
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

      const routeName = this.props.navigation.getParam("routeName", "Home")
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate(routeName)}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Exhibition</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="eye" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first onPress={()=> this.props.navigation.navigate("Exhibition")}>
            <Text>Recent Exhibition</Text>
          </Button>
          <Button active  onPress={()=> this.props.navigation.navigate("")}>
            <Text>Create Exhibition</Text>
          </Button>
        </Segment>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
        <Content padder style={{ paddingBottom: 20 }}>
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
        </Content>
        </KeyboardAwareScrollView>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

CreateExhibitionScreen.propTypes={
  title: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  short : PropTypes.string.isRequired,
  long: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  capacity: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleTitle: PropTypes.func.isRequired,
  handleAddress: PropTypes.func.isRequired,
  handleShort: PropTypes.func.isRequired,
  handleLong: PropTypes.func.isRequired,
  handleCountry: PropTypes.func.isRequired,
  handleCapacity: PropTypes.func.isRequired,
  handleName: PropTypes.func.isRequired,
  handleDate: PropTypes.func.isRequired,
  handleEmail: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  disable : PropTypes.bool.isRequired,
  spin : PropTypes.bool.isRequired,
  errMessage: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  pickImage: PropTypes.func.isRequired,
}