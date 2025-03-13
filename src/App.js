// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import BlogPost from './components/BlogPost';
// import CreateBlog from './components/CreateBlog';
// import Profile from './components/Profile';
// import Login from './components/Login';
// import Register from './components/Register';
// import SearchResults from './components/SearchResults';
// import Categories from './components/Categories';
// import { Container } from 'react-bootstrap';
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const loggedInUser = localStorage.getItem('user');
//     if (loggedInUser) {
//       setUser(JSON.parse(loggedInUser));
//     }
//   }, []);

//   const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route
//       {...rest}
//       render={props =>
//         user ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
//         )
//       }
//     />
//   );

//   return (
//     <Router>
//       <div className="App">
//         <Navbar user={user} setUser={setUser} />
//         <Container fluid className="p-0">
//           <Routes>
//             <Route exact path="/" component={Home} />
//             <Route path="/blog/:id" component={BlogPost} />
//             <Route path="/login" render={(props) => <Login {...props} setUser={setUser} />} />
//             <Route path="/register" component={Register} />
//             <Route path="/search" component={SearchResults} />
//             <Route path="/categories" component={Categories} />
//             <PrivateRoute path="/create" component={CreateBlog} />
//             <PrivateRoute path="/profile/:id" component={Profile} />
//           </Routes>
//         </Container>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BlogPost from './components/BlogPost';
import CreateBlog from './components/CreateBlog';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import SearchResults from './components/SearchResults';
import Categories from './components/Categories';
import { Container } from 'react-bootstrap';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Container fluid className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/categories" element={<Categories />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:id" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;