import React from 'react';

import Styles from './styles.m.css';

import { Consumer } from '../../components/HOC/withProfile';

class Postman extends React.Component {

    render () {
        return (
            <Consumer>
                {
                    ({
                        avatar,
                        currentUserFirstName,
                        currentUserLastName,
                    } = {}) => (
                        <section className = { Styles.postman }>
                            <img alt = 'Avatar' src = { avatar } />
                            <span>Hello from { `${currentUserFirstName} ${currentUserLastName}` }</span>
                        </section>
                    )
                }
            </Consumer>
        );
    }
}

export default Postman;
