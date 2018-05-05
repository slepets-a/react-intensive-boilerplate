import React from 'react';

import Styles from './styles.m.css';

export class Composer extends React.Component {
    render () {
        const {
            avatar,
            currentUserFirstName,
        } = this.props;

        return (
            <section className = { Styles.composer } >
                <form>
                    <img alt = 'LoL' src = { avatar } />
                    <textarea placeholder = { `What is in your mind, ${ currentUserFirstName }` } />
                </form>
                <input type = 'submit' value = 'Post' />
            </section>
        );
    }
}