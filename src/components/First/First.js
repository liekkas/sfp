import React from 'react';
import styles from './First.css';

class First extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showWord: true
    }
  }

  render() {

    return (
      <div className={styles.normal} style={{backgroundImage: `url(${this.props.data.cover})`}}>
      </div>
    );
  }
}

First.propTypes = {
  data: React.PropTypes.object
}

First.defaultProps = {
  data: {}
}

export default First;
