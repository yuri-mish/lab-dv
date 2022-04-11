export class Observer {
  constructor(initialValues) {
    this.initialValues = initialValues ?? {};
    this.values = { ...this.initialValues };
    this.batches = {};
  }

  _removeBatch(batch) {
    Object.values(this.batches).forEach((batchSet) => batchSet.delete(batch));
  }

  get state() {
    return this.values;
  }

  resetState() {
    this.values = { ...this.initialValues };
    this.batches = {};
  }

  getValue(field) {
    return this.values[field];
  }

  getValues(fields) {
    return fields.map((field) => this.values[field]);
  }

  update(diffObj) {
    const updateSet = new Set();
    Object.entries(this.batches).forEach(([ field, batchSet ]) => {
      if (field in diffObj) {
        batchSet.forEach((batch) => updateSet.add(batch));
      }
    });

    this.values = { ...this.values, ...diffObj };

    updateSet.forEach((batch) => {
      batch.callback(this.getValues(batch.fields));
    });
  }

  subscribe(fields, onChange) {
    const batch = {
      fields,
      callback: onChange,
    };

    fields.forEach((field) => {
      if (!this.batches[field]) {
        this.batches[field] = new Set();
      }
      this.batches[field].add(batch);
    });

    return () => {
      this._removeBatch(batch);
    };
  }
}
