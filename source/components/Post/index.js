import React from 'react';
import moment from 'moment';

import Styles from './styles';

export class Post extends React.Component {
    render () {
        const {
            avatar,
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        return (
            <section className = { Styles.post } >
                <div className = { Styles.info }>
                    <img alt = { `${currentUserFirstName} ${currentUserLastName}` } src = { avatar } />
                    <div className = { Styles.description }>
                        <a href = 'https://google.com/'>{ `${currentUserFirstName} ${currentUserLastName}` }</a>
                        <time>{ moment().format('MMMM D h:mm:ss a') }</time>
                    </div>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, minima!</p>
            </section>
        );
    }
}
