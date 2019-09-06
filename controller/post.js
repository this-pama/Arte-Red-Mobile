import React, { Component } from 'react'
import { ActionSheet} from "native-base"
import Post from "../screen/post"
import { cloudinaryUrl, apiUrl } from "../screen/service/env"
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import {connect} from 'react-redux'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';

var BUTTONS = ["Camera", "Gallery", "Close"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

class PostController extends Component{
    constructor(props){
        super(props);
        this.state={
            title: "",
            artistName: "",
            length: "",
            breadth: "",
            story: "",
            location: "",
            price: 0,
            year: "",
            number: "",
            category: "",
            masterpiece: "",
            imageUrl: [],
            errMessage: "",
            disable: true,
            spin: false,
            forSale: false,
            progressShot: true,
            checkShowcase: false,
            imageArray: [],
            imagesToUpload: [],
            isDoneUploading: false 
        }
    }

    componentDidMount(){
      const image = this.props.navigation.getParam("image")
      this.setState({
        imageArray : [ ... this.state.imageArray, image ],
        imagesToUpload: [... this.state.imagesToUpload, image.uri ]
      })
    }

    useCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.3,
        base64: true
      });

      if (!result.cancelled) {
        this.setState({
          imageArray : [ ... this.state.imageArray, result ],
          imagesToUpload: [... this.state.imagesToUpload, result.uri  ]
        })
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
        this.setState({
          imageArray : [ ... this.state.imageArray, result ],
          imagesToUpload: [... this.state.imagesToUpload, result.uri ]
        })
      }
    }

    addMoreImage = ()=>{
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: "Add More Artwork"
        },
        buttonIndex => {
          this.setState({ clicked: BUTTONS[buttonIndex] });
          if(BUTTONS[buttonIndex] === "Camera" ){
            this.useCamera()
          }
          else if(BUTTONS[buttonIndex] === "Gallery" ){
            this.pickImage()
          }
        }
      )
    }

    saveToDb = async () =>{
      let masterpiece
      if(this.state.masterpiece === "Yes"){
        masterpiece = true
      }
      else{
        masterpiece = false
      }

      var url = apiUrl + "artwork/add/" + this.props.userId;
      // console.warn("imageUrl",this.state.imageUrl)
      var result = await fetch(url, {
        method: 'POST',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         },
        body: JSON.stringify({
          title: this.state.title,
          size: `${this.state.length} x ${this.state.breadth}`,
          story: this.state.story,
          location: this.state.location,
          price: this.state.price,
          artistName: this.state.artistName,
          year: this.state.year,
          category: this.state.category,
          isMasterpiece: masterpiece,
          numberAvailable : this.state.number,
          imageURL : this.state.imageUrl,
          forSale: this.state.forSale,
          progressShot: this.state.progressShot,
          checkShowcase: this.state.checkShowcase
        })
      });
      var response = await result;

      if(response.status !== 200){
        console.warn(response)
        this.setState({ spin : false, errMessage: "Error occured while uploading" })
        // alert("Error occured while uploading")
      }
      else{
        var res = await response.json();
        console.warn(res)
        //check if saved sucessfully
        if(res.message == 'Artwork saved successfully' ){
          this.setState({
              title: "",
              artistName: "",
              size: "",
              story: "",
              location: "",
              price: 0,
              year: "",
              number: "",
              category: "",
              masterpiece: "",
         })
          return this.props.navigation.navigate("Home")
        }
        else{
          this.setState({ spin : false, errMessage: "Error occured while uploading" })
          // alert("Error while uploading")
        }
      }
      
    }

    post= async () => {
      this.setState({ spin: true })
        if(!this.state.imageArray[0].base64){
         return alert("There seams to be an error with the image")
        }

         await this.state.imageArray.forEach(async result =>{
          let base64Img = `data:image/jpg;base64,${result.base64}`
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
              this.setState({ imageUrl : [ ... this.state.imageUrl, data.secure_url] })
          })
          .then(()=>{
            if(this.state.imageUrl.length === this.state.imageArray.length){
              // console.warn("isDoneUploading")
              this.setState({ isDoneUploading : true })
            }
          })
          .then(()=>{
            //save to db 
            if(this.state.isDoneUploading){
              this.saveToDb()
            }
          })
          .catch(err=>console.warn(err))
        })

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


      handleLength = length => {
        if (length.length > 0) {
          this.setState(
            {
              length,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            length: '',
            errMessage: 'Length cannot be empty'
          });
        }
      };

      handleBreadth = breadth => {
        if (breadth.length > 0) {
          this.setState(
            {
              breadth,
              errMessage: ""
            },
            this.validateForm
          );
        } else {
          this.setState({
            breadth: '',
            errMessage: 'Breadth cannot be empty'
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
        if (price.length > 0 && +price) {
          this.setState(
            {
              price: +price,
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
            if (masterpiece){
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

        handleForSale =()=>{
          this.setState({
            forSale: true,
            progressShot: false,
            checkShowcase: false
          })
        }

        handleProgressShot =()=>{
          this.setState({
            forSale: false,
            progressShot: true,
            checkShowcase: false
          })
        }

        handleShowcase =()=>{
          this.setState({
            forSale: false,
            progressShot: false,
            checkShowcase: true
          })
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
                length= { this.state.length }
                breadth= {this.state.breadth}
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
                handleLength= { this.handleLength }
                handleBreadth= { this.handleBreadth }
                handleStory= { this.handleStory }
                handleLocation= { this.handleLocation }
                handlePrice= { this.handlePrice }
                handleYear= { this.handleYear }
                handleNumber= { this.handleNumber }
                handleCategory={ this.handleCategory }
                handleMasterpiece= { this.handleMasterpiece }
                post= { this.post }
                navigation= {this.props.navigation}
                spin={this.state.spin}
                errMessage= {this.state.errMessage}
                handleForSale= {this.handleForSale }
                handleProgressShot= { this.handleProgressShot}
                handleShowcase= { this.handleShowcase }
                forSale= { this.state.forSale }
                progressShot= { this.state.progressShot }
                checkShowcase= { this.state.checkShowcase }
                pickImage= { this.pickImage }
                useCamera= { this.useCamera }
                imagesToUpload= { this.state.imagesToUpload }
                addMoreImage= { this.addMoreImage }
            />
        )
    }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  accountId: state.login.accountId,
  userId: state.getUserId.userId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction })(PostController)