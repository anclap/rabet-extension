import { set, get } from './storage';
import { encrypt } from './crypto';

export default async (password) => {
  try {
    get('options')
    .then((options) => {
      let autoTimeLocker = 60;

      if (options && options.autoTimeLocker) {
        autoTimeLocker = options.autoTimeLocker;
      }

      const date = new Date();
      date.setMinutes( date.getMinutes() + autoTimeLocker );

      const object = {
        date: +date,
        name: encrypt(`${+date}`, password),
      };

      set('timer', object);
    })
  } catch (e) {
  }
};
