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
    return `<li><a href="#${this.target_id}" class="sidebar-link" id="sidebar-link-${this.target_id}">${this.text}</a>${sub_elements_html}</li>`;
  }
}

class SidebarElementStack {
  constructor() {
    this.id_counter = 0;
    this.stable = [];
    this.stack = [];
    this.sections = [];
  }

  add_element(elem) {
    this.sections.push(elem);
    let curr_level = parseInt($(elem).prop("tagName")[1]);
    while (curr_level - 1 < this.stack.length) {
      this.pop_one();
    }
    let id = `section-${this.id_counter}`;
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

function sidebar_window_scroll_update(stack) {
  const scroll_offset = 100;

  // First check if there is any sections to deal with
  if (stack.sections.length == 0) {
    return;
  }

  // Compute the position to check
  let position_to_check = $(document).scrollTop() + scroll_offset;

  // Check if the position is before the first section;
  // if so then the first section needs to be highlighted
  if (position_to_check < $(stack.sections[0]).offset().top) {
    $(".sidebar-link").removeClass("active");
    $("#sidebar-link-section-0").addClass("active");
    return;
  }

  // Iterate through 0 to (n - 1) and see if anything should be highlighted
  for (let i = 0; i < stack.sections.length - 1; i++) {
    let b1 = position_to_check >= $(stack.sections[i]).offset().top;
    let b2 = position_to_check < $(stack.sections[i + 1]).offset().top;
    if (b1 && b2) {
      $(".sidebar-link").removeClass("active");
      $(`#sidebar-link-section-${i}`).addClass("active");
      return;
    }
  }

  // Check if the last one needs to be highlighted
  if (position_to_check > $(stack.sections[stack.sections.length - 1]).offset().top) {
    $(".sidebar-link").removeClass("active");
    $(`#sidebar-link-section-${stack.sections.length - 1}`).addClass("active");
    return;
  }
}

function load_sidebar($content, $sidebar) {
  // Read the markdown content and populate element stack
  let stack = new SidebarElementStack();
  $content.children("h1, h2, h3, h4, h5, h6").each(function () {
    stack.add_element(this);
  });
  stack.stablize_stack();

  // Turn the stack into an html
  $sidebar.html(stack.to_html());

  // Create window onscroll event to automatically highlight sidebar links
  sidebar_window_scroll_update(stack);
  $(window).scroll(() => sidebar_window_scroll_update(stack));
}

function render(markdown, $content, $sidebar) {
  let md = window.markdownit({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  }).use(window.markdownitFootnote);

  // Load the markdown content
  $content.html(md.render(markdown));

  // Load the sidebar if it presents
  if ($sidebar) {
    load_sidebar($content, $sidebar);
  }
}

function load_markdown(file, $content, $sidebar) {
  $.ajax({ url: `/md/${file}.md`, success: (md) => render(md, $content, $sidebar) });
}

function load_markdown_default(file) {
  $.ajax({
    url: `/md/${file}.md`,
    success: (md) => {
      render(md, $(".markdown-content"), $(".markdown-sidebar"));
    },
  });
}
