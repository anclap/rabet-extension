import shortid from 'shortid';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

import Card from 'Root/components/Card';
import shorter from 'Root/helpers/shorter';
import Button from 'Root/components/Button';
import CopyText from 'Root/components/CopyText';
import PageTitle from 'Root/components/PageTitle';
import operationMapper from 'Root/helpers/operationMapper';
import currentActiveAccount from 'Root/helpers/activeAccount';

import styles from './styles.less';

class Confirm extends Component {
  render() {
    const { activeAccount, activeAccountIndex } = currentActiveAccount();
    const networkStatus = this.props.options.network === 'MAINNET' ? 'success' : 'warn';
    const network = this.props.options.network === 'MAINNET' ? 'Main network' : 'Test network';
    const { operations } = this.props;

    const operationsMapped = [];

    for (const operation of operations) {
      operationsMapped.push(operationMapper(operation));
    }

    console.log(operationsMapped);

    return (
        <>
          <div className={ classNames(styles.confirm, 'hidden-scroll content-scroll') }>
            <PageTitle status={networkStatus} statusTitle={network} />

            <div className="content">
              <p className={ styles.source }>
                <span className={ styles.sourceTitle }>Source account:</span>
                <span className={ styles.sourceValue }>
                  <CopyText text="GAMMnonojnVS3O" button={shorter(activeAccount.publicKey, 5)} />
                </span>
              </p>

              {operationsMapped.map((item, index) => (
                  <div className={ styles.box } key={shortid.generate()}>
                    <Card type="card-secondary">
                      {item.title &&  <h1 className={ styles.title }>#{index + 1} {item.title}</h1>}
                      {item.info.map((info) => (
                          <div key={ info.title }>
                            <h2
                              className={ styles.valueTitle }
                              style={ {margin: !item.title && '0'} }
                            >{info.title}</h2>
                            <p className={ styles.value }>{info.value}</p>
                            {info.error &&
                            <p className="error">
                              <span className="icon-exclamation-circle"/>{' '}{info.error}
                            </p>
                            }
                          </div>
                      ))}
                    </Card>
                  </div>
              ))}
            </div>
          </div>
          <div className={ classNames('pure-g justify-end', styles.buttons) }>
            <Button
              variant="btn-default"
              size="btn-medium"
              content="Back"
              onClick={() => {this.props.history.goBack()}}
            />

            <Button
              variant="btn-primary"
              size="btn-medium"
              content="Confirm"
            />
          </div>
        </>
    );
  }
}

export default withRouter(connect(state => ({
  options: state.options,
  operations: state.operations,
}))(Confirm));
