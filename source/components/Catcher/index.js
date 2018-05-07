import React from 'react';
import PropTypes from 'prop-types';

import Styles from './styles.m.css';

class Catcher extends React.Component {
    constructor () {
        super();
        this.state = {
            isError: false,
            message: '',
        };
    }

    componentDidCatch (error, stack) {
        this.setState(() => ({
            isError: true,
            message: error.toString(),
        }));
    }

    render () {
        const {
            isError,
            message,
        } = this.state;
        const { children } = this.props;

        return isError ? (
            <section className = { Styles.catcher }>
                <span>A mysterious 👽 &nbsp;error 📛 &nbsp;occured.</span>
                <p>
                    Our space 🛰 &nbsp;engineers strike team 👩🏼‍🚀 👨🏼‍🚀
                    &nbsp;is already working 🚀 &nbsp;in order to fix that
                    for you!
                </p>
                <div>{ message }</div>
            </section>
        ) : children;
    }
}

Catcher.propsTypes = {
    children: PropTypes.object.isRequired,
};

export default Catcher;