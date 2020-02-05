import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { Container, Header, Content, Card, CardItem,Title, Thumbnail, Text, 
  Button, Icon, Left, Body, Right, CheckBox, ActionSheet, Footer, FooterTab,
Form, Label, Input, Picker, Item, Textarea, Spinner } from 'native-base';
import PropTypes from "prop-types"
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import Gallery from 'react-native-image-gallery';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler} from "react-native"
import { country, state } from './service/countries'

export default class PostScreen extends Component {
    constructor(props){
        super(props);
        this.state={
          isNegotiable: false,
          isNotNegotiable: false,
          initiateForm: false,
        }
    }

    componentDidMount() {
      this.getPermissionAsync();

      // handle hardware back button press
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.navigate(this.props.navigation.getParam("Home"))
        return true;
      });

    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to post!');
          }
      }
    }
    

    handleIsNegotiable =()=>{
      this.setState({
        isNegotiable: true,
        isNotNegotiable: false,
      })
    }

    handleIsNotNegotiable =()=>{
      this.setState({
        isNegotiable: false,
        isNotNegotiable: true,
      })
    }


  render() {
      const image = this.props.navigation.getParam("image")
      const spinner = <Spinner color="white" />
      const currency = ["NGN", "GHS", "KES", "UGX", "TZS", "USD", "GBP", "EUR", "AUD"]
      const currencyList = currency.map((currency, index) => (<Picker.Item key={index} label={`${currency}`} value={`${currency}`} /> ))
      const unit = ['Meter Square', "Litres"]
      const unitList = unit.map((unit, index) => (<Picker.Item key={index} label={`${unit}`} value={`${unit}`} /> ))
      const pickCountry = country.map((name,index) =>(
        <Picker.Item label={`${name}`} key={index}
            value={`${name}`}
        /> 
      ))
  
      const pickState = this.props.stateList.map((name,index) =>(
        <Picker.Item label={`${name}`} key={index}
            value={`${name}`}
        /> 
      ))

      const showcase=(
        <View>
          <View>
            <Left>
              <Item stackedLabel>
                  <Label>Size <Text style={{ color: 'red'}}>*</Text></Label>
                  <Input onChangeText= { this.props.handleSize } value={this.props.size}  keyboardType='numeric' />
              </Item>
            </Left>
            <Body>
            <Item >
                <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholder="Category"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.props.unit}
                    onValueChange={ this.props.selectUnit }
                >
                    <Picker.Item label="Select Unit" value="Select Unit" />
                    { unitList }
                </Picker>
            </Item>
            </Body>
          </View>
{/*           
          <Item stackedLabel>
              <Label>Breadth (inches)</Label>
              <Input onChangeText= { this.props.handleBreadth } value={this.props.breadth}  keyboardType='numeric' />
          </Item> */}
          {/* <Item stackedLabel>
              <Label>Location</Label>
              <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
          </Item> */}
          <Item stackedLabel>
              <Label>Year</Label>
              <Input onChangeText= { this.props.handleYear } value={this.props.year} keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Number Available <Text style={{ color: 'red'}}>*</Text></Label>
              <Input onChangeText= { this.props.handleNumber } value={this.props.number}  keyboardType='numeric'/>
          </Item>
          <Item >
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Category"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.props.category}
                  onValueChange={ this.props.handleCategory }
              >
                  <Picker.Item label="Pick a Category" value="Category" />
                  <Picker.Item label="Painting" value="Paint" />
                  <Picker.Item label="Scupture" value="Scupture" />
                  <Picker.Item label="Drawing" value="Drawing" />
                  <Picker.Item label="Textile" value="Textile" />
                  <Picker.Item label="Collage" value="Collage" />
                  <Picker.Item label="Prints" value="Prints" />
                  <Picker.Item label="Photography" value="Photography" />
                  <Picker.Item label="Art Installation" value="Art Installation" />
                  <Picker.Item label="Others" value="Others" />
              </Picker>
          </Item>
            <Item>
              <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.props.country}
                    onValueChange={ this.props.selectCountry }
                >
                  <Picker.Item label="Select Country"
                      value="Select Country"
                  /> 
                  { pickCountry }
                </Picker>
              </Item>
              { this.props.showState ? (
                <Item>
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.props.state}
                        onValueChange={ this.props.selectState }
                    >
                      <Picker.Item label="Select State"
                          value="Select State"
                      /> 
                      { pickState }
                  </Picker>
              </Item>
              ) : null }
              
          </View>
      )

      const showPriceView=(
        <View>
          { showcase }
          
          <Item >
            {
               this.props.otherCurrency ? (
                <View>
                    <Label>Currency <Text style={{ color: 'red'}}>*</Text></Label>
                    <Input onChangeText= {this.props.handleCurrency  } value={this.props.currency}  keyboardType= 'default' />
                </View>
              ) : (
                this.props.selectCurrency ? (
                  <Item picker>
                <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: 50 }}
                    placeholder="Select Currency"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.props.currency}
                    onValueChange={ this.props.selectCurrencyFunc }
                >
                    <Picker.Item label="Select Currency" value="Select Currency" />
                      { currencyList }
                    <Picker.Item label="Others" value="Others" />
                </Picker>
              </Item>
                ) : null 
              )
            }
            
          </Item>
          
          <Item stackedLabel>
              <Label>Price <Text style={{ color: 'red'}}>*</Text></Label>
              <Input onChangeText= { this.props.handlePrice } value={this.props.price} keyboardType='numeric'  />
          </Item>
          <Item style={{ padding: 15 }}>
            <Left>
                <Text>Is this price negotiable?</Text>
            </Left>
            <Body>
              <CheckBox checked={this.state.isNegotiable} onPress={this.handleIsNegotiable}/>
                <Text>Yes</Text>
            </Body>
            <Right>
              <CheckBox checked={this.state.isNotNegotiable} onPress={this.handleIsNotNegotiable} />
                <Text>No</Text>
            </Right>
          </Item>
          {this.state.isNegotiable ? (
            <Item >
              {/* <Label>Select maximum allowable negotiable percentage</Label> */}
                <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholder="Select maximum allowable negotiable percentage"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.props.negotiationPercentage}
                    onValueChange={ this.props.handleNegotiationPercentage }
                >
                    <Picker.Item label="Maximum allowable negotiation %" value={null} />
                    <Picker.Item label="10%" value="10" />
                    <Picker.Item label="20%" value="20" />
                    <Picker.Item label="30%" value="30" />
                    <Picker.Item label="40%" value="40" />
                    <Picker.Item label="50%" value="50" />
                </Picker>
            </Item>
            
          ) : null }

          <Item >
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Is it a Masterpiece"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.props.masterpiece}
                  onValueChange={ this.props.handleMasterpiece }
              >
                  <Picker.Item label="Is it a Masterpiece" value="Masterpiece" />
                  <Picker.Item label="Yes" value="Yes" />
                  <Picker.Item label="No" value="No" />
              </Picker>
          </Item>
          
          </View>
      )

      const standardForm = (
        <View>
          <Card>
            <CardItem cardBody>
            <SliderBox
                images={this.props.imagesToUpload}
                sliderBoxHeight={300}
                dotColor="red"
                inactiveDotColor="#90A4AE"
            />
            </CardItem>
            <CardItem>
              <Right>
                <Button transparent active 
                  onPress= {this.props.addMoreImage }
                >
                  <Icon name="add" />
                  <Text>Add More Image </Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          <Item stackedLabel>
              <Label>Title <Text style={{ color: 'red'}}>*</Text></Label>
              <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Artist Name</Label>
              <Input onChangeText= { this.props.handleArtistName } value={this.props.artistName}  autoCapitalize='words'/>
          </Item>
          <Textarea rowSpan={5} bordered 
              placeholder="Write a story about the artwork."
              value={this.props.story}
              onChangeText={this.props.handleStory}
          />
          <View style={{ padding : 20 }}>
            <Item >
              <Left>
                <CheckBox checked={this.props.forSale} onPress={this.props.handleForSale} />
                <Body>
                  <Text>For Sale</Text>
                </Body>
              </Left>
              <Body>
                <CheckBox checked={this.props.checkShowcase} onPress={this.props.handleShowcase} />
                <Body>
                  <Text>Showcase</Text>
                </Body>
              </Body>
              <Right>
                <CheckBox checked={this.props.progressShot} onPress={this.props.handleProgressShot} />
                <Body>
                  <Text>Progress Shot</Text>
                </Body>
              </Right>
            </Item>
          </View>
          
        </View>
        
      )

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Post An Artwork</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="megaphone" />
            </Button>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
        <Content>
          
          <Form>
            <Body><Text note style={{ color: "red", padding: 10 }}>{this.props.errMessage}</Text></Body>
              { this.props.initiateForm ? standardForm : null }
            {this.props.forSale ? showPriceView : null }
            {this.props.checkShowcase ? showcase : null }
          </Form>

          <View style={{ padding: 20}}>
            <Button  block danger 
                disabled={ this.props.progressShot ? ( this.props.title.length > 0 && this.props.story.length > 0 ? false : true) : 
                  this.props.checkShowcase ? ( this.props.title.length > 0 && this.props.story.length > 0 && this.props.size.length > 0 &&
                    this.props.category.length > 0 && this.props.country.length > 0   ? false : true) : 
                      this.props.forSale ? ( this.props.title.length > 0 && this.props.story.length > 0 && this.props.size.length > 0 &&
                        this.props.category.length > 0 && this.props.country.length > 0
                        ? false : true) : false
                    
                 }
                onPress={ this.props.post }
            >
                {this.props.spin ? spinner : <Text> Post </Text>}
            </Button>
          </View>         
        </Content>
        </KeyboardAwareScrollView>

        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Network")} >
              <Icon name="camera" />
              <Text>My Posts</Text>
            </Button>
          
          </FooterTab>
        </Footer>
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


