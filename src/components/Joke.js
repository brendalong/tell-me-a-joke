import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

function Punchline(props){
   if (props.showResult){
      return (
         <div>
            <h5>{props.punch} HA! HA! HA!</h5>
            <Button color="secondary" onClick={props.getAnotherClicked}>Show Another</Button>
         </div>
      )
   }else{
      return null;
   }
}

function JokeSetup(props){

   const showMeJoke = props.jokeLoaded ?
      <span>
         <CardTitle>Joke About {props.jokeType.charAt(0).toUpperCase() + props.jokeType.slice(1)}</CardTitle>
         <CardText>{props.jokeSetup}</CardText>
         {/* <Button color="info" onClick={props.showClicked}>TELL ME</Button> */}
      </span>
      :
      <CardTitle>Getting a Joke</CardTitle>;

   const showTellMeButton = props.showResult ?
      <div> </div> : <Button color="info" onClick={props.showClicked}>TELL ME</Button>

   // could create components for showMeJoke and showTellMeButton
   return (
      <Card body inverse style={{ backgroundColor: '#85144b', borderColor: '#85144b' }}>
         {showMeJoke}
         {showTellMeButton}
      </Card>
   )
}



class Joke extends Component {

   constructor(props){
      super(props);

      this.state = {
         jokeLoaded: false,
         objResult: {},
         showResult: false,
         error: null
      }
      //without this binding, showClicked calling this.setState is not avaialble
      this.showClicked = this.showClicked.bind(this);
      this.getAnotherClicked = this.getAnotherClicked.bind(this);
      //only need to bind the things needed (outside, so to speak)
   }

   showClicked(){
      console.log("clicked on show")
      this.setState({
         showResult: true
      });
   }

   getAnotherClicked(){
      console.log("getAnother");
      this.setState({
         jokeLoaded: false,
         objResult: {},
         showResult: false,
         error: null
      }, this.getJoke());
      //ensure state is updated before calling a new joke
   }

   componentDidMount() {
      //lifecycle hook
      console.log("componentDidMount");
      this.getJoke();
   }

   getJoke(){
       fetch("https://official-joke-api.appspot.com/random_joke")
      .then(res => res.json())
      .then(
         (result) => {
            console.log("result", result);
            this.setState({
               jokeLoaded: true,
               objResult: result,
            });
         },
         // Note: it's important to handle errors here
         // instead of a catch() block so that we don't swallow
         // exceptions from actual bugs in components.
         (error) => {
            this.setState({
               isLoaded: true,
               error: error
            });
         }
      )
   }





   // flow notes
   // component load and should show "loading"
   // then call to get joke
   // handle the error also
   // when joke shows up, display JokeSetup with tellme button
   // click on tellme, tellme should go away and
   // punchline should show along with "get new joke"

   //render called each time state changes
   render () {
      const { error, jokeLoaded, objResult, showResult } = this.state;
      if (error) {
         return (
            <div>
               <div>Error: {error.message}</div>
               <button onClick={this.getAnotherClicked}>Try Again</button>
            </div>
         );
      } else if (!jokeLoaded) {
         return <div>Loading...</div>;
      } else {
         return (
            <div className="box-container">
               <JokeSetup jokeLoaded={jokeLoaded}
               jokeSetup={objResult.setup}
               jokeType={objResult.type}
               showResult={showResult}
               showClicked={this.showClicked}/>
               <Punchline
               showResult={showResult}
               punch={objResult.punchline}
               getAnotherClicked={this.getAnotherClicked} />
            </div>
         )
      }
   };
}

export default Joke;
