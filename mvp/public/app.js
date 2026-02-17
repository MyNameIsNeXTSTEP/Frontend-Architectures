class CounterModel {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
  }

  getCount() {
    return this.count;
  }
}

class CounterView {
  constructor() {
    this.countElement = document.getElementById("count-value");
    this.incrementButton = document.getElementById("increment-btn");
  }

  setCount(count) {
    this.countElement.textContent = String(count);
  }

  onIncrement(handler) {
    this.incrementButton.addEventListener("click", handler);
  }
}

class CounterPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.onIncrement(() => this.handleIncrement());
    this.view.setCount(this.model.getCount());
  }

  handleIncrement() {
    this.model.increment();
    this.view.setCount(this.model.getCount());
  }
}

new CounterPresenter(new CounterView(), new CounterModel());
