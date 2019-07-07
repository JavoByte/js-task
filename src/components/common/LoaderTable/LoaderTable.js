import React from 'react';
import './LoaderTable.css';

class LoaderTable extends React.Component {
  render() {
    return (
      <div className="loader">
        <i className="fas fa-spinner fa-spin" />
      </div>
    );
  }
}

export default LoaderTable;
