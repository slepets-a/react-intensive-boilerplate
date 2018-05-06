// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from '../../components/HOC/withProfile';

import Feed from '../../components/Feed';

const config = {
    avatar: 'https://www.discosportforums.co.uk/download/file.php?avatar=943_1435421459.png',
    currentUserFirstName: 'Tony',
    currentUserLastName:  'Stark',
};

@hot(module)
export default class App extends Component {
    render () {
        return (
            <Provider value = { config } >
                <Feed { ...config } />
            </Provider>
        );
    }
}
