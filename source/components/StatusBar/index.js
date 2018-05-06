import React from 'react';

import Styles from './styles.m.css';
import { Consumer } from '../../components/HOC/withProfile';

const StatusBar = () => (
    <Consumer>
        {
            ({
                avatar,
                currentUserFirstName,
                currentUserLastName,
            } ={}) => (
                <section className = { Styles.statusBar }>
                    <div className = { Styles.offline }>
                        <div>Offline</div>
                        <span />
                    </div>
                    <button>
                        <img alt = 'avatar' src = { avatar } />
                        <span>{ currentUserFirstName }</span>
                        &nbsp;
                        <span>{ currentUserLastName }</span>
                    </button>
                </section>
            )
        }
    </Consumer>
);

export default StatusBar;
