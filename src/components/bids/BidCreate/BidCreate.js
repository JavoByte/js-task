import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import ValidationErrors from '../../common/ValidationErrors';

export default class BidCreate extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
    errors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  };

  static defaultProps = {
    errors: null,
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onAmountKeyPress = this.onAmountKeyPress.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.submit = this.submit.bind(this);
  }

  state = {
    values: {},
  };

  componentWillMount() {
    this.resetForm();
  }

  componentWillReceiveProps(props) {
    if (!this.props.show && props.show) {
      this.resetForm();
    }
  }

  onInputChange(field, event) {
    const { value } = event.target;
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [field]: value,
      },
    }));
  }

  onAmountChange(event) {
    const { value } = event.target;
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        amount: value,
      },
    }));
  }

  onAmountKeyPress(event) {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  resetForm() {
    this.setState({
      values: {
        car_title: '',
        amount: '',
      },
    });
  }

  submit() {
    const { values } = this.state;
    this.props.save(values);
  }

  render() {
    const { errors } = this.props;
    return (
      <Modal isOpen={this.props.show} toggle={this.props.cancel}>
        <ModalHeader>
          Add new bid
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={this.submit}>
            <FormGroup row>
              <Label sm={4} md={3}>
                Car Title
              </Label>
              <Col>
                <Input
                  autoFocus
                  type="text"
                  value={this.state.values.car_title}
                  valid={ValidationErrors.hasErrors(errors, 'car_title') ? false : null}
                  onChange={evt => this.onInputChange('car_title', evt)}
                />
                <ValidationErrors errors={errors} field="car_title" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4} md={3}>
                Amount
              </Label>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    €
                  </InputGroupAddon>
                  <Input
                    type="number"
                    value={this.state.values.amount}
                    onChange={this.onAmountChange}
                    onKeyPress={this.onAmountKeyPress}
                    valid={ValidationErrors.hasErrors(errors, 'amount') ? false : null}
                  />
                  <ValidationErrors errors={errors} field="amount" />
                </InputGroup>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        {
          this.props.saving ?
            <ModalFooter>
              <Button disabled color="primary">
                <i className="fas fa-spinner fa-spin" /> Saving...
              </Button>
            </ModalFooter>
          :
            <ModalFooter>
              <Button onClick={this.props.cancel} color="dark" outline>
                Cancel
              </Button>
              <Button onClick={this.submit} color="primary">
                Save
              </Button>
            </ModalFooter>
        }
      </Modal>
    );
  }
}
