import React from 'react';

import { api, TOKEN, GROUP_ID } from "../../config/api";
import { socket } from "../../socket";

const withApi = (Enhanced) => (
    class WithApp extends React.Component {
        constructor () {
            super();
            this.state = {
                posts: [],
                hidePostman: true,
            };
            this.setPostsFetchingState = this._setPostsFetchingState.bind(this);
            this.fetchPosts = this._fetchPosts.bind(this);
            this.createPost = this._createPost.bind(this);
            this.removePost = this._removePost.bind(this);
            this.likePost = this._likePost.bind(this);
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
            socket.on('remove', (response) => {
                const {
                    data: {
                        id,
                    },
                    meta: {
                        authorFirstName,
                        authorLastName,
                    },
                } = JSON.parse(response);

                console.info(`${authorFirstName} ${authorLastName} removed his post`);
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== id),
                }));
            });
            socket.on('like', (postJSON) => {
                // const {
                //     data: {
                //         id,
                //     },
                //     meta: {
                //         authorFirstName,
                //         authorLastName,
                //     },
                // } = JSON.parse(response);
                const { data: likedPost, meta } = JSON.parse(postJSON);

                if (
                    `${currentUserFirstName} ${currentUserLastName}` !==
                    `${meta.authorFirstName} ${meta.authorLastName}`
                ) {
                    this.setState(({ posts }) => ({
                        posts: posts.map((post) => post.id === likedPost.id ? likedPost : post),
                    }));
                }
            });

            this.postmanInterval = setTimeout(() => {
                this.setState({ hidePostman: false });
            }, 5000);

            // add 'Postman' flag to local storage
            localStorage.setItem('postman', 'isShown');
        }

        componentWillUnmount () {
            clearTimeout(this.postmanInterval);
        }

        // interval for Postman
        postmanInterval = null;
        // flag for showing postman
        showPostman = localStorage.getItem('postman');

        _setPostsFetchingState (state) {
            this.setState(() => ({
                isPostsFetching: state,
            }));
        }

        async _fetchPosts () {
            this.setPostsFetchingState(true);
            try {
                const response = await fetch(api);

                if (response.status !== 200) {
                    throw new Error('Fetch posts failed');
                }
                const { data } = await response.json();

                this.setState(({ posts }) => ({
                    posts: [...data, ...posts],
                }));
            } catch ({ message }) {
                console.log(message);
            } finally {
                this.setPostsFetchingState(false);
            }
        }

        async _createPost (comment) {
            this.setPostsFetchingState(true);
            try {
                const response = await fetch(
                    api,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': TOKEN,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ comment }),
                    });

                if (response.status !== 200) {
                    throw new Error('Create post failed');
                }
                const { data } = await response.json();

                this.setState(({ posts }) => ({
                    posts: [data, ...posts],
                }));
            } catch ({ message }) {
                console.log(message);
            } finally {
                this.setPostsFetchingState(false);
            }
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

        async _likePost (id) {
            try {
                const response = await fetch(`${api}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': TOKEN,
                    },
                });

                if (response.status !== 200) {
                    throw new Error('Like post failed');
                }
                const { data } = await response.json();

                this.setState(({ posts }) => ({
                    posts: posts.map((post) => post.id === id ? data : post),
                }));
            } catch ({ message }) {
                console.log(message);
            }
        }

        render () {
            return (
                <Enhanced
                    { ...this.props }
                    { ...this.state }
                    createPost = { this.createPost }
                    fetchPosts = { this.fetchPosts }
                    likePost = { this.likePost }
                    removePost = { this.removePost }
                    showPostman = { this.showPostman }
                />
            );
        }
    }
);

export default withApi;
