import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Form,
    Label, Item, Input, Text, Button, Icon, Left, Body, Toast, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { raveAction } from "../redux/raveAction"
import {apiUrl} from "./service/env"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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
      disable: true
    }
  }

    componentWillUnmount(){
      this.props.buyArtworkAction({})
    }

    async componentDidMount(){
      this.setState({
        artwork: {}
      })

      var url = apiUrl + "artwork/" + this.props.artworkId;
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
          // console.warn(res)
          this.setState({
            artwork: res,
            price: res.price,
            fetch: true
          })
        }

        else  {
          console.warn("Can't get artwork")
          this.setState({
            artwork: {}
          })
          
        }
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
      if(+quantity > this.state.artwork.numberAvailable){
        alert("Quantity selected is above availble quantity.")
        this.setState({ quantity: 1, disable: true })
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
        this.state.firstName.length > 0 && 
        this.state.lastName.length > 0 &&
        this.state.email.length > 0 && 
        testEmail.test(this.state.email) &&
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
            <Button transparent onPress={()=> 
              this.props.navigation.navigate(routeName)}>
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
            <Button transparent onPress={()=>
            this.props.navigation.navigate(routeName)}>
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
                  <Text>{!this.state.artwork.title ? "Title" : this.state.artwork.title}</Text>
                  <Text note>{!this.state.artwork.year ? "Year Unknown" : this.state.artwork.year}</Text>
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
              {/* <Body> */}
                <Image source={{uri : this.state.artwork.imageURL }} style={{height: 200, width: 400, flex: 1}} />
              {/* </Body> */}
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="pricetag" />
                  <Text>NGN {!this.state.artwork.price ? "0" : this.state.artwork.price}</Text>
                </Button>
              </Left>
              <Right>
                <Button transparent textStyle={{color: '#87838B'}}>
                  {/* <Icon name="stat" /> */}
                  <Text>Quantity {!this.state.artwork.numberAvailable ? "1" : this.state.artwork.numberAvailable}</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          <KeyboardAwareScrollView>
          <Form style={{ paddingTop: 20, paddingBottom: 20}}>
            <Text style={{fontWeight: "bold", paddingLeft: 40}}>Total Cost</Text>
            <Text note style={{ paddingLeft: 40 }}>NGN {this.state.total}</Text>
            <Item inlineLabel style={{ paddingLeft: 30}}>
              <Label>Quantity</Label>
              <Input keyboardType="numeric"
                onChangeText={this.handleQuantity}
                value={+this.state.quantity}
               />
            </Item>
            <Item inlineLabel style={{ paddingLeft: 30}}>
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
            </Item>
          </Form>
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
                  amount: `${this.state.total}`,
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  email: this.state.email
                })
                this.props.navigation.navigate("Rave") 
              }
            }}
          >
              <Text>Proceed To Payment</Text>
          </Button>
          </KeyboardAwareScrollView>
        </Content>
        </KeyboardAwareScrollView>
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