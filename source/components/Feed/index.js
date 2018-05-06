import React from 'react';
import PropTypes from 'prop-types';

import { getUniqueID } from '../../instruments';

import { Composer } from "../../components/Composer";
import { Post } from "../../components/Post";
import StatusBar from "../../components/StatusBar";
import Catcher from '../../components/Catcher';
import Counter from '../../components/Counter';

import { api, TOKEN } from "../../config/api";

import Styles from './styles.m.css';

class Feed extends React.Component {
    constructor () {
        super();
        this.state = {
            posts: [],
        };
        this.createPost = this._createPost.bind(this);
        this.fetchPosts = this._fetchPosts.bind(this);
    }

    componentDidMount () {
        this.fetchPosts();
    }

    _fetchPosts () {
        fetch(api)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Fetch posts failed');
                }

                return response.json();
            })
            .then(({ data }) => {
                this.setState(({ posts }) => ({
                    posts: [...data, ...posts],
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    _createPost (comment) {
        fetch(api, {
            method: 'POST',
            headers: {
                'Authorization': TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment }),
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Create post failed');
                }

                return response.json();
            })
            .then(({ data }) => {
                this.setState(({ posts }) => ({
                    posts: [data, ...posts],
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render () {
        const {
            posts,
        } = this.state;

        const renderedPosts = posts.length ?
            posts.map((post) => (<Catcher key = { post.id }>
                <Post { ...post } />
            </Catcher>)):
            <p className = { Styles.noPosts }>Start conversation right now!</p>;

        return (
            <section className = { Styles.feed } >
                <StatusBar />
                <Composer createPost = { this.createPost } />
                <Counter count = { posts.length } />
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
