# react-kay

[kay](https://github.com/Zhouzi/kay)'s React Higher Order Components

## Documentation

### FormMessagesHOC

Simple wrapper over kay's error map.

**Example**

```javascript
import React, { PropTypes } from 'react';
import FormMessagesHOC from 'react-kay/FormMessagesHOC';

function FormMessages ({ messages }) {
  return (
    <ul className="errors">
      {messages.map((message, index) => (
          <li key={index}>
            {message}
          </li>
      ))}
    </ul>
  );
}

FormMessages.propTypes = {
  messages: PropTypes.array.isRequired
};

export default FormMessagesHOC(FormMessages);
```

### FormStateHOC

Provides a few utilities to properly deal with form feedback.

* **shouldBeInvalid**: fed with a map of errors, provides a function that returns whether or not an input should be invalid (according to its state and validation).
* **shouldValidate**: accepts an input's name and returns whether or not it should be validated (after the user interacted with the input or the form has been submitted).
* **resetFormState**: resets the form state.

**Example**

```javascript
import React, { Component, PropTypes} from 'react';
import kay from 'kkay';
import FormStateHOC from 'react-kay/FormStateHOC';
import FormMessages from './FormMessages';

const user = kay.schema({
  name:
    kay
    .string()
    .required().message('Please fill in your username'),

  email:
    kay
      .string()
      .required().message('Please fill in your email address in order to confirm your account')
      .pattern(/[^@]+@[^@]+/).message('Please fill in an email address in the form of john@email.com')
});

class SignupForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      email: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit (e) {
    e.preventDefault;

    const errors = user.validate(this.state);

    if (errors.$invalid) {
      return;
    }

    // do something

    this.setState({
      name: '',
      email: ''
    });

    this.resetFormState();
  }

  render () {
    const errors = user.validate(this.state);
    const isInvalid = this.props.shouldBeInvalid(errors);

    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="firstname">
          First name:
        </label>

        <input type="text"
               id="name"
               name="name"
               className={isInvalid('name') ? 'invalid' : ''}
               onChange="e => this.setState({ name: e.target.value })"
               value={this.state.name} />

        {this.props.shouldValidate('name') && (
          <FormMessages errors={errors.name} />
        )}

        <label htmlFor="email">
          Email address:
        </label>

        <input type="email"
               id="email"
               name="email"
               className={isInvalid('email') ? 'invalid' : ''}
               onChange="e => this.setState({ email: e.target.value })"
               value={this.state.email} />

        {this.props.shouldValidate('email') && (
          <FormMessages errors={errors.email} />
        )}
      </form>
    );
  }
}

SignupForm.propTypes = {
  shouldBeInvalid: PropTypes.func.isRequired,
  shouldValidate: PropTypes.func.isRequired,
  resetFormState: PropTypes.func.isRequired
};

export default FormStateHOC(SignupForm);
```