import React from 'react';
import PropTypes from 'prop-types';

import { getUniqueID } from '../../instruments';

import { Composer } from "../../components/Composer";
import { Post } from "../../components/Post";
import StatusBar from "../../components/StatusBar";

import Styles from './styles.m.css';

class Feed extends React.Component {
    constructor () {
        super();
        this.state = {
            posts: [],
        };
        this.createPost = this._createPost.bind(this);
    }

    _createPost (comment = 'No comment here') {
        this.setState(({ posts }) => ({
            posts: [
                {
                    id: getUniqueID(),
                    comment,
                },
                ...posts
            ],
        }));
    }

    render () {
        const {
            posts,
        } = this.state;

        const renderedPosts = posts.length ?
            posts.map((post) => <Post comment = { post.comment } key = { post.id } { ...this.props } />):
            <p className = { Styles.noPosts }>Start conversation right now!</p>;

        return (
            <section className = { Styles.feed } >
                <StatusBar />
                <Composer createPost = { this.createPost } />
                { renderedPosts }
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
