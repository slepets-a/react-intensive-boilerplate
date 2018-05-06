import React from 'react';
import PropTypes from 'prop-types';

import { Composer } from "../../components/Composer";
import { Post } from "../../components/Post";

import Styles from './styles.m.css';

class Feed extends React.Component {
    render () {
        return (
            <section className = { Styles.feed } >
                <Composer />
                <Post { ...this.props } />
            </section>
        );
    }
}

Feed.propTypes = {
    avatar: PropTypes.string.isRequired,
    currentUserFirstName: PropTypes.string.isRequired,
    currentUserLastName: PropTypes.string.isRequired,
};

export default Feed;
