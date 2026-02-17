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

  bindIncrement(handler) {
    this.incrementButton.addEventListener("click", handler);
  }

  render(count) {
    this.countElement.textContent = String(count);
  }
}

class CounterController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindIncrement(this.handleIncrement.bind(this));
    this.view.render(this.model.getCount());
  }

  handleIncrement() {
    this.model.increment();
    this.view.render(this.model.getCount());
  }
}

new CounterController(new CounterModel(), new CounterView());
