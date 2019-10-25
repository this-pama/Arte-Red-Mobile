import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Right,Form, Item, Label,
    Text, Button, Icon, Title, Segment, Input, Textarea, Spinner, DatePicker, Switch,
Footer, FooterTab, Left, Body,  } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler, View} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class EditExhibitionScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          like: 0,
          comment: 0,
          register: "Register",
          exhibition: {},
          fetch: false,
          title: "",
            address: "",
            name: "",
            email: "",
            short: "",
            long: "",
            country: "",
            capacity: 0,
            time: 0,
            switch: false,
            date: new Date(),  
            errMessage: "",
            disable: true,
            spin: false,
        }
      }

      componentWillUnmount() {
        this.backHandler.remove();
      }
      
      async componentDidMount(){
        const id= this.props.navigation.getParam("id", null )

        var url = apiUrl + "exhibition/" + id;
        var result = await fetch(url, {
          method: 'GET',
          headers: { 
            'content-type': 'application/json',
            "Authorization": `Bearer ${this.props.jwt}`
          }
        });
        var response = await result;
        if(response.status !== 200 ){
          console.warn("fetching exhibition failed response")
          this.setState({
            exhibition: {}
          })
          
          return
        }
        else{
          var res = await response.json();
          if (res._id) {
            this.setState({
              exhibition: res,
              title: res.title,
            address: res.address,
            name: res.organizerName,
            email: res.email,
            short: res.shortDescription,
            long: res.longDescription,
            country: res.country,
            capacity: res.capacity,  
            fetch: true
            })
          }

          else  {
            console.warn("Can't get exhibition")
            this.setState({
              exhibition: {}
            })
            
          }
        }

        // handle hardware back button press
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          this.props.navigation.navigate("Landing")
          return true;
        });

      }

      handleTitle = title => {
        if (title.length > 0) {
          this.setState(
            {
              title
            },
            this.validateForm
          );
        } else {
          this.setState({
            title: '',
            errMessage: 'Title cannot be empty'
          });
        }
      };

      handleDate = (newDate) => {
        this.setState({ date: newDate.toString().substr(4, 12) },
        this.validateForm );
      }


      handleAddress = address => {
        if (address.length > 0) {
          this.setState(
            {
              address
            },
            this.validateForm
          );
        } else {
          this.setState({
            address: '',
            errMessage: 'Address cannot be empty'
          });
        }
      };

      handleCountry = country => {
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
      };

      handleShort = short => {
        if (short.length > 0) {
          this.setState(
            {
              short
            },
            this.validateForm
          );
        } else {
          this.setState({
            short: '',
            errMessage: 'Give a short description'
          });
        }
      };

      handleLong = long => {
        if (long.length > 0) {
          this.setState(
            {
              long
            },
            this.validateForm
          );
        } else {
          this.setState({
            long: '',
            errMessage: 'Give a full description'
          });
        }
      };

      handleEmail = email => {
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
      };

      handleCapacity = capacity => {
        if (capacity.length > 0 && +capacity > 0) {
          this.setState(
            {
              capacity
            },
            this.validateForm
          );
        } else {
          this.setState({
              capacity: 0,
            errMessage: 'What is your Exhibition Capacity?'
          });
        }
      };

      handleTime = time => {
        let hour
        if(this.state.switch){
          hour = 12
        }
        else{
          hour = 0
        }
        if (time.length > 0 && +time > 0) {
          let dayTime = time + hour
          this.setState(
            {
              time : dayTime
            },
            this.validateForm
          );
        } else {
          this.setState({
              time: 0,
            errMessage: 'Please specify time'
          });
        }
      };

    handleName = name => {
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
            errMessage: 'Organizer Name cannot be empty'
          });
        }
      };
    
      handleSwitch= ()=>{
        if(!this.state.switch){
          this.setState({
            switch: true
          }, this.validateForm )
        }
        else{
          this.setState({
            switch: false
          })
        }
      }

      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.title.length > 0 &&
          this.state.email.length > 0 &&
          this.state.name.length > 0 &&
          this.state.date.length > 0 &&
          this.state.capacity > 0 &&
          this.state.address.length > 0 &&
          this.state.country.length > 0 &&
          this.state.short.length > 0 &&
          this.state.long.length > 0 &&
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

      create = async () => {
        // console.warn(base64)
        this.setState({ spin: true })
          var url = apiUrl + "exhibition/" + this.props.navigation.getParam("id", null );
          var result = await fetch(url, {
            method: 'PUT',
            headers: { 
                'content-type': 'application/json',
                "Authorization": `Bearer ${this.props.jwt}`
         },
            body: JSON.stringify({
              title: this.state.title,
              address: this.state.address,
              shortDescription : this.state.short,
              longDescription: this.state.long,
              country: this.state.country,
              capacity: this.state.quantity,
              time: this.state.time,
              organizerName: this.state.name,
              date: this.state.date,
              email: this.state.email,
            })
          });
          var response = await result;
          // console.warn(await result)
          if(response.status !== 200 ){
            console.warn("failed response")
            this.setState({
                errMessage: "Error while creating Exhibition",
                spin: false
            });
          }
          else{
            var res = await response.json();
            // console.warn(res)
            if (res._id) {
              this.setState({
                title: "",
                address: "",
                name: "",
                email: "",
                short: "",
                long: "",
                country: "",
                capacity: 0,
                date: "", 
                image: "",
                spin: false,
              });
              
              this.props.navigation.navigate("MyExhibition")
            } 
            else  {
              console.warn("failed ")
              this.setState({
                errMessage: "Creating Exhibition Failure",
                spin: false
              });
            }
          }
          
      };

      
  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: "#990000",paddingTop: 50, paddingBottom: 40 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Exhibition") }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Edit Exhibition</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="md-photos" />
            </Button>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
        <Content>
          <Card style={{flex: 0}}>
            <CardItem cardBody>
              <Image source={{ uri: this.state.exhibition.imageUrl } } style={{height: 300, width: null, flex: 1}}/>
            </CardItem>
          </Card>
          <Body>
            <Text note style={{ color: "red"}}>{this.state.errMessage} </Text>
            </Body>
          <Form>
                    <Item stackedLabel>
                        <Label>Title</Label>
                        <Input onChangeText= { this.handleTitle  } value={this.state.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Address</Label>
                        <Input onChangeText= { this.handleAddress } value={this.state.address}  autoCapitalize='words'/>
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
                          onDateChange={this.handleDate}
                          disabled={false}
                          />
                    </Item>
                    <Item >
                        <Label>Time</Label>
                        {/* <Left> */}
                        <Input onChangeText= { this.handleTime } value={this.state.time} keyboardType='numeric'  />
                        {/* </Left> */}
                        <Right>
                          <Button transparent
                            onPress={ this.handleSwitch}
                          >
                            <Text>AM</Text>
                            <Switch value={this.state.switch} onPress={this.handleSwitch}/>
                            <Text>PM</Text>
                          </Button>
                        </Right>
                    </Item>
                    <Item stackedLabel>
                        <Label>Short Description</Label>
                        <Input onChangeText= { this.handleShort } value={this.state.short} autoCapitalize='words'  />
                    </Item>
                      <Textarea rowSpan={5} bordered 
                        placeholder="Write a full description about about the exhibition."
                        value={this.state.long}
                        onChangeText={ this.handleLong}
                      />
                    <Item stackedLabel>
                        <Label>Country</Label>
                        <Input onChangeText= { this.handleCountry} value={this.state.country }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Exhibition Capacity</Label>
                        <Input onChangeText= { this.handleCapacity} value={this.state.capacity }  keyboardType="numeric"/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Name</Label>
                        <Input onChangeText= { this.handleName } value={this.state.name }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Organizer Email</Label>
                        <Input onChangeText= { this.handleEmail } value={this.state.email }  autoCapitalize='words'/>
                    </Item>
                    
                </Form>
                {/* </KeyboardAvoidingView> */}
                <View style={{ paddingBottom : 25 }}>
                <Button block danger
                  disabled={this.state.disable}
                  onPress={this.create}
                >
                    {
                      this.state.spin ? <Spinner color="white" /> 
                    : <Text> Edit Exhibition </Text>
                    }
                </Button>
                </View>
        </Content>
        </KeyboardAwareScrollView>
        <Footer>
        <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical
              onPress={()=> this.props.navigation.navigate("MyExhibition")} >
              <Icon active name="md-photos"  />
              <Text>My Exhibition</Text>
            </Button>
          
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(EditExhibitionScreen)