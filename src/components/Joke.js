import React, { useState, useEffect } from 'react';
import Punchline from './Punchline';
import { getJoke } from './APICalls';
import { JokeSetup } from './JokeSetup';
import { Button } from 'reactstrap'

export function Joke() {
  const [jokeLoaded, setJokeLoaded] = useState(false);
  const [theJoke, setTheJoke] = useState({});
  const [showPunchline, setShowPunchline] = useState(false);
  const [error, setError] = useState(null);

  // flow notes
  // component load and should show "loading"
  // then call to get joke
  // handle the error also
  // when joke shows up, display JokeSetup with tellme button
  // click on tellme, tellme should go away and
  // punchline should show along with "get new joke"

  const handlePunchline = () => {
    setShowPunchline(true);
  }

  const handleGetAnother = () => {
    setJokeLoaded(false);
    setTheJoke({});
    setShowPunchline(false);
    setError(null)
    loadAnother();
  }


  const loadAnother = () => {
    getJoke()
      .then(response => {
        setTheJoke(response);
        setJokeLoaded(true);
      })
      .catch((error) => {
        // console.error("Error fetching data: ", error);
        setError(error);
      })
  }

  const showView = () => {
    if (error) {
      return (
        <div>
          <div>Error: {error.message}</div>
          <Button color="info" onClick={handleGetAnother}>Try Again</Button>
        </div>
      );
    } else if (!jokeLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="box-container">
          <JokeSetup jokeLoaded={jokeLoaded}
            setup={theJoke.setup}
            jokeType={theJoke.category}
            showPunchline={showPunchline}
            handlePunchline={handlePunchline} />
          {showPunchline &&
            <Punchline
              showPunchline={showPunchline}
              punchline={theJoke.delivery}
              handleGetAnother={handleGetAnother} />
          }
        </div>
      )
    }
  }

  useEffect(() => {
    loadAnother()
  }, []);


  return (
    <>
      {showView()}
    </>
  )
}