import React, {Component} from 'react';
import classNames from 'classnames';
import {Field, Form} from 'react-final-form';
import randomColor from 'randomcolor';

import * as route from 'Root/staticRes/routes';
import sample from 'Root/assets/images/stellar.png';
import Input from 'Root/components/Input';
import Button from 'Root/components/Button';

import styles from './styles.less';

class SearchAsset extends Component {
  onSubmit (values) {
    // console.warn(values);
  }

  async validateForm (values) {
    const errors = {};
    // console.warn(values)
  }

  render() {

    const colorSetting = {luminosity: 'bright', format: 'rgba', alpha: 0.3};

    const items = [
      {name: 'DAI', web: 'Sample.com', logo: '', color: randomColor(colorSetting), active: true},
      {name: 'USDT', web: 'Sample.com', logo: '', color: randomColor(colorSetting), active: false},
      {name: 'STL', web: 'Sample.com', logo: '', color: randomColor(colorSetting), active: true},
      {name: 'DAO', web: 'Sample.com', logo: '', color: randomColor(colorSetting), active: true},
      {name: 'AAA', web: 'Sample.com', logo: '', color: randomColor(colorSetting), active: true},
    ];

    return (
        <div className={styles.content}>
          <Form
              onSubmit={(values) => { this.onSubmit(values) }}
              validate={ (values) => this.validateForm(values) }
              render={ ({submitError, handleSubmit, submitting, values , form, pristine}) => (
                  <form className={ classNames(styles.form, 'form') } onSubmit={ handleSubmit }>
                    <Field name="token">
                      {({input, meta}) => (
                            <Input
                                type="text"
                                placeholder="&#xe915;&nbsp;&nbsp;Search tokens"
                                size="input-medium"
                                input={ input }
                                meta={ meta }
                                style={{fontFamily: 'Roboto, \'icomoon\''}}
                                autoFocus
                            />
                      )}
                    </Field>
                    <h6 className={styles.result}>Search result</h6>
                    <ul className={classNames(styles.list, 'hidden-scroll', styles.scroll)}>
                      {items.map((item, index) => (
                          <li key={index} className={styles.item} aria-disabled={!item.active}>
                            <div className={styles.logo} style={{backgroundColor: `${item.color}`}} >
                              <img src={sample} alt="logo"/>
                            </div>
                            <h4 className={styles.name}>{item.name}</h4>
                            <p className={styles.web}>{item.web}</p>
                          </li>
                      ))}
                    </ul>
                    <div className={ classNames('pure-g justify-end', styles.buttons) }>
                      <Button
                          variant="btn-default"
                          size="btn-medium"
                          content="Cancel"
                          onClick={() => { this.props.history.push({
                            pathname: route.homePage,
                            state: {
                              alreadyLoaded: true,
                            },
                          }) }}
                      />

                      <Button
                          type="submit"
                          variant="btn-primary"
                          size="btn-medium"
                          content="Add"
                          disabled={ submitting }
                      />
                    </div>
                  </form>
              )}
          />
        </div>
    );
  }
}

export default SearchAsset;
