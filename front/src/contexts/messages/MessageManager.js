import { differenceBy, zipObject } from 'lodash';
import { Observer } from './Observer';

export class MessageManager {
  constructor(initialMessageList, idKey, typeKey) {
    this.messageList = initialMessageList;
    this.registeredVars = [];
    this.observer = new Observer({});
    this.firstUpdate = true;
    this.idKey = idKey;
    this.typeKey = typeKey;
  }

  _calculateDiff(newMessageList) {
    return differenceBy(this.messageList, newMessageList, this.idKey)
      .concat(differenceBy(newMessageList, this.messageList, this.idKey));
  }

  update(fn) {
    const newMessageList = fn(this.messageList);
    if (!Array.isArray(newMessageList)) {
      throw new Error('The function must return an array');
    }
    const diff = this._calculateDiff(newMessageList);
    this.messageList = newMessageList;
    let updatedTypes;
    if (this.firstUpdate) {
      updatedTypes = [ ...new Set(
        this.registeredVars.map((varObj) => varObj.deps).flat(1),
      ) ];
      this.firstUpdate = false;
    } else {
      updatedTypes = [ ...new Set(diff.map((msg) => msg?.[this.typeKey])) ];
    }

    const newValues = {};
    this.registeredVars.forEach((varObj) => {
      if (updatedTypes.some((type) => varObj.deps.includes(type))) {
        Object.assign(
          newValues,
          zipObject(varObj.names, varObj.calc(this.messageList)),
        );
      }
    });

    this.observer.update(newValues);
  }

  init() {
    this.update((list) => list);
  }

  reset() {
    this.observer.resetState();
    this.firstUpdate = true;
    this.update(() => []);
  }

  getVars(names) {
    return this.observer.getValues(names);
  }

  registerVars(names, calc, deps) {
    this.registeredVars.push({ names, calc, deps });
  }

  subscribeVars(vars, onChange) {
    return this.observer.subscribe(vars, onChange);
  }

}
