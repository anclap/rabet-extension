import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';

const Note = ({children}) => {
  return (
      <div className={ styles.note }>
        {children}
      </div>
  );
};

Note.propTypes = {

};

export default Note;
