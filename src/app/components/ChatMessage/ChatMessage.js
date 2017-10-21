import React from "react";
import PropTypes from "prop-types";

import "./ChatMessage.scss";

export default class ChatMessage extends React.Component {
  constructor(props) {
    super(props);

    this.message = props.message;
  }

  render() {
    return <li key={ this.message.id }>
            <span className="Chat-message-username" style={ { color: getColor(this.message) } }>
              [{ getShortDate(this.message.createdAt) }] { this.message.user_acc.username }
            </span>
            <div className="Chat-message-body">
              { this.message.message }
            </div>
           </li>;
  }
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired
};

function getColor(message) {
  let username = message.user_acc.username;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

function getShortDate(date) {
  let options = {
    hour: "2-digit",
    minute: "2-digit"
  };

  return new Date(date).toLocaleTimeString("pt-PT", options);
}
