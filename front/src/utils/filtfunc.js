import { API_HOST } from 'app-constants';
import { createBrowserHistory } from 'history';
import { showError } from './notify';

export const filterObj = (s) => {
  // console.log('filterObj:',s);
  if (!Array.isArray(s[0])) {
    const fld = s[0].split('.')[0];
    return {
      fld,
      expr: s[1],
      val: s[2],
    };
  }
  const result = [];
  s.forEach((element) => {
    let exp = element;
    if (Array.isArray(element)) exp = filterObj(element);
    else exp = { c: element };
    result.push(exp);
  });
  return result;
};


export const removeEmpty = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else
    if (obj[key] !== undefined && obj[key] !== null) newObj[key] = obj[key];
  });
  return newObj;
};

export const convertToText = (obj) => {
  //create an array that will later be joined into a string.
  const string = [];
  //is object
  //    Both arrays and objects seem to return "object"
  //    when typeof(obj) is applied to them. So instead
  //    I am checking to see if they have the property
  //    join, which normal objects don't have but
  //    arrays do.
  if (obj === undefined || obj === null) {
    return String(obj);
  } else if (typeof obj === 'object' && obj.join === undefined) {
    for (const prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        string.push(`${prop}: ${convertToText(obj[prop])}`);
      }
    }
    return `{${string.join(',')}}`;
    //is array
  } else if (typeof obj === 'object' && obj.join !== undefined) {
    for (const prop in obj) {
      string.push(convertToText(obj[prop]));
    }
    return `[${string.join(',')}]`;
    //is function
  } else if (typeof obj === 'function') {
    string.push(obj.toString());
    //all other values can be done with JSON.stringify
  } else {
    string.push(JSON.stringify(obj));
  }
  return string.join(',');
};


export const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export const docLoad = async (options, { cls_name, cls_fields }) => {

  let filt = options.filter;
  if (options.searchExpr && options.searchValue !== null) {
    filt = [ options.searchExpr, options.searchOperation, options.searchValue ];
  }
  const _jsonFilter = filt ? ` jfilt:${convertToText(filterObj(filt))}` : '';

  let _offset = '';
  if (options.skip) _offset = ` offset:${options.skip}`;

  let _limit = 100;
  if (options.take) _limit = options.take;

  let _userOptions = '';
  if (options.userOptions) {
    _userOptions = ` options:${convertToText(options.userOptions)}`;
  }

  let _ref = '';
  if (options.ref) {
    _ref = ` ref:${options.ref}`;
    options.take = 1;
  }

  let _sort = '';
  if (options.sort) {
    const __sort = options.sort[0];
    _sort = ` sort:{selector:"${__sort.selector}" desc:"${__sort.desc}"}`;
  }

  let _qT = '';
  if (options.requireTotalCount) {
    _qT = `totalcount:${cls_name}(limit:1${_ref}${_jsonFilter}${_userOptions} 
      totalCount:1){totalcount}`;
  }

  const q = `{${_qT} ${cls_name}
    (limit:${_limit}${_jsonFilter}${_offset}${_sort}${_ref}${_userOptions})
    {${cls_fields}}}
  `;

  console.log(q);

  return fetch(API_HOST, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ query: q }),
    headers: { 'Content-Type': 'application/json' },
  }).then(handleErrors).then((resp) => resp.json())
    .then((resp) => {
      if (resp.data[cls_name] === null) {
        const message = resp.errors?.[0]?.message ?? 'Помилка отримання даних';
        showError(message);
        createBrowserHistory().push('/#/login');
        window.location.reload();
      }
      return {
        data: resp.data[cls_name],
        totalCount: options.requireTotalCount ?
          resp.data?.totalcount[0]?.totalcount :
          undefined,
      };
    });
};

export const catLoad = async (options, cls_name, cls_fields) => {

  let filt = options.filter;
  if (options.searchExpr && options.searchValue !== null) {
    filt = [ options.searchExpr, options.searchOperation, options.searchValue ];
  }
  const _jsonFilter = filt ? ` jfilt:${convertToText(filterObj(filt))}` : '';

  let _offset = '';
  if (options.skip) _offset = ` offset:${options.skip}`;

  let _limit = 100;
  if (options.take) _limit = options.take;

  let _userOptions = '';
  if (options.userOptions) {
    _userOptions = ` options:${convertToText(options.userOptions)}`;
  }

  let _qT = '';
  if (options.requireTotalCount) {
    _qT = `totalcount:${cls_name}
      (limit:1${_jsonFilter}${_userOptions} totalCount:1){totalcount}
    `;
  }

  const q = `{${_qT} ${cls_name}
    (limit:${_limit}${_jsonFilter}${_offset}${_userOptions}){${cls_fields}}}
  `;

  console.log(q);

  return fetch(API_HOST, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ query: q }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleErrors).then((resp) => resp.json())
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((resp) => {
      if (resp.data[cls_name] === null) {
        const message = resp.errors?.[0]?.message ?? 'Помилка отримання даних';
        showError(message);
        createBrowserHistory().push('/#/login');
        window.location.reload();
      }
      return {
        data: resp.data[cls_name],
        totalCount: options.requireTotalCount ?
          resp.data?.totalcount[0]?.totalcount :
          undefined,
      };
    });

};
