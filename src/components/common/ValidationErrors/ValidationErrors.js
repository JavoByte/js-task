import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';

function hasErrors(errors, fieldName) {
  if (!errors) {
    return false;
  }
  if (!errors[fieldName]) {
    return false;
  }
  return true;
}

class ValidationErrors extends React.Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    errors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  };

  static defaultProps = {
    errors: null,
  };

  render() {
    if (!hasErrors(this.props.errors, this.props.field)) {
      return null;
    }
    return (
      <React.Fragment>
        {
          this.props.errors[this.props.field].map((error, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <FormFeedback key={i}>
              { error }
            </FormFeedback>
          ))
        }
      </React.Fragment>
    );
  }
}

ValidationErrors.hasErrors = hasErrors;

export default ValidationErrors;
