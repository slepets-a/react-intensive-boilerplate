import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup }  from 'react-transition-group';

import Composer from "../../components/Composer";
import Post from "../../components/Post";
import StatusBar from "../../components/StatusBar";
import Catcher from '../../components/Catcher';
import Counter from '../../components/Counter';
import Spinner from '../../components/Spinner';

import { socket } from '../../socket';
import { api, TOKEN, GROUP_ID } from "../../config/api";

import Styles from './styles.m.css';

class Feed extends React.Component {
    constructor () {
        super();
        this.state = {
            posts: [],
            isPostsFetching: false,
        };
        this.createPost = this._createPost.bind(this);
        this.fetchPosts = this._fetchPosts.bind(this);
        this.removePost = this._removePost.bind(this);
        this.likePost = this._likePost.bind(this);
        this.setPostsFetchingState = this._setPostsFetchingState.bind(this);
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
    }

    _setPostsFetchingState (state) {
        this.setState(() => ({
            isPostsFetching: state,
        }));
    }

    _fetchPosts () {
        this.setPostsFetchingState(true);
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
                }), () => {
                    this.setPostsFetchingState(true);
                });
            })
            .catch((error) => {
                console.log(error);
                this.setPostsFetchingState(true);
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
        const {
            posts,
        } = this.state;
        const {
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        const renderedPosts = posts.map((post) => (<CSSTransition
            classNames = { {
                enter: Styles.postInStart,
                enterActive: Styles.postInEnd,
                exit: Styles.postOutStart,
                exitActive: Styles.postOutEnd,
            } }
            key = { post.id }
            timeout = { { enter: 500, exit: 400 } }>
            <Catcher>
                <Post
                    { ...post }
                    currentUserFirstName = { currentUserFirstName }
                    currentUserLastName = { currentUserLastName }
                    likePost = { this.likePost }
                    removePost = { this.removePost }
                />
            </Catcher>
        </CSSTransition>
        ));

        return (
            <section className = { Styles.feed } >
                <StatusBar />
                <Composer createPost = { this.createPost } />
                <Counter count = { posts.length } />
                <TransitionGroup>
                    { renderedPosts }
                </TransitionGroup>
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
