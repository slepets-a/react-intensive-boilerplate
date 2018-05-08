import React from 'react';
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

import withApi from '../../components/HOC/withApi';

import Styles from './styles.m.css';

class Feed extends React.Component {

    constructor () {
        super();
        this.state = {
            posts: [],
            isPostsFetching: false,
        };
        this.handleComposerAppear = this._handleComposerAppear.bind(this);
        this.handleCounterAppear = this._handleCounterAppear.bind(this);
        this.handlePostmanAppear = this._handlePostmanAppear.bind(this);
        this.handlePostmanDisappear = this._handlePostmanDisappear.bind(this);
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
            isPostsFetching,
        } = this.state;
        const {
            currentUserFirstName,
            currentUserLastName,
            createPost,
            hidePostman,
            likePost,
            posts,
            removePost,
            showPostman,
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
                    likePost = { likePost }
                    removePost = { removePost }
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
                    <Composer createPost = { createPost } />
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
                { showPostman ? null : (
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

export default withApi(Feed);
