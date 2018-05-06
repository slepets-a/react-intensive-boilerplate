import React from 'react';

import Styles from './styles.m.css';
import { Consumer } from '../../components/HOC/withProfile';

export class Composer extends React.Component {
    render () {
        return (
            <Consumer>
                {
                    ({ avatar, currentUserFirstName }) => (
                        <section className = { Styles.composer } >
                            <form>
                                <img alt = 'LoL' src = { avatar } />
                                <textarea placeholder = { `What is in your mind, ${currentUserFirstName}` } />
                            </form>
                            <input type = 'submit' value = 'Post' />
                        </section>
                    )
                }
            </Consumer>
        );
    }
}