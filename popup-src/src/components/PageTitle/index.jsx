/* eslint-disable no-unneeded-ternary */
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as route from '../../staticRes/routes';

import styles from './styles.less';

const PageTitle = ({
  title,
  status,
  statusTitle,
  alreadyLoaded,
  ...props
}) => {
  const generateTitle = () => {
    if (status) {
      return (
        <h1
          className={classNames(
            styles.status,
            status === 'warn' ? styles.warn : styles.success,
          )}
        >
          <span />
          {statusTitle}
        </h1>
      );
    }

    if (title) {
      return <h1 className={styles.title}>{title}</h1>;
    }

    return null;
  };

  const { accounts } = props;

  const handleClose = () => {
    if (accounts.length) {
      return props.history.push({
        pathname: route.homePage,
        state: {
          alreadyLoaded: alreadyLoaded === undefined ? true : false,
        },
      });
    }

    return props.history.goBack();
  };

  return (
    <div className={styles.div}>
      <div>{generateTitle()}</div>

      <div className={styles.icon}>
        <span
          className="icon-multiply"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default withRouter(
  connect((state) => ({
    accounts: state.accounts,
  }))(PageTitle),
);
