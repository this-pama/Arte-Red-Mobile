import React, { Component } from 'react'
import Post from "../screen/post"

export default class PostController extends Component{
    constructor(props){
        super(props);
        this.state={
            title: "",
            artistName: "",
            size: "",
            story: "",
            location: "",
            price: "",
            year: "",
            number: "",
            category: "",
            masterpiece: "",
            errMessage: "",
            disable: true
        }
    }

    post= async () => {

        this.props.navigation.navigate("Home")
        // var url = '';
        // var result = await fetch(url, {
        //   method: 'POST',
        //   headers: { 'content-type': 'application/json' },
        //   body: JSON.stringify({
        //     email: this.state.email,
        //     password: this.state.password
        //   })
        // });
        // var response = await result;
        // var res = await response.json();

    };
    
    handleTitle = title => {
        if (title.length > 0) {
          this.setState(
            {
              title,
              errMessage: ""
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

      handleArtistName = artistName => {
        if (artistName.length > 0) {
          this.setState(
            {
              artistName,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            artistName: '',
            errMessage: 'Artist Name cannot be empty'
          });
        }
      };


      handleSize = size => {
        if (size.length > 0) {
          this.setState(
            {
              size,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            size: '',
            errMessage: 'Size cannot be empty'
          });
        }
      };

      handleStory = story => {
        if (story.length > 0) {
          this.setState(
            {
              story,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            story: '',
            errMessage: 'Art Description/ Story cannot be empty'
          });
        }
      };

      handleLocation = location => {
        if (location.length > 0) {
          this.setState(
            {
              location,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            location: '',
            errMessage: 'Location cannot be empty'
          });
        }
      };

      handlePrice = price => {
        if (price.length > 0) {
          this.setState(
            {
              price,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            price: '',
            errMessage: 'Price cannot be empty'
          });
        }
      };

      handleYear = year => {
        if (year.length > 0) {
          this.setState(
            {
              year,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            year: '',
            errMessage: 'Year cannot be empty'
          });
        }
      };

      handleNumber = number => {
        if (number.length > 0) {
          this.setState(
            {
              number,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            number: '',
            errMessage: 'Number cannot be empty'
          });
        }
      };

      handleCategory = category => {
            if (category){
                this.setState({
                    category,
                    errMessage: ""
                })
            }else{
            this.setState({
                errMessage : "Select a category"
            })
            }
      
        }

        handleMasterpiece = masterpiece => {
            if (userType){
                this.setState({
                    masterpiece,
                    errMessage: ""
                })
            }else{
            this.setState({
                errMessage : "Select a masterpiece option"
            })
            }
      
        }


      validateForm = () => {
        if (
          this.state.title.length > 0 && 
          this.state.story.length > 0 
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


    render(){
        return(
            <Post
                title= { this.state.title }
                artistName= { this.state.artistName }
                size= { this.state.size }
                story= { this.state.story }
                location= { this.state.location }
                price= { this.state.price }
                year= { this.state.year }
                number= { this.state.number }
                category= { this.state.category }
                masterpiece= { this.state.masterpiece }
                disable= { this.state.disable }
                handleTitle= { this.handleTitle }
                handleArtistName= { this.handleArtistName }
                handleSize= { this.handleSize }
                handleStory= { this.handleStory }
                handleLocation= { this.handleLocation }
                handlePrice= { this.handlePrice }
                handleYear= { this.handleYear }
                handleNumber= { this.handleNumber }
                handleCategory={ this.handleCategory }
                handleMasterpiece= { this.handleMasterpiece }
                post= { this.post }
                navigation= {this.props.navigation}
            />
        )
    }
}