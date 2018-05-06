import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import Styles from './styles';

export class Post extends React.Component {

    shouldComponentUpdate (nextProps) {
        return Object
            .entries(nextProps)
            .some(([key, value]) => this.props[key] !== value);
    }

    render () {
        const {
            avatar,
            comment,
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        return (
            <section className = { Styles.post } >
                <div className = { Styles.info }>
                    <img alt = { `${currentUserFirstName} ${currentUserLastName}` } src = { avatar } />
                    <div className = { Styles.description }>
                        <a href = 'https://www.linkedin.com/in/artemslepets/'>{ `${currentUserFirstName} ${currentUserLastName}` }</a>
                        <time>{ moment().format('MMMM D h:mm:ss a') }</time>
                    </div>
                </div>
                <pre>{ comment }</pre>
            </section>
        );
    }
}

Post.propTypes = {
    avatar: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    currentUserFirstName: PropTypes.string.isRequired,
    currentUserLastName: PropTypes.string.isRequired,
};