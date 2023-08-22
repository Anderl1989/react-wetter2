import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [location, setLocation] = useState(localStorage.getItem('location') || '');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const search = async () => {
    try {
      const cleanLocation = encodeURIComponent(location.trim());
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cleanLocation}`);
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (location) {
      search();
    }
  }, []);

  return (
    <>
      <TextField
        label="Standort"
        onChange={(event) => {
          setLocation(event.target.value);
          localStorage.setItem('location', event.target.value);
        }}
        value={location}
      />
      <Button
        onClick={search}
      >
        Senden
      </Button>
      <List>
        {
          results.map((location) => {
            return (
              <ListItem key={location.id}>
                <ListItemButton
                  onClick={() => {
                    const lat = location.latitude.toString().replace('.', '_');
                    const lng = location.longitude.toString().replace('.', '_');
                    navigate(`/${lat}/${lng}`);
                  }}
                >
                  <ListItemText
                    primary={location.name}
                    secondary={location.admin1 ? `${location.admin1}, ${location.country}` : location.country}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        }
      </List>
    </>
  );
}
