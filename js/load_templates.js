$(document).ready(function () {
  $(".template").each(function () {
    let $this = $(this);
    let template_name = $this.attr("data-template");
    $.ajax({
      url: `/templates/${template_name}.html`,
      success: (tmpl) => {
        // Update the template HTML
        $this.html(tmpl);

        // Invoke the callback
        let callback_fn_name = $this.attr("data-callback");
        if (callback_fn_name) {
          eval(`${callback_fn_name}()`);
        }
      },
    });
  });
});
