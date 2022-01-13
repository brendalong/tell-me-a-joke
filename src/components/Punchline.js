import React from 'react';
import { Button } from 'reactstrap';

//functional component
// JS function that accepts props and returns something
export default function Punchline({ punchline, handleGetAnother, showPunchline }) {
  if (showPunchline) {
    return (
      <div id="punchline">
        <h5>{punchline} HA! HA! HA!</h5>
        <Button color="secondary" onClick={handleGetAnother}>Show Another</Button>
      </div>
    )
  } else {
    return null;
  }
}