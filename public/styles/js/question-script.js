$(function () {
  /** ---Question--- */
  // Question detail info
  $("a.card-block.stretched-link").on("click", function (event) {
    $("#question, #one, #two, #three, #four, #explain, .subject").attr(
      "disabled",
      true
    );

    $("#save-question").attr("hidden", true);
    $("#edit-question").attr("hidden", false);

    $("a.card-block.stretched-link").css({
      "box-shadow": "none",
      "background-color": "#cbcccd",
      color: "#000000",
    });
    $("a.card-block.stretched-link").removeAttr("id");

    $(this).css({
      "box-shadow": "inset 0 0 1px #33332D, 0 3px 3px #6b747b",
      "background-color": "#778188",
      color: "#f0f3f5",
    });
    $(this).attr("id", "choose-question");

    // Question detail
    const url = "/questions/" + $(this).find("p.question-id").text();
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (result) {
        $("#topic-question-content").attr("hidden", false);

        $("#question-id-detail").text(`#${result["data"]["id"]} `);

        $("#question-langcode").text(`${result["data"]["langCode"]}`);
        if (parseInt(`${result["data"]["changed"]}`) === 1) {
          $("#modified-status").text("Modified");
        } else if (parseInt(`${result["data"]["changed"]}`) === 2) {
          $("#modified-status").text("New");
        } else {
          $("#modified-status").text("");
        }

        $(".question-id-update").text(
          `${result["data"]["id"]}-${result["data"]["langCode"]}`
        );

        $("a#delete-question-accept").attr(
          "href",
          `/questions/delete/${result["data"]["topicId"]}/${result["data"]["id"]}-${result["data"]["langCode"]}`
        );

        $("#question").val(result["data"]["question"]);
        switch (parseInt(result["data"]["correctAnswer"])) {
          case 0:
            $("#one").prop("checked", true);
            break;
          case 1:
            $("#two").prop("checked", true);
            break;
          case 2:
            $("#three").prop("checked", true);
            break;
          case 3:
            $("#four").prop("checked", true);
            break;
        }
        $(".first .course .subject").val(result["data"]["answers"][0]);
        $(".second .course .subject").val(result["data"]["answers"][1]);
        $(".third .course .subject").val(result["data"]["answers"][2]);
        $(".forth .course .subject").val(result["data"]["answers"][3]);

        $("#explain").val(result["data"]["explanation"]);
      },
      error: function () {
        alert("Can not find question");
      },
    });
  });

  // Auto click first question
  $("a.card-block.stretched-link").first().click();

  // Enable status edit question
  $("#edit-question").on("click", function () {
    $(this).attr("hidden", true);
    $("#save-question").attr("hidden", false);
    $("#question, #one, #two, #three, #four, #explain, .subject").attr(
      "disabled",
      false
    );
  });

  // Edit question
  $("#save-question").on("click", function (event) {
    $(this).attr("hidden", true);
    $("#edit-question").attr("hidden", false);
    $("#question, #one, #two, #three, #four, #explain, .subject").attr(
      "disabled",
      true
    );

    const editQuestionUrl = `/questions/edit/${$(this)
      .parent()
      .find("p.question-id-update")
      .text()}`;

    const data = {
      question: $("#question").val(),
      answerA: $("input[name=answerA]").val(),
      answerB: $("input[name=answerB]").val(),
      answerC: $("input[name=answerC]").val(),
      answerD: $("input[name=answerD]").val(),
      correctAnswer: $("input[name='option']:checked").val(),
      explain: $("#explain").val(),
    };

    event.preventDefault();
    $.ajax({
      type: "POST",
      url: editQuestionUrl,
      dataType: "json",
      data: data,
      success: function (result) {
        if (result.status == 200) {
          if ($("#modified-status").text() == "") {
            $("#modified-status").text("Modified");
          }
          $(".alert-update-success").attr("hidden", false);
          setTimeout(function () {
            $(".alert-update-success").attr("hidden", true);
          }, 1000);
          $("#choose-question .question-text").text($("#question").val());
        }
      },
      error: function () {
        alert("Can not update topic");
      },
    });
  });

  /** --- Topic --- */
  // Click pencil edit
  $("#edit-topic").on("click", function () {
    $("#topic-title").val($(".topic-title-detail").text());
  });

  // Show modal create question with error
  if ($(".alert-danger")[0]) {
    $("#create-question").click();
  }

  // Submit edit topic form
  $("#edit-topic-form").on("submit", function (event) {
    const editTopicUrl = "/topics/edit/" + $(this).find("p.topic-id").text();
    const title = $(this).find("#topic-title").val();
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: editTopicUrl,
      dataType: "json",
      data: { title: title },
      success: function (result) {
        $(".topic-title-detail").text(title);
        if (result.status == 200) {
          window.location.reload();
        }
      },
      error: function () {
        alert("Can not update topic");
      },
    });
  });

  $("#topics").addClass("active");
});
