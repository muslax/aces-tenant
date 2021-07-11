import bcrypt from 'bcryptjs';
import { isEqual } from 'lodash';

export function pick(obj, ...keys) {
  const ret = {}
  keys.forEach((key) => {
    ret[key] = obj[key]
  })

  return ret
}

export function range(start, end) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// https://stackoverflow.com/questions/18745406/how-to-check-if-its-a-string-or-json
export function isJSON(data) {
  var ret = true;

  try {
    JSON.parse(data);
  } catch(e) {
    ret = false;
  }

  return ret;
}

export function getCurrentBatch(project, exclude = null) {
  const key = project._id;
  const data = window.localStorage.getItem(key);
  // const batches = project.batches;
  const batches = project.batches.filter(b => b._id != exclude);

  if (data != null && isJSON(data)) {
    console.log('getCurrentBatch')
    const parsed = JSON.parse(data);
    let batch = parsed;

    batches.forEach(b => {
      if (b._id == parsed?._id) {
        //  If not equal, swap
        if (!isEqual(b, parsed)) {
          window.localStorage.setItem(key, JSON.stringify(b));
          batch = b;
          console.log('SWAPPED')
        }
      }
    })
    return batch;
  } else {
    // const batch = batches[batches.length -1]; // newest
    const batch = batches[0]; // newest
    window.localStorage.setItem(key, JSON.stringify(batch));
    return batch;
  }
}

export function __getCurrentBatch(key, batches, exclude = null) {
  // const key = project._id;
  const data = window.localStorage.getItem(key);
  // const batches = project.batches;
  // const batches = project.batches.filter(b => b._id != exclude);
  const _batches = batches.filter(b => b._id != exclude);

  if (data != null && isJSON(data)) {
    console.log('getCurrentBatch')
    const parsed = JSON.parse(data);
    let batch = parsed;

    _batches.forEach(b => {
      if (b._id == parsed?._id) {
        //  If not equal, swap
        if (!isEqual(b, parsed)) {
          window.localStorage.setItem(key, JSON.stringify(b));
          batch = b;
          console.log('SWAPPED')
        }
      }
    })
    return batch;
  } else {
    // const batch = batches[batches.length -1]; // newest
    const batch = _batches[0]; // newest
    window.localStorage.setItem(key, JSON.stringify(batch));
    return batch;
  }
}

export function createRandomPassword(length = 6) {
  // No 0 o O 1 L l
  const upper = 'ABCDEFGHJKMNPRSTUVWXYZ';
  const lower = upper.toLocaleLowerCase();
  const nums = '2345678923456789';
  let array = (upper + lower + nums).split('');
  array.sort(() => Math.random() - 0.5);
  const password = array.join('').substr(0, length);
  const xfpwd = password.split('').reverse().join('');
  const saltRounds = 2;
  const hashed_password = bcrypt.hashSync(password, saltRounds);
  return { password, hashed_password, xfpwd }
}

export function createRandomUsername(length = 6) {
  const chars = 'abcdefghjkmnprstuvwxyz'
  const nums = '2345678923456789'
  let array = (chars + nums + chars + nums).split('')
  array.sort(() => Math.random() - 0.5);
  return array.join('').substr(0, length);
}

export function generatePOSTData(data) {
  return {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  }
}

export function isAdmin(user, project) {
  return user.username == project.admin.username
}
