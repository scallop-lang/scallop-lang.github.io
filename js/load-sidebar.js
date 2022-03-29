class SidebarElement {
  constructor(level, text, target_id) {
    this.level = level;
    this.text = text;
    this.target_id = target_id;
    this.sub_elements = [];
  }

  to_html() {
    let sub_elements_html = "";
    if (this.sub_elements.length > 0) {
      sub_elements_html = `<ul>${this.sub_elements.map(e => e.to_html()).join("")}</ul>`;
    }
    return `<li><a href="#${this.target_id}">${this.text}</a>${sub_elements_html}</li>`;
  }
}

class SidebarElementStack {
  constructor() {
    this.id_counter = 0;
    this.stable = [];
    this.stack = [];
  }

  add_element(elem) {
    let curr_level = parseInt($(elem).prop("tagName")[1]);
    while (curr_level - 1 < this.stack.length) {
      this.pop_one();
    }
    let id = `header-${this.id_counter}`;
    $(elem).attr("id", id);
    this.id_counter += 1;
    this.stack.push(new SidebarElement(curr_level, $(elem).text(), id));
  }

  pop_one() {
    let last_element = this.stack.pop();
    if (this.stack.length == 0) {
      this.stable.push(last_element);
    } else {
      this.stack[this.stack.length - 1].sub_elements.push(last_element);
    }
  }

  stablize_stack() {
    while (this.stack.length > 0) {
      this.pop_one();
    }
  }

  to_html() {
    return `<ul>${this.stable.map(e => e.to_html()).join("")}</ul>`;
  }
}

function loadSidebar() {
  // Read the markdown content and populate element stack
  let stack = new SidebarElementStack();
  $(".markdown-content").children("h1, h2, h3, h4, h5, h6").each(function () {
    stack.add_element(this);
  });
  stack.stablize_stack();

  // Turn the stack into an html
  $(".markdown-sidebar").html(stack.to_html());
}
