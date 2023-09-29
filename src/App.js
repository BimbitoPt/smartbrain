import React, { Component } from "react";
import Navigation from "./Components/Navigation/Navigation";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Logo from "./Components/Logo/Logo";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import Clarifai from "clarifai";
import "./App.css";
import "tachyons";
import ParticlesBg from "particles-bg";

const app = new Clarifai.App({
  apiKey: "be7ea216185f4272bbaf15b9869eb7b9",
}); 

const returnClarifaiRequestOptions=(imageUrl)=>{
 const PAT = '855f5da30efa48cfb79b1c44d09fc3a1';
 const USER_ID = 'bimbito';       
 const APP_ID = 'SmartBrainApi';
 const IMAGE_URL = imageUrl;

 const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});
return {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};
}

const initialState ={
  input: '',
  imageUrl:'',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user : { 
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };



  calculateFaceLocation = (data) => {
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height =  Number(image.height);
   return{
    leftCol:clarifaiFace.left_col * width,
    topRow:clarifaiFace.top_row * height,
    rightcol:width - (clarifaiFace.right_col * width) ,
    bottomRow:height -(clarifaiFace.bottom_row * height)
   }

  }

  displayFaceBox = (box) => {
    this.setState({ box : box });

  }

  onPictureSubmit = () => {

    this.setState({imageUrl:this.state.input});
    app.models
      .predict(
        'face-detection',
         this.state.input
      )
        
      // eslint-disable-next-line no-useless-concat
      fetch("https://api.clarifai.com/v2/models/" + 'face-detection' +  "/outputs", returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(response=>{
        if(response){
          fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
          })
        }).then(response => response.json()).then(count => {
          this.setState(
            Object.assign(this.state.user,{entries: count})
          )
        })
        .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err));
  };

  onRouteChange= (route) =>{
    if (route === 'signout') {
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route : route});
  }
  render() {
    return (
      <div className="App">
        <ParticlesBg type="polygon" bg={true} className="particles" />
        <Navigation isSignedin={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home' 
        ?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onPictureSubmit={this.onPictureSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :(
          this.state.route === 'signin' ?
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser={this.loadUser}onRouteChange={this.onRouteChange}/>
        )
        }
        

      </div>
    );
  }
}

export default App;
