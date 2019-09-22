import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { Container, Header, Content, Card, CardItem,Title, Thumbnail, Text, 
  Button, Icon, Left, Body, Right, CheckBox, ActionSheet,
Form, Label, Input, Picker, Item, Textarea, Spinner } from 'native-base';
import PropTypes from "prop-types"
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import Gallery from 'react-native-image-gallery';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler} from "react-native"


export default class PostScreen extends Component {
    constructor(props){
        super(props);
        this.state={
          isNegotiable: false,
          isNotNegotiable: false,
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

      const showcase=(
        <View>
        <Item stackedLabel>
              <Label>Length (inches)</Label>
              <Input onChangeText= { this.props.handleLength } value={this.props.length}  keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Breadth (inches)</Label>
              <Input onChangeText= { this.props.handleBreadth } value={this.props.breadth}  keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Location</Label>
              <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Year</Label>
              <Input onChangeText= { this.props.handleYear } value={this.props.year} keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Number Available</Label>
              <Input onChangeText= { this.props.handleNumber } value={this.props.number}  keyboardType='numeric'/>
          </Item>
          <Item picker>
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
                  <Picker.Item label="Paint" value="Paint" />
                  <Picker.Item label="Scupture" value="Scupture" />
                  <Picker.Item label="Photography" value="Photography" />
                  <Picker.Item label="Others" value="Others" />
              </Picker>
          </Item>
          </View>
      )

      const showPriceView=(
        <View>
        <Item stackedLabel>
              <Label>Length (inches)</Label>
              <Input onChangeText= { this.props.handleLength } value={this.props.length}  keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Breadth (inches)</Label>
              <Input onChangeText= { this.props.handleBreadth } value={this.props.breadth}  keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Location</Label>
              <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
          </Item>
          <Item picker>
            <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Currency"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.props.currency}
                  onValueChange={ this.props.handleCurrency }
              >
                  <Picker.Item label="NGN" value="NGN" />
                  <Picker.Item label="USD" value="USD" />
                  <Picker.Item label="EURO" value="USD" />
              </Picker>
          </Item>
          <Item stackedLabel>
              <Label>Price</Label>
              <Input onChangeText= { this.props.handlePrice } value={this.props.price} keyboardType='numeric'  />
          </Item>
          <Item style={{ paddingTop: 15, paddingBottom: 10 }}>
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
          {this.state.isNegotiable ?(
            <Item picker>
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
          <Item stackedLabel>
              <Label>Year</Label>
              <Input onChangeText= { this.props.handleYear } value={this.props.year} keyboardType='numeric' />
          </Item>
          <Item stackedLabel>
              <Label>Number Available</Label>
              <Input onChangeText= { this.props.handleNumber } value={this.props.number}  keyboardType='numeric'/>
          </Item>
          <Item picker>
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
                  <Picker.Item label="Paint" value="Paint" />
                  <Picker.Item label="Scupture" value="Scupture" />
                  <Picker.Item label="Photography" value="Photography" />
                  <Picker.Item label="Others" value="Others" />
              </Picker>
          </Item>
          <Item picker>
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
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000"}}>
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
          <Card>
            <CardItem cardBody>
            <SliderBox
                images={this.props.imagesToUpload}
                sliderBoxHeight={200}
                onCurrentImagePressed={index =>
                    console.warn(`image ${index} pressed`)
                }
                dotColor="red"
                inactiveDotColor="#90A4AE"
            />
              {/* <Gallery
                style={{ flex: 1, backgroundColor: 'black', height: 200, width: null,  }}
                images={this.props.imagesToUpload}
              /> */}
              {/* <ImageGallery items={this.props.imagesToUpload} /> */}
              {/* <Image source={{uri: `${image.uri}`}} style={{height: 300, width: null, flex: 1}}/> */}
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
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Form>
                  <Text note style={{ color: "red"}}>{this.props.errMessage}</Text>
                    <Item stackedLabel>
                        <Label>Title</Label>
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
                    <Item style={{ paddingTop: 15, paddingBottom: 10 }}>
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
                  {this.props.forSale ? showPriceView : null }
                  {this.props.checkShowcase ? showcase : null }
                </Form>
            </KeyboardAvoidingView>
          <View style={{ paddingTop: 20}}>
            <Button  block danger 
                disabled={this.props.disable}
                onPress={ this.props.post }
            >
                {this.props.spin ? spinner : <Text> Post </Text>}
            </Button>
          </View>         
        </Content>
        </KeyboardAwareScrollView>
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
}