PostScreen.propTypes= {
    title: PropTypes.string.isRequired,
    artistName: PropTypes.string,
    length: PropTypes.string,
    breadth: PropTypes.string,
    story: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
    year: PropTypes.string,
    number: PropTypes.string,
    category: PropTypes.string,
    masterpiece: PropTypes.string,
    errMessage: PropTypes.string,
    disable: PropTypes.bool,
    spin: PropTypes.bool,
    forSale: PropTypes.bool.isRequired,
    progressShot: PropTypes.bool.isRequired,
    checkShowcase: PropTypes.bool.isRequired,
    handleTitle: PropTypes.func.isRequired,
    handleArtistName: PropTypes.func.isRequired,
    handleSize: PropTypes.func.isRequired,
    handleStory: PropTypes.func.isRequired,
    handleLocation: PropTypes.func.isRequired,
    handlePrice: PropTypes.func.isRequired,
    handleNumber: PropTypes.func.isRequired,
    handleCategory: PropTypes.func.isRequired,
    handleMasterpiece: PropTypes.func.isRequired,
    post: PropTypes.func.isRequired,
    handleForSale: PropTypes.func.isRequired,
    handleProgressShot: PropTypes.func.isRequired,
    handleShowcase: PropTypes.func.isRequired,
    pickImage: PropTypes.func.isRequired,
    useCamera: PropTypes.func.isRequired,
    imagesToUpload: PropTypes.array.isRequired,
    negotiationPercentage: PropTypes.number,
    handleNegotiationPercentage : PropTypes.func,
    currency: PropTypes.string.isRequired,
    handleCurrency: PropTypes.func.isRequired,
    selectCurrencyFunc : PropTypes.func.isRequired,
    selectCurrency: PropTypes.bool.isRequired,
    otherCurrency: PropTypes.bool.isRequired,
    initiateForm: PropTypes.bool.isRequired,
    size: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    handleSize: PropTypes.func.isRequired,
    selectUnit: PropTypes.func.isRequired,
    country: PropTypes.string.isRequired,
    selectCountry: PropTypes.func.isRequired,
    selectState: PropTypes.func.isRequired,
    state : PropTypes.string.isRequired,
    showState: PropTypes.bool.isRequired,
    stateList: PropTypes.array.isRequired,
}