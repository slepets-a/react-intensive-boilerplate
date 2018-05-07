import React from 'react';
import PropTypes from 'prop-types';

import Composer from "../../components/Composer";
import Post from "../../components/Post";
import StatusBar from "../../components/StatusBar";
import Catcher from '../../components/Catcher';
import Counter from '../../components/Counter';

import { socket } from '../../socket';
import { api, TOKEN, GROUP_ID } from "../../config/api";

import Styles from './styles.m.css';

class Feed extends React.Component {
    constructor () {
        super();
        this.state = {
            posts: [],
        };
        this.createPost = this._createPost.bind(this);
        this.fetchPosts = this._fetchPosts.bind(this);
        this.removePost = this._removePost.bind(this);
    }

    componentDidMount () {
        const {
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        this.fetchPosts();
        socket.emit('join', GROUP_ID);
        socket.on('create', (response) => {
            const {
                data: createdPost,
                meta: {
                    authorFirstName,
                    authorLastName,
                },
            } = JSON.parse(response);

            if (`${authorFirstName} ${authorLastName}` !== `${currentUserFirstName} ${currentUserLastName}`) {
                this.setState(({ posts }) => ({
                    posts: [createdPost, ...posts],
                }));
            }
        });
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

    async _removePost (id) {
        try {
            const response = await fetch(`${api}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': TOKEN,
                },
            });

            if (response.status !== 204) {
                throw new Error('Remove post failed');
            }
            this.setState(({ posts }) => ({
                posts: posts.filter((post) => post.id !== id),
            }));
        } catch ({ message }) {
            console.log(message);
        }
    }

    render () {
        const {
            posts,
        } = this.state;
        const {
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        const renderedPosts = posts.length ?
            posts.map((post) => (<Catcher key = { post.id }>
                <Post
                    { ...post }
                    currentUserFirstName = { currentUserFirstName }
                    currentUserLastName = { currentUserLastName }
                    removePost = { this.removePost }
                />
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
