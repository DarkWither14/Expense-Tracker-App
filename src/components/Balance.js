import React, { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import { LocaleContext } from '../contexts/LocaleContext';
import './Balance.css';

const Balance = () => {
  const { transactions } = useContext(TransactionContext);
  const { t } = useContext(LocaleContext);

  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1)
    .toFixed(2);

  return (
    <div className="balance-container">
      <h2 className="balance-title">{t('balance')}</h2>
      <p className="balance-amount">${total}</p>
      <div className="balance-details">
        <div className="income">
          <h4>{t('income')}</h4>
          <p>${income}</p>
        </div>
        <div className="expenses">
          <h4>{t('expense')}</h4>
          <p>${expense}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;