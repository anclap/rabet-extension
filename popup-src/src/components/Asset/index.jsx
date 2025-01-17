import React from 'react';
import { Link } from 'react-router-dom';

import * as route from '../../staticRes/routes';
import showBalance from '../../helpers/showBalance';
import formatCurrency from '../../helpers/formatCurrency';
import numberWithCommas from '../../helpers/numberWithCommas';
import stellarLogo from '../../assets/images/stellar.png';
import checkedLogo from '../../assets/images/checked.svg';
import questionLogo from '../../assets/images/question-circle.png';

import styles from '../../pageComponents/AssetList/styles.less';

function Asset({
  item,
  index,
  activeCurrency,
  itemsLength,
  assets,
}) {
  const isNative = item.asset_type === 'native' && item.asset_code === 'XLM';

  const handleAssetImage = () => {
    if (isNative) {
      return stellarLogo;
    }

    const assetImage = assets.find((x) => x.asset_code === item.asset_code
      && x.asset_issuer === item.asset_issuer);

    if (assetImage && assetImage.logo) {
      return assetImage.logo;
    }

    return questionLogo;
  };

  const isAssetVerified = () => {
    if (isNative) {
      return true;
    }

    const assetImage = assets.find((x) => x.asset_code === item.asset_code
      && x.asset_issuer === item.asset_issuer);

    if (!assetImage) {
      return false;
    }

    return assetImage.is_verified === '1';
  };

  const value = isNative
    ? Number.parseFloat(item.balance, 10) * activeCurrency.value
    : (1 / Number.parseFloat(item.toNative, 10))
      * activeCurrency.value * Number.parseFloat(item.balance, 10);

  return (
    <li style={{ marginTop: index === 0 && '-18px' }} className={styles.listItem}>
      <Link to={isNative ? route.xlmAssetPage : `${route.assetsPage}/${item.asset_code}/${item.asset_issuer}`}>
        <div
          className={styles.border}
          style={{ borderBottom: !(index === itemsLength - 1) && '1px solid #f8f8f8' }}
        >

          <div className={styles.logoContainer}>
            <img src={handleAssetImage(item)} alt="logo" />
          </div>

          <div style={{ marginLeft: '6px' }}>
            <div className="pure-g">
              <div className={styles.value}>{numberWithCommas(formatCurrency(item.balance))}</div>
              <div className={styles.currency}>{item.asset_code}</div>

              {isAssetVerified(item) ? <img src={checkedLogo} className={styles.checked} alt="icon" /> : ''}
            </div>
            <div className={styles.cost}>
              {showBalance(numberWithCommas(formatCurrency(value)), activeCurrency.name)}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default Asset;
