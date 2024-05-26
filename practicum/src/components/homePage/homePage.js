import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, IconButton, InputAdornment, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import employeeBgImage from '../../home-bg.jpg';
import '../homePage/homePage.css';

const schema = yup.object({
  Username: yup.string().required(),
  Password: yup.string().required(),
}).required();

export default function HomePage() {
  const [scrollPos, setScrollPos] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const contactRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleContactClick = (event) => {
    event.preventDefault();
    scrollToContact();
  };

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    function handleScroll() {
      const currentTop = document.body.getBoundingClientRect().top * -1;
      if (currentTop < scrollPos) {
        // Scrolling Up
        if (currentTop > 0 && isNavFixed) {
          setIsNavVisible(true);
        } else {
          setIsNavVisible(false);
          setIsNavFixed(false);
        }
      } else {
        // Scrolling Down
        setIsNavVisible(false);
        if (currentTop > headerHeight && !isNavFixed) {
          setIsNavFixed(true);
        }
      }
      setScrollPos(currentTop);
    }

    const headerHeight = 100;

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPos, isNavFixed]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');

    if (storedUsername === 'admin' && storedPassword === 'admin') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    const contactLinkText = isAuthenticated ? 'Logout' : 'Login';
    if (contactLinkText === 'Logout') {
      sessionStorage.clear();
      setIsAuthenticated(false);
    }
  };

  const onSubmit = (data) => {
    if (data.Username === 'admin' && data.Password === 'admin') {
      sessionStorage.setItem('username', data.Username);
      sessionStorage.setItem('password', data.Password);
      setIsAuthenticated(true);
    }
    const header = document.querySelector('header.masthead');
    header.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-light ${isNavFixed ? 'is-fixed' : ''} ${isNavVisible ? 'is-visible' : ''}`} id="mainNav">
        <div className="container px-4 px-lg-5">
          <Link className="navbar-brand" to="/">Employee Management</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto py-4 py-lg-0">
              <li className="nav-item"><Link className="nav-link px-lg-3 py-3 py-lg-4" to="/">Home</Link></li>
              {isAuthenticated && (
                <li className="nav-item">
                  <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/employees">Manage Employees</Link>
                </li>
              )}
              {isAuthenticated ? (
                <li className="nav-item">
                  <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/logout" onClick={handleLogout}>Logout</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/login" onClick={handleContactClick}>Login</Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>
      <header className="masthead" style={{ backgroundImage: `url(${employeeBgImage})` }}>
        <div className="container position-relative px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              <div className="site-heading">
                <h1>Employee Management</h1>
                <span className="subheading">Manage, Add, Update, and Delete Employees</span>
              </div>
            </div>
          </div>
        </div>
        <img src={employeeBgImage} alt="employee-banner" style={{ display: 'none' }} />
      </header>
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            {/* Employee management content */}
            <h2>Welcome to the Employee Management System</h2>
            <p>Here you can manage your employees. You can view, add, update, and delete employees as needed.</p>
            <section ref={contactRef}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Input {...register('Username')} placeholder="Name (to login enter admin)" label="Name" fullWidth />
                    <p className="text-danger">{errors.Username?.message}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      {...register('Password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password (to login enter admin)"
                      label="Password"
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <p className="text-danger">{errors.Password?.message}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit" fullWidth style={{ backgroundColor: 'rgb(18 171 222)', color: 'white' }}>
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </section>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-top">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              <div className="small text-center text-muted fst-italic">NoaGoldfinger &copy; Employees Management 2025</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}