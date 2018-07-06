import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import App from './App';
import * as Constant from './common/Constant';
import NavigationBarComponent from './components/NavigationBar';


//ROUTES
import AuthorsView from './views/authors/AuthorsView';
import BooksView from './views/books/BooksView';

export default class AppRouter extends Component{
   
    render(){
        return(
            <div>
            <HashRouter>
                
            <div >
               
                <Route path={Constant.ROUTES.EMPTY} component={App} basename={'/app'} />
                <div id="content">
                    <Route exact path={Constant.ROUTES.AUTHORS} component={AuthorsView} />
                    <Route exact path={Constant.ROUTES.BOOKS} component={BooksView} />
                </div>
            </div>
            </HashRouter>
            </div>
        );
    }
}