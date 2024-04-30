import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Form} from 'react-bootstrap';
import { useState, useEffect} from 'react';

const CLIENT_ID = "45864a2fa1574d1384e83d91c7905ff3";
const CLIENT_SECRET = "9b2f998e987b476e902479da5d47d0fd";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Busca
  async function search() {
    console.log("Search for " + searchInput);

    if(searchInput == ""){
      window.location.reload();
    }

    //Get request using search to get the Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log("Artist ID is " + artistID);

    //Get request with Artist ID, grab All the albums from that Artist
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=BR&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });

    //Display those albums to the user

  }

  console.log(albums);

  return (
    <div className="App">
      <Container>

        <InputGroup className="my-3" size="lg">
          <FormControl 
            placeholder="Busque por Artistas"
            type="input"
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />

          <Button type="button" className="btn btn-success" onClick={() => {search()}}>
            Buscar
          </Button>
            
          
        </InputGroup>
      </Container>

      <Container>

        <Row className="mx-3 row row-cols-5">
     
          {albums.map( (album, i) =>{
            console.log(album);
            return (
              <Card className="my-4 mx-4">
                <a href={album.uri} target="_blank"><Card.Img className="my-2" src={album.images[0].url} /></a>
                <Card.Body>
                  <Card.Title>
                    <a href={album.external_urls.spotify} target="_blank" className="text-secondary link-underline-opacity-0link-offset-2 link-underline link-underline-opacity-0" >
                    {album.name}
                    </a>
                  </Card.Title>
                </Card.Body>
              </Card>
            )
          })}

        
        

        </Row>

      </Container>

    </div>
  );
}

export default App;
