import React from "react";
import { func, arrayOf, string, shape } from "prop-types";

import Styles from "./styles.m.css";

// instruments
import { withProfile } from "../../components/HOC/withProfile";

class Like extends React.Component {
    constructor () {
        super();
        this.state = {
            showLikers: false,
        };
        this.showLikers = this._showLikers.bind(this);
        this.hideLikers = this._hideLikers.bind(this);
        this.getLikeByMe = this._getLikeByMe.bind(this);
        this.likePost = this._likePost.bind(this);
        this.getLikeStyle = this._getLikeStyle.bind(this);
        this.getLikerList = this._getLikerList.bind(this);
        this.getLikesDescription = this._getLikesDescription.bind(this);
    }

    _showLikers () {
        this.setState({
            showLikers: true,
        });
    }

    _hideLikers () {
        this.setState({
            showLikers: false,
        });
    }

    _likePost () {
        const { id, likePost } = this.props;

        likePost(id);
    }

    _getLikeByMe () {
        const { currentUserFirstName, currentUserLastName } = this.props;

        return this.props.likes.some(
            ({ firstName, lastName }) =>
                `${firstName} ${lastName}` ===
                `${currentUserFirstName} ${currentUserLastName}`
        );
    }

    _getLikeStyle () {
        const likedByMe = this.getLikeByMe();

        return likedByMe ? `${Styles.icon}  ${Styles.liked}` : `${Styles.icon}`;
    }

    _getLikerList () {
        const { showLikers } = this.state;
        const { likes } = this.props;
        const likesJSX = likes.map(({ firstName, lastName, id }) => (
            <li key = { id }>{`${firstName} ${lastName}`}</li>
        ));

        return showLikers && likes.length ? <ul>{likesJSX}</ul> : null;
    }

    _getLikesDescription () {
        const { currentUserFirstName, currentUserLastName, likes } = this.props;

        const likedByMe = this.getLikeByMe();

        if (likes.length === 1 && likedByMe) {
            return `${currentUserFirstName} ${currentUserLastName}`;
        } else if (likes.length === 2 && likedByMe) {
            return `You and 1 other`;
        } else if (likedByMe) {
            return `You and ${likes.length - 1} others`;
        }

        return likes.length;
    }

    render () {
        const likers = this.getLikerList();
        const likeStyles = this.getLikeStyle();
        const likersDescription = this.getLikesDescription();

        return (
            <section className = { Styles.like }>
                <span className = { likeStyles } onClick = { this.likePost }>
                    Like
                </span>
                <div>
                    {likers}
                    <span
                        onMouseEnter = { this.showLikers }
                        onMouseLeave = { this.hideLikers }>
                        {likersDescription}
                    </span>
                </div>
            </section>
        );
    }
}

Like.propTypes = {
    id: string.isRequired,
    likePost: func.isRequired,
    likes: arrayOf(
        shape({
            firstName: string.isRequired,
            lastName: string.isRequired,
        })
    ).isRequired,
};

Like.defaultProps = {
    likes: [],
};

export default withProfile(Like);
