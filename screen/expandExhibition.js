import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Title, Right, Text, Button, Icon, Left, Body,
 Toast, View } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ExpandExhibitionScreen extends Component {

    constructor(props){
        super(props);
        this.state={
          like: 0,
          comment: 0,
          register: "Register"
        }
      }

  render() {
      const story = this.props.navigation.getParam("story")
      const title= this.props.navigation.getParam("title")
      const year = this.props.navigation.getParam("year")
      const artistName = this.props.navigation.getParam("artistName")
      const location = this.props.navigation.getParam("location")
      const size = this.props.navigation.getParam("size")
      const category = this.props.navigation.getParam("category")
      const available = this.props.navigation.getParam("available")
      const price = this.props.navigation.getParam("price")
    return (
      <Container>
        <Header style={{ backgroundColor: "#990000",paddingTop: 40, paddingBottom: 30 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Exhibition") }>
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
        <Content>
          <Card style={{flex: 0}}>
          <CardItem>
              <Left>
                <Body>
                  <Text>{!title ? "Organizer" : title}</Text>
                  <Text note>{!year ? "Country" : year}</Text>
                </Body>
              </Left>
              <Right>
                <Body>
                    <Text note >{!artistName ? "Address" : artistName}</Text>
                  <Text note>{!location ? "Date" : location}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: "https://res.cloudinary.com/artered/image/upload/v1565393034/ykxz7pqmbr8qtxinfoea.jpg"} } style={{height: 300, width: null, flex: 1}}/>
            </CardItem>
            <CardItem >
                <Text>
                  This is the full detail of the exhition
                </Text>
            </CardItem>
            <View style={{ paddingTop: 30 }} >
                <Button block danger
                  onPress={()=>{
                      if(process.env.NODE_ENV === 'development'){
                          this.setState({
                              register: "Registered"
                          })
                      }
                    else if(!this.props.userId){
                        Toast.show({
                          text: "You need to sign in to register",
                          buttonText: "Okay",
                          duration: 3000,
                          type: 'danger'
                        })
                    }
                    else{
                        this.setState({
                          register: "Registered"
                        })
                    }
                  }} >
                  <Text>{this.state.register}</Text>
                </Button>
            </View>
          </Card>
        </Content>
      </Container>
    );
  }
}