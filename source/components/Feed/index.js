import React from 'react';
import PropTypes from 'prop-types';

import { Composer } from "../../components/Composer";
import { Post } from "../../components/Post";

import Styles from './styles.m.css';

class Feed extends React.Component {
    render () {
        const {
            avatar,
            currentUserFirstName,
        } = this.props;

        return (
            <section className = { Styles.feed } >
                <Composer avatar = { avatar } currentUserFirstName = { currentUserFirstName } />
                <Post { ...this.props } />
            </section>
        );
    }
}

Feed.propTypes = {
    avatar:               PropTypes.string.isRequired,
    currentUserFirstName: PropTypes.string.isRequired,
    currentUserLastName:  PropTypes.string.isRequired,
};

export default Feed;
