class CounterModel {
  constructor(initialCount = 0) {
    this.count = initialCount;
  }
}

class CounterViewModel {
  constructor(model) {
    this.model = model;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.model.count);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.model.count));
  }

  increment() {
    this.model.count += 1;
    this.notify();
  }

  decrement() {
    this.model.count -= 1;
    this.notify();
  }
}

class CounterView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.countElement = document.getElementById("count-value");
    this.incrementButton = document.getElementById("increment-btn");
    this.decrementButton = document.getElementById("decrement-btn");

    this.incrementButton.addEventListener("click", () => this.viewModel.increment());
    this.decrementButton.addEventListener("click", () => this.viewModel.decrement());
  }

  render(count) {
    this.countElement.textContent = String(count);
  }
}

const model = new CounterModel(0);
const viewModel = new CounterViewModel(model);
const view = new CounterView(viewModel);

viewModel.subscribe((count) => view.render(count));
