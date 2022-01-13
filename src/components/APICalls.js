function CheckError(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}


export const getJoke = () => {
  return fetch("https://v2.jokeapi.dev/joke/Any?type=twopart&safe-mode")
    .then(CheckError)
    .then(response => response)

}