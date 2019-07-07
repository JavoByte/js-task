import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Dropzone from 'react-dropzone';
import { Button } from 'reactstrap';
import './ImageInput.css';

class ImageInput extends React.Component {
  static propTypes = {
    defaultUrl: PropTypes.string,
    onImageSelected: PropTypes.func,
  };

  static defaultProps = {
    defaultUrl: '/img/profilePlaceholder.png',
    onImageSelected: null,
  };

  constructor(props) {
    super(props);
    this.renderDropzoneContent = this.renderDropzoneContent.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  state = {
    img_url: this.props.defaultUrl,
    dragging: false,
  };

  componentWillMount() {
    if (!this.state.img_url) {
      this.setState({
        img_url: this.constructor.defaultProps.defaultUrl,
      });
    }
  }

  onDrop(files) {
    this.setState({
      dragging: false,
    });
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        const { result } = readEvent.target;
        this.setState({
          img_url: result,
        }, () => {
          if (this.props.onImageSelected) {
            this.props.onImageSelected(file, result);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onDragEnter() {
    this.setState({
      dragging: true,
    });
  }

  onDragLeave() {
    this.setState({
      dragging: false,
    });
  }

  renderDropzoneContent() {
    let text = (
      <p>
        Choose <span className="d-none d-md-inline">or drag</span> an image
      </p>
    );
    if (this.state.dragging) {
      text = (
        <p>
          Drop your image here
        </p>
      );
    }
    return (
      <div className="dropzone-content">
        { text }
      </div>
    );
  }

  render() {
    const imgUrl = this.state.img_url;
    return (
      <div className="dropzone-container mb-4">
        <Dropzone
          accept="image/*"
          multiple={false}
          className={cx('dropzone', {
            dragging: this.state.dragging,
          })}
          activeClassName="active"
          rejectClassName="reject"
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          ref={(ref) => { this.dropzone = ref; }}
        >
          <img src={imgUrl} alt="preview" />
          { this.renderDropzoneContent() }
        </Dropzone>

        <Button type="button" color="link" onClick={() => this.dropzone.open()}>
          Choose <span className="d-none d-md-inline">or drag</span> an image
        </Button>
      </div>
    );
  }
}

export default ImageInput;
