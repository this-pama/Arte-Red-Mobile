import React, { Component } from 'react';
import { Container, Header, Content, Left, Body, Right, Form, Item, Label,
 Text, Button, Icon, Title, Segment, Input, Textarea, Spinner, DatePicker, Picker } from 'native-base';
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView, BackHandler, View } from "react-native"
import { apiUrl, cloudinaryUrl } from "./env"
import {connect} from 'react-redux'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';

export default class SubmitAuctionScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      verificationCode: '',
      artworkName: '',
      artistName:'',
      category: '',
      description: '',
      duration: '',
      country: '',
      price: '',
      name: '',
      email: '',
      year: '',
      size: '',
      currency: "NGN",
      disable: true,
      image: "",
      imageUrl: "",
      base64: "",
      spin: false
    }
  }

  componentDidMount() {
    this.getPermissionAsync();
  }
  
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to post!');
        }
    }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.3,
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, base64: result.base64 })
    }

    if(!result.base64){
      return alert("There seams to be an error with the image")
     }
  }

  postImageToCloud = ()=> {
    this.setState({ spin : true })
      let base64Img = `data:image/jpg;base64,${this.state.base64}`
         let data = {
           "file": base64Img,
           "upload_preset": "artered",
         }
 
         fetch(cloudinaryUrl, {
           body: JSON.stringify(data),
           headers: {
             'content-type': 'application/json'
           },
           method: 'POST',
         })
         .then(async r => {
             let data = await r.json()
             this.setState({ imageUrl : data.secure_url })
             this.create(data.secure_url)
           })
         .catch(err=>console.log(err))
  }

  create = async (base64) => {
    // console.warn(base64)
      var url = apiUrl + "auction/" + this.props.userId;
      var result = await fetch(url, {
        method: 'POST',
        headers: { 
            'content-type': 'application/json',
            // "Authorization": `Bearer ${this.props.jwt}`
     },
        body: JSON.stringify({
          verificationCode: this.state.verificationCode,
          title: this.state.artworkName,
          artistName: this.state.artistName,
          category: this.state.category,
          description: this.state.description,
          duration: this.state.duration,
          location: this.state.location,
          price: this.state.price,
          organizerName: this.state.name,
          organizerEmail: this.state.organizerEmail,
          year: this.state.year,
          size: this.state.size,
          currency: this.state.currency,
          imageUrl: base64,
          userId: this.props.userId,
          spin: false
        })
      });
      var response = await result;
      // console.warn(await result)
      if(response.status !== 200 ){
        console.warn("failed response")
        this.setState({
            errMessage: "Error while submitting Auction request",
            spin: false
        });
      }
      else{
        var res = await response.json();
        // console.warn(res)
        if (res._id) {
          this.setState({
            verificationCode: '',
            title: '',
            artistName: '',
            category: '',
            description: '',
            duration: '',
            location: '',
            price: '',
            organizerName: '',
            organizerEmail: '',
            year: '',
            size: '',
            currency: '',
            imageUrl: '',
            spin: false,
          });
          
          // this.props.navigation.navigate("Exhibition")
        } 
        else  {
          console.warn("failed ")
          this.setState({
            errMessage: "Error while submitting Auction request",
            spin: false
          });
        }
      }
      
  };


  artworkName = artworkName => {
    if (artworkName.length > 0) {
      this.setState(
        {
          artworkName
        },
        this.validateForm
      );
    } else {
      this.setState({
        artworkName: '',
        errMessage: 'Arwork Name cannot be empty'
      });
    }
  }

  artistName = artistName => {
    if (artistName.length > 0) {
      this.setState(
        {
          artistName
        },
        this.validateForm
      );
    } else {
      this.setState({
        artistName: '',
        errMessage: 'Artist Name cannot be empty'
      });
    }
  }

  verificationCode = verificationCode => {
    if (verificationCode.length > 0) {
      this.setState(
        {
          verificationCode
        },
        this.validateForm
      );
    } else {
      this.setState({
        verificationCode: '',
        errMessage: 'Verification Code cannot be empty'
      });
    }
  }

  category = category => {
    if (category.length > 0) {
      this.setState(
        {
          category
        },
        this.validateForm
      );
    } else {
      this.setState({
        category: '',
        errMessage: 'Category of Artwork cannot be empty'
      });
    }
  }

  description = description => {
    if (description.length > 0) {
      this.setState(
        {
          description
        },
        this.validateForm
      );
    } else {
      this.setState({
        description: '',
        errMessage: 'Description cannot be empty'
      });
    }
  }

  duration = duration => {
    if (+duration) {
      this.setState(
        {
          duration
        },
        this.validateForm
      );
    } else {
      this.setState({
        duration: '',
        errMessage: 'Duration cannot be empty'
      });
    }
  }

  country = country => {
    if (country.length > 0) {
      this.setState(
        {
          country
        },
        this.validateForm
      );
    } else {
      this.setState({
        country: '',
        errMessage: 'Country cannot be empty'
      });
    }
  }

  price = price => {
    if (price.length > 0) {
      this.setState(
        {
          price
        },
        this.validateForm
      );
    } else {
      this.setState({
        price: '',
        errMessage: 'Price cannot be empty'
      });
    }
  }

  name = name => {
    if (name.length > 0) {
      this.setState(
        {
          name
        },
        this.validateForm
      );
    } else {
      this.setState({
        name: '',
        errMessage: 'Name cannot be empty'
      });
    }
  }

  email = email => {
    if (email.length > 0) {
      this.setState(
        {
          email
        },
        this.validateForm
      );
    } else {
      this.setState({
        email: '',
        errMessage: 'Email cannot be empty'
      });
    }
  }

  size = size => {
    if (size.length > 0) {
      this.setState(
        {
          size
        },
        this.validateForm
      );
    } else {
      this.setState({
        size: '',
        errMessage: 'Size cannot be empty'
      });
    }
  }

  year = year => {
    if (+year) {
      this.setState(
        {
          year
        },
        this.validateForm
      );
    } else {
      this.setState({
        year: '',
        errMessage: 'Year must be a number'
      });
    }
  }

  handleCurrency = currency => {
    if (currency){
        this.setState({
          currency,
            errMessage: ""
        })
    }
  }

  validateForm = () => {
    let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      this.state.duration.length > 0 &&
      this.state.email.length > 0 &&
      this.state.artistName.length > 0 &&
      this.state.artworkName.length > 0 &&
      this.state.price  &&
      this.state.category.length > 0 &&
      this.state.country.length > 0 &&
      this.state.description.length > 0 &&
      this.state.verificationCode.length > 0 &&
      testEmail.test(this.state.email) 
    ) {
      this.setState({
        disable: false,
        errMessage: ''
      });
    } else {
      this.setState({
        disable: true
      });
    }
  };



  render() {
      const imagePlaceholder =(
        <Image source={{uri: this.state.image }}
            style={{height: 300, width: null, flex: 1}}
        />
      )
    return (
      <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
              <Content>
                <Item>
                  <Text note style={{ color: "red"}}>{this.props.errMessage} </Text>
                  <Right>
                    <Button transparent
                        onPress={this.pickImage }
                    >  
                      <Icon name="camera" active />
                        <Text> Upload Image </Text>
                    </Button>
                  </Right>
                </Item>
                {this.state.image  ? imagePlaceholder : null }
                
                <Right>
                  <TouchableOpacity>
                    <Text style={{ color:'blue' }}>Process a Verification Code</Text>
                  </TouchableOpacity>
                </Right>
                <Form>
                    <Item stackedLabel>
                        <Label>Auction Verification Code</Label>
                        <Input onChangeText= {this.verificationCode} value={this.state.verificationCode}  autoCapitalize='words'/>
                    </Item>
                    
                    <Item stackedLabel>
                        <Label>Title</Label>
                        <Input onChangeText= {this.artworkName  } value={this.state.artworkName}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Artist Name</Label>
                        <Input onChangeText= {this.artistName  } value={this.state.artistName}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Category/Type of Artwork</Label>
                        <Input onChangeText= { this.category } value={this.state.category}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Year</Label>
                        <Input onChangeText= { this.year } value={this.state.year}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Size/Weight</Label>
                        <Input onChangeText= { this.size } value={this.state.size}  autoCapitalize='words'/>
                    </Item>
                    <Textarea rowSpan={5} bordered 
                        placeholder="Write a description about the artwork"
                        value={this.state.description}
                        onChangeText={this.description}
                    />
                    <Item stackedLabel>
                        <Label>Duration in hours for the Auction</Label>
                        <Input onChangeText= { this.duration } value={this.state.duration} keyboardType="numeric" />
                    </Item>      
                    <Item stackedLabel>
                        <Label>State/Country</Label>
                        <Input onChangeText= {this.country} value={this.state.country }  autoCapitalize='words'/>
                    </Item>
                    <Item picker>
                      <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            placeholder="Select Currency"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.currency}
                            onValueChange={ this.handleCurrency }
                        >
                            <Picker.Item label="Select Currency" value="Select Currency" />
                            <Picker.Item label="NGN" value="NGN" />
                            <Picker.Item label="USD" value="USD" />
                            <Picker.Item label="EURO" value="USD" />
                        </Picker>
                    </Item>
                    <Item stackedLabel>
                        <Label>Auction Starting Price</Label>
                        <Input onChangeText= {this.price } value={this.state.price }  keyboardType="numeric"/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Name</Label>
                        <Input onChangeText= {this.name } value={this.state.name }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Email</Label>
                        <Input onChangeText= {this.email } value={this.state.email }  autoCapitalize='words'/>
                    </Item>
                    
                </Form>
                
                <Button block danger
                  disabled={this.state.disable}
                  onPress={this.postImageToCloud}
                >
                    {
                      this.state.spin ? <Spinner color="white" /> 
                    : <Text> Submit Auction Request </Text>
                    }
                </Button>
              </Content>
        </KeyboardAwareScrollView>
    );
  }
}