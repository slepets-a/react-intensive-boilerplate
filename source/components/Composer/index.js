import React from 'react';
import PropTypes from 'prop-types';

import Styles from './styles.m.css';
import { Consumer } from '../../components/HOC/withProfile';

export class Composer extends React.Component {
    constructor () {
        super();
        this.state = {
            comment: '',
        };
        this.onChangeHandler = this._onChangeHandler.bind(this);
        // this.onChangeHandler = ::this._onChangeHandler;
        this.onSubmitHandler = this._onSubmitHandler.bind(this);
        this.onSendPostHandler = this._onSendPostHandler.bind(this);
        this.onCopyTextHandler = this._onCopyTextHandler.bind(this);
    }

    _onChangeHandler (event) {
        this.setState({
            comment: event.target.value,
        });
    }

    _onSendPostHandler (event) {
        if (event.nativeEvent.keyCode === 10) {
            this.onSubmitHandler();
        }
    }

    _onCopyTextHandler (event) {
        event.preventDefault();
    }

    _onSubmitHandler () {
        const {
            comment,
        } = this.state;
        const {
            createPost,
        } = this.props;

        if (comment) {
            createPost(comment);
            this.setState({
                comment: '',
            });
        }
    }

    render () {
        const {
            comment,
        } = this.state;

        return (
            <Consumer>
                {
                    ({ avatar, currentUserFirstName }) => (
                        <section className = { Styles.composer } >
                            <form>
                                <img alt = 'LoL' src = { avatar } />
                                <textarea
                                    placeholder = { `What is in your mind, ${currentUserFirstName}` }
                                    value = { comment }
                                    onChange = { this.onChangeHandler }
                                    onCopy = { this.onCopyTextHandler }
                                    onCut = { this.onCopyTextHandler }
                                    onKeyPress = { this.onSendPostHandler }
                                />
                            </form>
                            <input type = 'submit' value = 'Post' onClick = { this.onSubmitHandler } />
                        </section>
                    )
                }
            </Consumer>
        );
    }
}

Composer.propTypes = {
    createPost: PropTypes.func.isRequired,
};
