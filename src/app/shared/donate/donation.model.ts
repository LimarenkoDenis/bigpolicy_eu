export class DonationModel {
	// TODO
  _id: string;
  virtual = false;
  donorId: string;
  targetId: string;
  // FIXME transactionId in external system. Use for completeness check.
  externalId: string;
  // Leader, Project, or Task
  targetType: string;
  amount: number;
  dateStarted: Date;
  // FIXME Indirect pointer to transaction completeness.
  // Fill this date after transaction has been completeted in external payment system
  dateCompleted: Date;
  description: string;
  startDateInputValue: string = this.toDateInputValue(this.dateStarted);
  endDateInputValue: string = this.toDateInputValue(this.dateCompleted);
  status = 'unfinished';
  // Not stored in DB. Used as backlink for liqpay.
  result_url: String;
  server_url: String;

  toString() {
    return JSON.stringify({
      _id: this._id,
      donorId: this.donorId,
      virtual: this.virtual,
      targetId: this.targetId,
      externalId: this.externalId,
      targetType: this.targetType,
      amount: this.amount,
      dateStarted: this.toDateInputValue(this.dateStarted),
      dateEnded: this.toDateInputValue(this.dateCompleted),
      description: this.description,
      result_url: this.result_url,
      server_url: this.server_url,
      status: this.status
    });
  }

  /**
  * Populate model from a json representation loaded from DB
  */
  parseData(data) {
    for (const item in data) {
      if (data.hasOwnProperty(item)) {
        this[item] = data[item];
      }
    }
    this.startDateInputValue = this.toDateInputValue(this.dateStarted);
    this.endDateInputValue = this.toDateInputValue(this.dateCompleted);
  }

  private toDateInputValue(dateToParse) {
    if (!dateToParse) {
      return '';
    }
    const date = new Date(dateToParse);
    const local = new Date(dateToParse);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
}