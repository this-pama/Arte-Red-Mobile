import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { Container, Header, Content, Card, CardItem,Title, Thumbnail, Text, Button, Icon, Left, Body, Right,
Form, Label, Input, Picker, Item, Textarea } from 'native-base';
import PropTypes from "prop-types"

export default class PostScreen extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
 
  render() {
      const image = this.props.navigation.getParam("image")
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
        <Content>
          <Card>
            <CardItem cardBody>
              <Image source={{uri: `${image.uri}`}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
          </Card>
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Form>
                    <Item stackedLabel>
                        <Label>Title</Label>
                        <Input onChangeText= {this.props.handleTitle  } value={this.props.title}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Artist Name</Label>
                        <Input onChangeText= { this.props.handleArtistName } value={this.props.artistName}  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Size (inches)</Label>
                        <Input onChangeText= { this.props.handleSize } value={this.props.size}  keyboardType='numeric' />
                    </Item>
                      <Textarea rowSpan={5} bordered 
                        placeholder="Write a story about the artwork."
                        value={this.props.story}
                        onChangeText={this.props.handleStory}
                      />
                    <Item stackedLabel>
                        <Label>Location</Label>
                        <Input onChangeText= {this.props.handleLocation } value={this.props.location }  autoCapitalize='words'/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Price</Label>
                        <Input onChangeText= { this.props.handlePrice } value={this.props.price} keyboardType='numeric'  />
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
                </Form>
            </KeyboardAvoidingView>
          <View style={{ paddingTop: 20}}>
            <Button  block danger 
                disabled={this.props.disable}
                onPress={ this.props.post }
            >
                <Text> Post </Text>
            </Button>
          </View>         
        </Content>
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
    size: PropTypes.string,
    story: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.string,
    year: PropTypes.string,
    number: PropTypes.string,
    category: PropTypes.string,
    masterpiece: PropTypes.string,
    disable: PropTypes.bool,
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
}