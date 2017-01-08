import React from 'react';
import { connect } from 'dva';
import styles from './Work.css';

function Work(props) {
  return (
    <div className={styles.normal}>
      Route Component: 'Work'
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Work);
