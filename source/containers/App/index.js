// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Catcher from '../../components/Catcher';
import { Provider } from '../../components/HOC/withProfile';

import Feed from '../../components/Feed';

const config = {
    avatar: 'https://www.discosportforums.co.uk/download/file.php?avatar=943_1435421459.png',
    currentUserFirstName: 'Артём',
    currentUserLastName:  'Слепец',
};

@hot(module)
class App extends Component {
    render () {
        return (
            <Catcher>
                <Provider value = { config } >
                    <Feed { ...config } />
                </Provider>
            </Catcher>
        );
    }
}

export default App;