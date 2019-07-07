import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import Merchant from '../../../models/Merchant';
import ValidationErrors from '../../common/ValidationErrors';
import ImageInput from '../../common/ImageInput';

function phoneSanitizer(value) {
  return value.replace(/[^\d\s]+/, '');
}

function emailSanitizer(value) {
  return value.toLowerCase().replace(/[^\-._a-z0-9@]/, '');
}

class MerchantForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    saving: PropTypes.bool.isRequired,
    merchant: PropTypes.instanceOf(Merchant),
    apiErrors: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  };

  static defaultProps = {
    merchant: new Merchant({}),
    apiErrors: null,
  };

  constructor(props) {
    super(props);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.onAvatarSelected = this.onAvatarSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.togglePremium = this.togglePremium.bind(this);
  }

  state = {
    values: {},
  };

  componentWillMount() {
    const { attributes } = Merchant;
    const state = {};
    const { merchant } = this.props;
    attributes.forEach((attr) => {
      state[attr] = merchant[attr] || '';
    });
    this.setState({ values: state });
  }

  onTextInputChange(field, event, sanitizer = text => text) {
    event.persist();
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [field]: sanitizer(event.target.value),
      },
    }));
  }

  onAvatarSelected(avatar) {
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        avatar,
      },
    }));
  }

  onSubmit(event) {
    event.preventDefault();
    const { values } = this.state;
    this.props.onSubmit(new Merchant({ ...this.props.merchant.toJson(), ...values }));
  }

  togglePremium() {
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        has_premium: !prevState.values.has_premium,
      },
    }));
  }

  render() {
    const { apiErrors } = this.props;
    return (
      <Form
        onSubmit={this.onSubmit}
      >
        <FormGroup>
          <ImageInput
            onImageSelected={this.onAvatarSelected}
            defaultUrl={this.props.merchant.avatar_url}
          />
        </FormGroup>

        <FormGroup row>
          <Label className="text-md-right" md={2}>First name</Label>
          <Col>
            <Input
              type="text"
              value={this.state.values.first_name}
              placeholder="John"
              valid={ValidationErrors.hasErrors(apiErrors, 'first_name') ? false : null}
              onChange={evt => this.onTextInputChange('first_name', evt)}
            />
            <ValidationErrors errors={apiErrors} field="first_name" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="text-md-right" md={2}>Last name</Label>
          <Col>
            <Input
              type="text"
              value={this.state.values.last_name}
              placeholder="Doe"
              valid={ValidationErrors.hasErrors(apiErrors, 'last_name') ? false : null}
              onChange={evt => this.onTextInputChange('last_name', evt)}
            />
            <ValidationErrors errors={apiErrors} field="last_name" />
          </Col>
        </FormGroup>

        <Row>
          <Col xs={12} md={6}>
            <FormGroup row>
              <Label className="text-md-right" md={4}>E-Mail</Label>
              <Col>
                <Input
                  type="email"
                  value={this.state.values.email}
                  placeholder="john.doe@example.com"
                  valid={ValidationErrors.hasErrors(apiErrors, 'email') ? false : null}
                  onChange={evt => this.onTextInputChange('email', evt, emailSanitizer)}
                />
                <ValidationErrors errors={apiErrors} field="email" />
              </Col>
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <FormGroup row>
              <Label className="text-md-right" md={3}>Phone</Label>
              <Col>
                <Input
                  type="text"
                  placeholder="555 555 555 555"
                  maxLength={18}
                  value={this.state.values.phone}
                  valid={ValidationErrors.hasErrors(apiErrors, 'phone') ? false : null}
                  onChange={evt => this.onTextInputChange('phone', evt, phoneSanitizer)}
                />
                <ValidationErrors errors={apiErrors} field="phone" />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup row check>
          <Col sm={{ offset: 2 }}>
            <Label className="text-md-right" check>
              <Input
                type="checkbox"
                checked={this.state.values.has_premium}
                onChange={this.togglePremium}
              />
              {' '}
              Has premium
            </Label>
          </Col>
        </FormGroup>
        <FormGroup row className="mt-3">
          <Col sm={{ offset: 2 }} className="text-center text-md-left">
            {
              !this.props.saving ?
                <Button type="submit" color="primary">
                  Save
                </Button>
              :
                <Button type="button" color="primary" disabled>
                  <i className="fas fa-spinner fa-spin" /> Saving
                </Button>
            }
          </Col>
        </FormGroup>


      </Form>
    );
  }
}

export default MerchantForm;
