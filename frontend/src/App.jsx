import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import RegistrationForm from './components/RegistrationForm';
import UsersList from './components/UsersList';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '20px'
    }}>
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Register
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users List
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </Container>
    </Router>
    </Box>
  );
}

export default App;