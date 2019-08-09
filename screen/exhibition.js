import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button, Icon, Title, Segment } from 'native-base';
import FooterTabs from "./service/footer"
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ExhibitionScreen extends Component {
  render() {
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000"}}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()}>
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
          <Button first active onPress={()=> this.props.navigation.navigate("")}>
            <Text>Recent Exhibition</Text>
          </Button>
          <Button  onPress={()=> this.props.navigation.navigate("")}>
            <Text>Create Exhibition</Text>
          </Button>
        </Segment>
        <Content padder>
          <Text> No exhibition yet </Text>
        </Content>
        <FooterTabs 
          activeExhibition= { true }
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}