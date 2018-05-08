import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import cx from "classnames";

import Styles from "./styles.m";

import Like from "../../components/Like";

class Post extends React.Component {
    constructor () {
        super();
        this.getCross = this._getCross.bind(this);
        this._removePost = this._removePost.bind(this);
    }

    shouldComponentUpdate (nextProps) {
        return Object.entries(nextProps).some(
            ([key, value]) => this.props[key] !== value
        );
    }

    _getCross () {
        const {
            currentUserFirstName,
            currentUserLastName,
            firstName,
            lastName,
        } = this.props;

        return `${currentUserFirstName} ${currentUserLastName}` ===
            `${firstName} ${lastName}` ? (
                <span className = { Styles.cross } onClick = { this._removePost } />
            ) : null;
    }

    _removePost () {
        const { id, removePost } = this.props;

        removePost(id);
    }

    render () {
        const {
            avatar,
            comment,
            created,
            firstName,
            id,
            lastName,
            likePost,
            likes,
        } = this.props;
        const isPostMine = lastName === "Слепец";
        const postStyle = cx(Styles.post, {
            [Styles.mine]: isPostMine,
        });

        return (
            <section className = { postStyle }>
                {this.getCross()}
                <div className = { Styles.info }>
                    <img alt = { `${firstName} ${lastName}` } src = { avatar } />
                    <div className = { Styles.description }>
                        <a href = 'https://www.linkedin.com/in/artemslepets/'>{`${firstName} ${lastName}`}</a>
                        <time>
                            {moment.unix(created).format("MMMM D h:mm:ss a")}
                        </time>
                    </div>
                </div>
                <pre>{comment}</pre>
                <Like id = { id } likePost = { likePost } likes = { likes } />
            </section>
        );
    }
}

Post.propTypes = {
    avatar: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    likes: PropTypes.array.isRequired,
};

export default Post;
