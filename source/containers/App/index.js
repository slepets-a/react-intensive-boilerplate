// Core
import React, { Component } from 'react';
import Feed from '../../components/Feed';

import avatar from 'theme/assets/homer';

const config = {
    avatar,
    currentUserFirstName: 'Lorem',
    currentUserLastName:  'Ipsum',
};

export default class App extends Component {
    render () {
        return (
            <Feed { ...config } />
        );
    }
}
