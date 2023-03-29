import { AppBar, Box, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useState } from 'react';

// props contiene
// @setUsername: setea el username definitivo a buscar que usaran los componentes
// de un nivel superior
const Navbar = (props) => {
  const DEFAULT_USERNAME = 'Peter Quinn1'
  const [username, setUsername] = useState(DEFAULT_USERNAME)

  const handleInputChange = (e) => {
    const { value } = e.target;
    setUsername(value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setUsername(username)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <b>Social Stego</b>
          </Typography>

          <Paper component="form" onSubmit={handleSubmit}>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1}}
              name="username"
              type="text"
              autoFocus
              variant="standard"
              placeholder="Ingresá un username"
              style = {{width: 300}}
              value={username}
              onChange={handleInputChange}
            />
          </Paper>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Walking Skeleton
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar;