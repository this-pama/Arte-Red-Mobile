import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Form,
    Label, Item, Input, Text, Button, Icon, Left, Body, Toast, Spinner, Footer, FooterTab } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { raveAction } from "../redux/raveAction"
import {apiUrl} from "./service/env"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Lightbox from "react-native-lightbox"
import { SliderBox } from 'react-native-image-slider-box';
import {BackHandler, View } from "react-native"
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';

class BuyScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      artwork: {},
      quantity: 1,
      firstName: "",
      lastName: "",
      email: "",
      total: 0,
      price: 0,
      fetch: false, 
      disable: true,
      modalVisible: false,
      message: '',
      negotiationData: ''
    }
  }

    async componentDidMount(){
      this.setState({
        artwork: {}
      })

      var url = apiUrl + "artwork/" + this.props.navigation.getParam("artworkId", null );
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        console.warn("fetching artworks failed response")
        this.setState({
          artwork: {}
        })
        
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          //check if there is negotiation record id
          if(res.negotiationId && res.negotiationId.length > 0){
            //get the record of all negotaition
            this.getNegotiationDetails(res.negotiationId)
            this.setState({
              artwork: res,
              price: res.price,
              // fetch: true
            })
          }
          else{
            this.setState({
              artwork: res,
              price: res.price,
              fetch: true
            })
          }
        }

        else  {
          console.warn("Can't get artwork")
          this.setState({
            artwork: {}
          })
          
        }
      }
      // handle hardware back button press
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.navigate("Negotiation", {
          routeName: "Buy", 
          artworkId: this.props.navigation.getParam("artworkId", null )
        })
        return true;
      });

    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    getNegotiationDetails= async negotiationId =>{
      var url = apiUrl + "negotiation/" + negotiationId;
      let userId = this.props.userId;
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          // "Authorization": `Bearer ${this.props.jwt}`
         }
      })
        var response = await result
        var res = await response.json();
        if (res._id) {
          console.warn('negotiationDate', res)
          let index = res.history.findIndex(function checkUser(user) {
            return user.userId == userId && user.accept
          })
          //find userId of user in negotiation data
          if(res.history && index >= 0 ){

            let price = res.history[index].askingPrice;
            this.setState({
              price
            })
            
          }

          this.setState({
            negotiationData : res,
            fetch: true
          })
        }
        else  {
          console.warn("Can't get negotiation data")  
          this.setState({
            fetch: true,
            negotiationData: {}
          })
          return    
        }

  }


    handleFirstName = firstName => {
      if (firstName.length > 0) {
        this.setState(
          {
            firstName
          },
          this.validateForm
        );
      } else {
        this.setState({
          firstName: '',
          errMessage: 'First Name cannot be empty'
        });
      }
    };

    handleLastName = lastName => {
      if (lastName.length > 0) {
        this.setState(
          {
            lastName
          },
          this.validateForm
        );
      } else {
        this.setState({
          lastName : '',
          errMessage: 'Last Name cannot be empty'
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

    handleQuantity = quantity => {
      let available =  this.state.artwork.numberAvailable - this.state.artwork.quantitySold 
      if(this.state.artwork.quantitySold >= this.state.artwork.numberAvailable){
        this.setState({
          disable: true,
          modalVisible: true,
          message: "This Artwork is Sold Out",
        })
      }
      else if(+quantity > available ){
        // alert("Quantity selected is above availble quantity.")
        this.setState({ quantity: 1, disable: true,
          modalVisible: true,
          message: "Quantity selected is above availble quantity",
         })
        return 
      }
      else if (+quantity) {
        this.setState(
          {
            quantity,
            total: quantity * this.state.price
          },
          this.validateForm
        );
      } else {
        this.setState({
          quantity: 1 ,
          total: 1 * this.state.price
        });
      }
    };


    validateForm = () => {
      let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (
        // this.state.firstName.length > 0 && 
        // this.state.lastName.length > 0 &&
        // this.state.email.length > 0 && 
        // testEmail.test(this.state.email) &&
        this.state.quantity > 0 &&
        this.state.total > 0
        
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
    const routeName= this.props.navigation.getParam("routeName", "Home")
    if(!(this.state.fetch)){
      return(
        <Container>
        <Header style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Negotiation", {
                routeName: "Buy", 
                artworkId: this.props.navigation.getParam("artworkId", null )
              })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Buy Artwork</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Body >
          <Spinner color="red" />
          </Body>
        </Content>
      </Container>
      )
    }
    else{
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Negotiation", {
                routeName: "Buy", 
                artworkId: this.props.navigation.getParam("artworkId", null )
              })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Buy Artwork</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="cash" />
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
          <CardItem>
              <Left>
                <Body>
                  <Text>{!this.state.artwork.title ? "Unknown Title" : this.state.artwork.title}</Text>
                  <Text note>{!this.state.artwork.year ? "Unknown Year" : this.state.artwork.year}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                  <TouchableOpacity>
                    <Text note>{!this.state.artwork.artistName ? "Artist Unknown" : this.state.artwork.artistName}</Text>
                  </TouchableOpacity>
                  <Text note >{!this.state.artwork.location ? "Location Unknown" : this.state.artwork.location }</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem>
            {typeof(this.state.artwork.imageURL) == 'object' ?
              (
                <SliderBox
                      images={this.state.artwork.imageURL}
                      sliderBoxHeight={200}
                      // onCurrentImagePressed={index =>
                      //     console.warn(`image ${index} pressed`)
                      // }
                      dotColor="red"
                      inactiveDotColor="#90A4AE"
                />
              )
              : 
              (
                <Lightbox>
                  <Image 
                    source={{ uri: this.state.artwork.imageURL } } 
                    style={{height: 200, width: null, flex: 1}}
                    resizeMode="contain"
                  />
                </Lightbox>
              )
              }
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="pricetag" />
                  <Text>{this.state.artwork.currency} {!this.state.price ? "0" : this.state.price}</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent textStyle={{color: '#87838B'}}>
                  {/* <Icon name="stat" /> */}
                  <Text>Quantity {!this.state.artwork.numberAvailable ? "1" : this.state.artwork.numberAvailable}</Text>
                </Button>
              </Body>
              <Right>
                <Button transparent>
                  <Text>{this.state.artwork.quantitySold >= this.state.artwork.numberAvailable ? "Sold Out" : `${this.state.artwork.numberAvailable - this.state.artwork.quantitySold} Available`}</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          <KeyboardAwareScrollView>
          <Form style={{ paddingTop: 20, paddingBottom: 20}}>
            <Text style={{fontWeight: "bold", paddingLeft: 40}}>Total Cost</Text>
            <Text note style={{ paddingLeft: 40 }}>{ this.state.artwork.currency } {this.state.total}</Text>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Quantity</Label>
              <Input keyboardType="numeric"
                onChangeText={this.handleQuantity}
                value={+this.state.quantity}
               />
            </Item>
            {/* <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>First Name</Label>
              <Input  onChangeText={this.handleFirstName } value={this.state.firstName} />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Last Name</Label>
              <Input onChangeText={this.handleLastName} value={this.state.lastName} />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Email</Label>
              <Input onChangeText={this.handleEmail} value={ this.state.email } />
            </Item> */}
          </Form>
          <View style={{ padding: 20}} >
          <Button block danger
            disabled={ this.state.disable }
            onPress={async ()=> {
               if(!this.props.userId){
                Toast.show({
                  text: "You need to sign in to buy the artwork",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
              else{ 
                await this.props.raveAction({
                  total: `${this.state.total}`,
                  quantity: this.state.quantity,
                  artworkId: this.state.artwork._id,
                  currency: this.state.artwork.currency,
                  userId: this.props.userId,
                  // firstName: this.state.firstName,
                  // lastName: this.state.lastName,
                  // email: this.state.email
                })
                this.props.navigation.navigate("Rave") 
              }
            }}
          >
              <Text>Proceed To Payment</Text>
          </Button>
          </View>
          </KeyboardAwareScrollView>
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
              onPress={()=> this.props.navigation.navigate("Negotiation", {
                routeName: "Buy", 
                artworkId: this.props.navigation.getParam("artworkId", null )
              })} >
              <Icon name="cash" />
              <Text>Negotiation</Text>
            </Button>
          
          </FooterTab>
        </Footer>

         {/* modalVisisble */}
         <Modal
        visible={this.state.modalVisible}
        modalTitle={<ModalTitle title="Message" />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside= { () => {
          this.setState({ modalVisible: false });
        }}
        width
        footer={
          <ModalFooter>
            <ModalButton
              text="Exit"
              onPress={() => this.setState({ modalVisible: false })}
            />
          </ModalFooter>
        }
      >
        <ModalContent >
          <View style= {{ padding : 12, paddingBottom: 30 }}>
            <Body>
              <Text >{ this.state.message }</Text>
            </Body>
          </View>
        </ModalContent>
      </Modal>

      </Container>
    );}
  }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  profile: state.userProfile,
  artworkId: state.buyArtwork.id,
  rave: state.rave
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
    getUserProfileAction, buyArtworkAction, raveAction  })(BuyScreen )