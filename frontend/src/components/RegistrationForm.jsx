import { useState } from 'react';
import Paper from '@mui/material/Paper';

import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    password: '',
    gender: '',
    about: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateForm = (values) => {
    const errors = {};

    if (!values.name || values.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!values.age || values.age < 0 || values.age > 120) {
      errors.age = 'Age must be between 0 and 120';
    }

    if (!values.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else if (new Date(values.dateOfBirth) > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/.test(values.password)) {
      errors.password = 'Password must be at least 10 characters and contain letters and numbers';
    }

    if (!values.gender) {
      errors.gender = 'Gender is required';
    }

    if (values.about && values.about.length > 5000) {
      errors.about = 'About must not exceed 5000 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
      return;
    }

    try {
      const formattedData = {
        ...formData,
        age: Number(formData.age),
        dateOfBirth: new Date(formData.dateOfBirth).toISOString()
      };

      const response = await axios.post('http://localhost:5000/api/users', formattedData);
      
      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: 'Registration successful!',
          severity: 'success'
        });
        setFormData({
          name: '',
          age: '',
          dateOfBirth: '',
          password: '',
          gender: '',
          about: ''
        });
        setTimeout(() => navigate('/users'), 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      if (error.response?.status === 400) {
        const fieldErrors = {};
        if (errorMessage.includes('name already exists')) {
          fieldErrors.name = 'This name is already taken';
        }
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

        <Paper 
    elevation={3} 
    sx={{ 
      padding: 4,
      borderRadius: 2,
      backgroundColor: 'white',
      marginBottom: 4
    }}
  >
      <Typography variant="h4" component="h1" gutterBottom  sx={{
        color: '#1976d2',
        textAlign: 'center',
        marginBottom: 4
      }}>
        User Registration
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField fullWidth required name="name" label="Name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} margin="normal" />
        <TextField fullWidth required name="age" label="Age" type="number" value={formData.age} onChange={handleChange} error={!!errors.age} helperText={errors.age} margin="normal" />
        <TextField fullWidth required name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField fullWidth required name="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} margin="normal" />
        <TextField fullWidth required select name="gender" label="Gender" value={formData.gender} onChange={handleChange} error={!!errors.gender} helperText={errors.gender} margin="normal">
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField fullWidth name="about" label="About" multiline rows={4} value={formData.about} onChange={handleChange} error={!!errors.about} helperText={errors.about} margin="normal" />
        <Button type="submit" 
      variant="contained" 
      color="primary"
      fullWidth
      sx={{
        marginTop: 2,
        padding: '12px',
        fontSize: '1.1rem',
        fontWeight: 'bold'}}>
          Register
        </Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Paper>
    </Container>
  );
};

export default RegistrationForm;
