import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup, Transition }  from 'react-transition-group';
import { fromTo } from 'gsap';

import Composer from "../../components/Composer";
import Post from "../../components/Post";
import StatusBar from "../../components/StatusBar";
import Catcher from '../../components/Catcher';
import Counter from '../../components/Counter';
import Spinner from '../../components/Spinner';
import Postman from '../../components/Postman';

import { socket } from '../../socket';
import { api, TOKEN, GROUP_ID } from "../../config/api";

import Styles from './styles.m.css';

class Feed extends React.Component {

    constructor () {
        super();
        this.state = {
            posts: [],
            hidePostman: true,
            isPostsFetching: false,
        };
        this.createPost = this._createPost.bind(this);
        this.fetchPosts = this._fetchPosts.bind(this);
        this.removePost = this._removePost.bind(this);
        this.likePost = this._likePost.bind(this);
        this.setPostsFetchingState = this._setPostsFetchingState.bind(this);
        this.handleComposerAppear = this._handleComposerAppear.bind(this);
        this.handleCounterAppear = this._handleCounterAppear.bind(this);
        this.handlePostmanAppear = this._handlePostmanAppear.bind(this);
        this.handlePostmanDisappear = this._handlePostmanDisappear.bind(this);
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
                    this.setPostsFetchingState(false);
                });
            })
            .catch((error) => {
                console.log(error);
                this.setPostsFetchingState(false);
            });
    }

    _createPost (comment) {
        this.setPostsFetchingState(true);
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
                }), () => {
                    this.setPostsFetchingState(false);
                });
            })
            .catch((error) => {
                console.log(error);
                this.setPostsFetchingState(false);
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

    _handleComposerAppear (composer) {
        fromTo(composer, 0.5, { opacity: 0 }, { opacity: 1 });
    }

    _handleCounterAppear (counter) {
        fromTo(counter, 0.5, { x: 400, opacity : 0 }, { x: 0, opacity: 1 });
    }

    _handlePostmanAppear (postman) {
        fromTo(postman, 1, { y: 400, opacity : 0 }, { y: 0, opacity: 1 });
    }

    _handlePostmanDisappear (postman) {
        fromTo(postman, 1, { y: 0, opacity : 1 }, { y: 400, opacity: 0 });
    }

    render () {
        const {
            posts,
            isPostsFetching,
            hidePostman,
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
                <Transition
                    appear
                    in
                    timeout = { 500 }
                    onEnter = { this.handleComposerAppear }>
                    <Composer createPost = { this.createPost } />
                </Transition>
                <Transition
                    appear
                    in
                    timeout = { 500 }
                    onEnter = { this.handleCounterAppear }>
                    <Counter count = { posts.length } />
                </Transition>
                <Spinner isSpinning = { isPostsFetching } />
                <TransitionGroup>
                    { renderedPosts }
                </TransitionGroup>
                { this.showPostman ? null : (
                    <Transition
                        appear
                        unmountOnExit
                        in = { hidePostman }
                        timeout = { 500 }
                        onEnter = { this.handlePostmanAppear }
                        onExit = { this.handlePostmanDisappear }>
                        <Postman />
                    </Transition>
                ) }
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
