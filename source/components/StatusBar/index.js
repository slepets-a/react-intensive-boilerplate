import React from 'react';
import cx from 'classnames';

import { socket } from '../../socket';

import Styles from './styles.m.css';
import { Consumer } from '../../components/HOC/withProfile';

class StatusBar extends React.Component {
    constructor () {
        super();
        this.state = {
            online: false,
        };
    }

    componentDidMount () {
        socket.on('connect', () => {
            this.setState({
                online: true,
            });
        });
        socket.on('disconnect', () => {
            this.setState({
                online: false,
            });
        });
    }

    render () {
        const {
            online,
        } = this.state;
        const statusStyle = cx(Styles.status, {
            [Styles.online]:  online,
            [Styles.offline]: !online,
        });
        const statusMessage = online ? 'Online' : 'Offline';

        return (
            <Consumer>
                {
                    ({
                        avatar,
                        currentUserFirstName,
                        currentUserLastName,
                    } = {}) => (
                        <section className = { Styles.statusBar }>
                            <div className = { statusStyle }>
                                <div>{ statusMessage }</div>
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
    }
}

export default StatusBar;
