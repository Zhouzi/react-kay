import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

export default function FormStateHOC (InnerComponent) {
  return class FormState extends Component {
    static displayName = `FormStateHOC${InnerComponent.displayName || InnerComponent.name || ''}`;

    constructor (props) {
      super(props);

      this.state = {
        submitted: false,
        changed: {}
      };

      this.attach = this.attach.bind(this);
      this.shouldValidate = this.shouldValidate.bind(this);
      this.resetFormState = this.resetFormState.bind(this);
    }

    componentDidMount () {
      if (this.container == null) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`FormState is missing a valid DOM container to bind to`);
        }

        return;
      }

      this.container.addEventListener('change', event => {
        const name = event.target.getAttribute('name');

        if (name == null) {
          return;
        }

        this.state.changed[name] = true;
        this.forceUpdate();
      }, false);

      this.container.addEventListener('submit', () => {
        this.setState({
          submitted: true
        });
      }, true);
    }

    attach (component) {
      this.container = findDOMNode(component);
    }

    shouldValidate (name) {
      return this.state.submitted || this.state.changed[name];
    }

    resetFormState () {
      this.setState({
        submitted: false,
        changed: {}
      });
    }

    shouldBeInvalid (errors) {
      return name => this.shouldValidate(name) && errors[name].$invalid;
    }

    render () {
      return (
        <InnerComponent {...this.props}
                        shouldValidate={this.shouldValidate}
                        resetFormState={this.resetFormState}
                        shouldBeInvalid={this.shouldBeInvalid}
                        ref={this.attach} />
      );
    }
  }
}