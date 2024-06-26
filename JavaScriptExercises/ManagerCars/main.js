const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const app = (() => {
  const root = $("#root");
  const input = $("#input");
  const submit = $("#submit");

  const cars = ["BMW"];
  return {
    add(car) {
      cars.push(car);
    },
    delete(index) {
      cars.splice(index, 1);
    },
    render() {
      const html = cars
        .map(
          (car, index) => `<li>
          ${car}
      <span class="delete" data-index="${index}">&times</span>
      </li>`
        )
        .join("");
      root.innerHTML = html;
    },
    handleDelete(e) {
      const deleteBtn = e.target.closest(".delete");

      if (deleteBtn) {
        // get ra value của attribute data-index
        // data-index là một property tạo ra một object tên là dataset của JS trong DOM
        const index = deleteBtn.dataset.index;

        // xóa
        this.delete(index);
        this.render();
      }
    },
    init() {
      // Handle DOM events
      submit.onclick = () => {
        const car = input.value;
        this.add(car);
        this.render();

        input.value = null;
        input.focus();
      };
      root.onclick = this.handleDelete.bind(this);
      this.render();
    },
  };
})();

app.init();
