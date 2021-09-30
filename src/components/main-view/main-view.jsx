import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { setMovies } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import  { RegistrationView }  from '../registration-view/registration-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MainView extends React.Component {

    constructor(){
        super();
        this.state = {
            movies: [],
            selectedMovie: null,
            user: null
        };
    }

    componentDidMount(){
       // axios.get('https://stormy-taiga-55813.herokuapp.com/movies')
        //.then(response => {
          //  this.setState({
            //    movies: response.data
            //});
        //})
        //.catch(error => {
          //  console.log(error);
        //});
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
            user: localStorage.getItem('user')
        });
        this.getMovies(accessToken);
        }
    }

    setSelectedMovie(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    getMovies(token) {
        axios.get('https://stormy-taiga-55813.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
            //assign the result to the state
            this.props.setMovies(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    
    
    render() {
        
            //const { movies, selectedMovie,  user } = this.state;

            let { movies } = this.props;
            let { user } = this.state;
            console.log(this.props)
            //if (selectedMovie) return <MovieView movie={selectedMovie} />;

           // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

           // if (movies.length === 0) return <div className="main-view">The list is empty!</div>;

              return (
            //<div className="main-view">
              //  {selectedMovie
                //  ? (
                <Router>
                    <Row className="main-view justify-content-md-center">
                        <Route exact path="/" render={() => {
                            if (!user) return <Col>
                            <LoginView onLoggedIn={user => this.onLoggedIn(user)}/>
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            return <MoviesList />;
                        }} />
                        <Route path="/register" render={() => {
                            if (user) return <Redirect to="/" />
                            return <Col>
                              <RegistrationView />
                            </Col>
                        }} />
                        <Route path="/movies/:movieId" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                </Col>
                                if (movies.length === 0) return <div className="main-view" />;
                                return <Col md={8}>
                                <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
                            </Col>
                        }} />
                        <Route path="/directors/:name" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                </Col>
                                if (movies.length === 0) return <div className="main-view" />;
                                return <Col md={8}>
                                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
                            </Col>
                        }
                } />
                    <Route path="/genres/:name" render={({ match, history }) => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                </Col>
                                if (movies.length === 0) return <div className="main-view" />;
                                return <Col md={8}>
                                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
                            </Col>
                    }
                } />

                    </Row>
                 </Router>
            );
        }
    }
    let mapStateToProps = state => {
        console.log(state)
        return { movies: state.movies }
    }

    export default connect(mapStateToProps, { setMovies } )(MainView);
                         //<Col md={8}>
                        //<MovieView movie={selectedMovie} onBackClick= {newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
                        //</Col>
                    //</Row>
                  //)
                  //: movies.map(movie => (
                  //<MovieCard key={movie._id} movie={movie} onMovieClick={
                //(movie) => { this.setSelectedMovie(movie) }}/>
                 // ))
                //}  
                //<button onClick={() => { this.onLoggedOut()}}>Logout</button>
            //</div>
        //);
        
    //}


//}