import React, { Component, PropTypes } from 'react';

export default function FormMessagesHOC (InnerComponent) {
  return class FormMessages extends Component {
    static displayName = `FormMessagesHOC${InnerComponent.displayName || InnerComponent.name || ''}`;

    static propTypes = {
      errors: PropTypes.object.isRequired
    };

    render () {
      const messages = [];
      const { errors } = this.props;

      for (const error in errors) {
        if (!errors.hasOwnProperty(error)) {
          continue;
        }

        if (error == '$invalid') {
          continue;
        }

        const message = errors[error];

        if (process.env.NODE_ENV !== 'production') {
          if (typeof message == 'boolean') {
            console.error(`No message provided for error of type: ${error}`);
            continue;
          }
        }

        messages.push(message);
      }

      return (
        <InnerComponent {...this.props}
                        messages={messages} />
      );
    }
  }
}