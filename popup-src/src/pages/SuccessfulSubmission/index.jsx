import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../../components/Header';
import * as route from '../../staticRes/routes';
import PageTitle from '../../components/PageTitle';
import NoteCard from '../../pageComponents/NoteCard';

import styles from './styles.less';

const SuccessfulSubmission = ({ history }) => {
  const handleClick = () => {
    history.push({
      pathname: route.homePage,
      state: {
        alreadyLoaded: false,
      },
    });
  };

  return (
    <>
      <Header />

      <PageTitle alreadyLoaded={false} />

      <NoteCard
        copy
        btnText="OK"
        icon="icon-checkmark"
        iconClass={styles.icon}
        title="Transaction Sent"
        handleClick={handleClick}
        message={history.location.state.hash || 'SUCCESS!'}
      />
    </>
  );
};

export default withRouter(SuccessfulSubmission);
