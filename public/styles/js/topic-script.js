$(function () {
  $(".enable-vi").on("click", function () {
    $(".topic-vi").show();
    $(".topic-en").hide();
    $(".enable-vi").addClass("large").removeClass("nomal");
    $(".enable-en").addClass("nomal").removeClass("large");
  });

  $(".enable-en").on("click", function () {
    $(".topic-vi").hide();
    $(".topic-en").show();
    $(".enable-vi").addClass("nomal").removeClass("large");
    $(".enable-en").addClass("large").removeClass("nomal");
  });

  $(".enable-vi").click();

  // Show modal create topic with error
  if ($(".alert-danger")[0]) {
    $(".btn-create-topic").click();
  }

  // Click edit topic button
  $("#edit-topic").on("click", function () {
    $("#topic-title").val($(".topic-title-detail").text());
  });

  $("#topics").addClass("active");
});
