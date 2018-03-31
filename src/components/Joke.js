import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap';


function Punchline(props){
   if (props.showResult){
      return (
         <div>
            <h5>{props.punch} HA! HA! HA!</h5>
            {!props.calledAnother ?
            <Button id={props.index} color="secondary" onClick={() => {props.getAnotherClicked(props.index)}}>Show Another</Button>
            : null}
      </div>
      )
   }else{
      return null;
   }
}

function JokeSetup(props){
   return (
      <Card body inverse style={{ backgroundColor: '#85144b', borderColor: '#85144b' }}>
         {props.jokeLoaded ?
            <span>
               <CardTitle>Joke About {props.jokeType.charAt(0).toUpperCase() + props.jokeType.slice(1)}</CardTitle>
               <CardText>{props.jokeSetup}</CardText>
               {/* <Button color="info" onClick={props.showClicked}>TELL ME</Button> */}
            </span>
            :
            <CardTitle>Getting a Joke</CardTitle>
         }
         {props.showResult ?
            <div> </div>
            :
            <Button color="info" onClick={() => { props.showClicked(props.index) }}>TELL ME</Button>
         }
      </Card>
   )
}



class Joke extends Component {

   constructor(props){
      super(props);

      this.state = {
         jokeLoaded: false,
         objResult: {},
         error: null,
         allJokes: []
      }
      //without this binding, showClicked calling this.setState is not avaialble
      this.showClicked = this.showClicked.bind(this);
      this.getAnotherClicked = this.getAnotherClicked.bind(this);
      //only need to bind the things needed (outside, so to speak)
   }

   showClicked(key){
      console.log("clicked on show", this.state.allJokes[key]);
      let updateJokes = this.state.allJokes;
      updateJokes[key].showResult = true;
      this.setState({
         allJokes: updateJokes
      });
   }

   getAnotherClicked(key){
      let updateJokes = this.state.allJokes;
      updateJokes[key].calledAnother = true;
      this.setState({
         jokeLoaded: false,
         error: null,
         allJokes: updateJokes
      }, this.getJoke());
      //ensure state is updated before calling a new joke
   }

   componentDidMount() {
      //lifecycle hook
      console.log("componentDidMount");
      this.getJoke();
   }

   getJoke(){
      fetch("https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke")
      .then(res => res.json())
      .then(
         (result) => {
            console.log("result", result);
            //update state
            //react way - make a copy of state and then update the state
            const updatedJokes = { ...this.state.allJokes };
            //make unique key with timestamp
            const timestamp = Date.now();
            result.showResult = false;
            result.calledAnother = false;
            updatedJokes[`joke-${timestamp}`] = result;

            //set state
            //using object will focus on the state that has changed
            this.setState({
               jokeLoaded: true,
               allJokes: updatedJokes
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
      const { error, jokeLoaded, allJokes } = this.state;
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
               {/*React way - take object, convert to key array, map to result */}
               {Object
                  .keys(allJokes)
                  .map((key) =>
                     <div key={key}>
                        <JokeSetup index={key} jokeLoaded={jokeLoaded}
                           jokeSetup={allJokes[key].setup}
                           jokeType={allJokes[key].type}
                           showResult={allJokes[key].showResult}
                           showClicked={this.showClicked} />
                        <Punchline
                           index={key}
                           showResult={allJokes[key].showResult}
                           punch={allJokes[key].punchline}
                           calledAnother={allJokes[key].calledAnother}
                           getAnotherClicked={this.getAnotherClicked} />
                     </div>
                  )
               }
               {/*The react way - pass the key as a different prop for your usage*/}
               {/*The key is for react's use*/}
            </div>
         )
      }
   };
}

export default Joke;
