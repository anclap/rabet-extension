import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';

import Input from 'Root/components/Input';
import SelectOption from 'Root/components/SelectOption';
import validateAddress from 'Root/helpers/validate/address';
import currentActiveAccount from 'Root/helpers/activeAccount';
import getAccountData from 'Root/helpers/horizon/isAddressFound';
import changeOperationAction from 'Root/actions/operations/change';

import styles from './styles.less';

class PaymentOps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selected: {},
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ selected: e });
  }
  //
  onSubmit (values) {
    // console.warn(values);
    // console.log({
    //   destination: values.destination,
    //   amount: values.amount,
    //   asset: this.state.selected.value,
    // });
    /*
      values.destination
      values.amount
      this.state.selected
    */
  }

  handleMax(values) {
    values.amount = this.state.selected.balance;
  }

  async validateForm (values) {
    const errors = {};

    if (!values.destination) {
      errors.destination = 'Required.';

      changeOperationAction(this.props.id, {
        checked: false,
      });
    }

    if (!values.amount) {
      errors.amount = 'Required.';

      changeOperationAction(this.props.id, {
        checked: false,
      });
    }

    if (!validateAddress(values.destination)) {
      errors.destination = 'Invalid.';

      changeOperationAction(this.props.id, {
        checked: false,
      });
    }

    if (!errors.amount && !errors.destination && this.state.selected.value) {
      const accountData = await getAccountData(values.destination);
      const { activeAccount, activeAccountIndex } = currentActiveAccount();

      let isAccountNew = false;
      let checked = true;

      let selectedTokenBalance;

      if (this.state.selected.value === 'XLM') {
        selectedTokenBalance = activeAccount.balances.find(x => x.asset_type === 'native');
      } else {
        selectedTokenBalance = activeAccount.balances.find(x => x.asset_code === this.state.selected.value);
      }

      if (!selectedTokenBalance) {
        selectedTokenBalance = {
          balance: 0,
        };
      }

      if (Number(selectedTokenBalance.balance || '0') < values.amount) {
        errors.amount = `Insufficient ${this.state.selected.value} balance.`;

        checked = false;

        changeOperationAction(this.props.id, {
          checked: false,
        });
      } else {
        if (accountData.status === 404) {
          isAccountNew = true;

          if (this.state.selected.value !== 'XLM') {
            errors.destination = 'Inactive accounts cannot receive tokens.';

            changeOperationAction(this.props.id, {
              checked: false,
            });

            checked = false;
          }

        } else if (accountData.status === 400) {
          errors.destination = 'Wrong.';

          checked: false;
        } else {
          const destinationTokens = accountData.balances || [];

          let selectedToken = destinationTokens.find(x => x.asset_type === 'native')

          if (this.state.selected.value !== 'XLM') {
            selectedToken = destinationTokens.find(x => x.asset_code === this.state.selected.value);
          }

          if (!selectedToken) {
            errors.destination = 'The destination account does not trust the asset you are attempting to send.';

            changeOperationAction(this.props.id, {
              checked: false,
            });

            checked = false;
          } else {
            if (Number(selectedToken.limit) < Number(values.amount) + Number(selectedToken.balance)) {
              errors.destination = 'The destination account balance would exceed the trust of the destination in the asset.';

              changeOperationAction(this.props.id, {
                checked: false,
              });

              checked = false;
            }
          }
        }
      }

      changeOperationAction(this.props.id, {
        checked,
        isAccountNew,
        amount: values.amount,
        destination: values.destination,
        asset: this.state.selected.value,
      });
    }

    return errors;
  }

  componentDidMount() {
    const { activeAccount, activeAccountIndex } = currentActiveAccount();

    const { balances } = activeAccount;

    const list = [];

    list.push({
      value: 'XLM',
      label: 'XLM',
      balance: activeAccount.balance,
    });

    for (let i = 0; i < balances.length; i++) {
      list.push({
        value: balances[i].asset_code,
        label: balances[i].asset_code,
        balance: balances[i].balance,
      });
    }

    this.setState({ list });
  }

  render() {
    const { list } = this.state;

    return (
        <Form
          onSubmit={ this.onSubmit }
          validate={ (values) => this.validateForm(values) }
          render={ ({submitError, handleSubmit, submitting, values}) => (
                <form className={ classNames(styles.form, 'form') } onSubmit={ handleSubmit }>
                  <Field name="destination">
                    {({input, meta}) => (
                       <div className="group">
                         <label className="label-primary">Destination</label>

                         <Input
                           type="text"
                           placeholder="G…"
                           size="input-medium"
                           input={ input }
                           meta={ meta }
                         />
                       </div>
                    )}
                  </Field>

                  <Field name="amount">
                    {({input, meta}) => (
                        <div className="pure-g group">
                          <div className={ styles.selectInput }>
                            <label className="label-primary">
                              <span>Amount</span>
                              <span>Max <span className="icon-caret-up" /></span>
                            </label>

                            <Input
                              type="number"
                              placeholder="1"
                              size="input-medium"
                              input={ input }
                              meta={ meta }
                            />
                          </div>

                          <div className={ styles.select }>
                            <SelectOption
                              items={list}
                              onChange={ this.onChange }
                              variant="select-outlined"
                              defaultValue={list[0]}
                            />
                          </div>
                        </div>
                    )}
                  </Field>

                  {submitError && <div className="error">{submitError}</div>}
                </form>
            ) }
        />
    );
  }
}

PaymentOps.propTypes = {};

export default PaymentOps;
