import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, 
    Toast, Button, Icon, Title, Segment } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ProfileScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            follow : "Follow"
        }
    }
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
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Segment style={{  backgroundColor: "#cc0000"}}>
          <Button first active >
            <Text>Profile</Text>
          </Button>
          <Button  onPress={()=> this.props.navigation.navigate("ProfileArtwork")}>
            <Text>Collection</Text>
          </Button>
        </Segment>
        <Content padder>
          <List>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={ require('../../assets/splash.png') } />
                </Left>
                <Body>
                  <Text>Artist Full Name</Text>
                  <Text note>Artist Nick Name</Text>
                  <Text note>User Type</Text>
                  <Text note>Country</Text>
                </Body>
                <Right>
                  <TouchableOpacity
                    onPress={()=> {
                        if(!this.props.userId){
                            Toast.show({
                                text: "You need to sign in to follow",
                                buttonText: "Okay",
                                duration: 3000,
                                type: 'danger'
                              })
                        }
                        else if(this.state.follow === "Follow"){
                            this.setState({ follow : "Following"})
                        }
                        else{
                            this.setState({ follow : "Follow"})
                        }
                    }}
                  >
                    <Text style={{ color: "blue" }} note>{this.state.follow}</Text>
                  </TouchableOpacity>
                </Right>
              </ListItem>
              <ListItem>
                 <Text note>This is about the Artist. This is about the Artist. This is about the Artist.</Text>
              </ListItem>
              <ListItem>
                  <Left>
                      <Text note>
                        Following {!this.props.following ? 0 : this.props.following}
                      </Text>
                  </Left>
                  <Right>
                    <Text note>
                        {!this.props.follower ? 0 : this.props.follower} Followers
                      </Text>
                  </Right>
              </ListItem>
              <ListItem>
                  <Left>
                    <TouchableOpacity>
                        <Text note>
                            To be determined
                         </Text>
                    </TouchableOpacity>
                  </Left>
                  <Right>
                    <TouchableOpacity 
                        onPress={()=>{
                            if(!this.props.userId){
                                Toast.show({
                                    text: "You need to sign in to send messages",
                                    buttonText: "Okay",
                                    duration: 3000,
                                    type: 'danger'
                                  })
                            }
                        }}
                    >
                        <Text note style={{ color: "blue"}}>
                            Send Message
                         </Text>
                    </TouchableOpacity>
                  </Right>
              </ListItem>
            </List>
        </Content>
      </Container>
    );
  }
}