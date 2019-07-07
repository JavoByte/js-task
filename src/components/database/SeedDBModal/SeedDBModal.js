import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap';

export default class SeedDBModal extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onCountChange = this.onCountChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    count: '',
    error: null,
  };

  componentWillReceiveProps(props) {
    if (props.show && !this.props.show) {
      this.setState({
        count: '',
        error: null,
      });
    }
  }

  onCountChange(evt) {
    let { value } = evt.target;
    value = value.replace(/[\D]+/);
    this.setState({
      error: null,
      count: parseInt(value, 10),
    });
  }

  onSubmit() {
    const { count } = this.state;
    if (!count) {
      this.setState({ error: 'Count can\'t be blank and must be greater than 0' });
    } else if (count > 1000) {
      this.setState({ error: 'Count can\'t be blank greater than 1,000' });
    } else {
      this.props.confirm(count);
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.show} toggle={this.props.cancel}>
        <ModalHeader>
          { this.props.title }
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              { this.props.message }
            </Label>
            <Input
              type="number"
              valid={this.state.error ? false : null}
              autoFocus
              value={this.state.count}
              onChange={this.onCountChange}
            />
            <FormFeedback>
              { this.state.error }
            </FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="dark" outline onClick={this.props.cancel}>
            Cancel
          </Button>
          {' '}
          <Button color="primary" onClick={this.onSubmit}>
            Seed
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
