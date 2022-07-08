$(function () {
  /** ---Question--- */
  // Question detail info
  $("a.card-block.stretched-link").on("click", function (event) {
    $("#question, #one, #two, #three, #four, #explain, .subject").attr(
      "disabled",
      true
    );

    $("#save-question-feedback").attr("hidden", true);
    $("#edit-question-feedback").attr("hidden", false);

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
    const url = "/feedbacks/" + $(this).find("p.question-id").text();
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (result) {
        $("#topic-question-content").attr("hidden", false);

        $("#question-id-detail").text(
          `#${result["data"]["id"]} | #${result["data"]["topicId"]} ${result["data"]["topicTitle"]}`
        );

        $("#question-langcode").text(` | ${result["data"]["langCode"]}`);

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
        $("a.delete-all-feedback").attr(
          "link",
          `/feedbacks/delete-all/${result["data"]["id"]}-${result["data"]["langCode"]}`
        );
        const version = $(".version").text();
        const myTableBody = $("#feedback-table tbody");
        myTableBody.empty();
        $(".all-feedback-num").text(
          `Feedback (${result["data"]["feedbacks"].length})`
        );
        result["data"]["feedbacks"].forEach(function (feedback) {
          const tableRow = `<tr>
                              <td class="td-feedback-content">
                                <p>
                                  <span class="feedback-title"> ${feedback.time} - </span>
                                  <span class="feedback-title caps">${feedback.langCode} - </span>
                                  <span class="feedback-title caps">${feedback.device} - ${version} </span>
                                  <br>
                                  <span class="font-weight-bold"> ${feedback.note} </span>
                                </p>
                              </td>
                              <td class="td-feedback-action">
                                <label class="switch fixed-feedback">
                                  <input type="checkbox" class="fixed-toggle-btn" link="/feedbacks/fixed/${feedback.id}/${feedback.fixed}" fixed="${feedback.fixed}">
                                  <div class="slider round"></div>
                                </label>
                              </td>
                              <td class="td-feedback-action">
                                <a class="delete-feedback text-decoration-none" href="" link="/feedbacks/delete/${feedback.id}">Delete</a>
                              </td>
                            </tr>`;

          myTableBody.append(tableRow);
          $('.fixed-toggle-btn[fixed="true"]').prop("checked", true);
          $('.fixed-toggle-btn[fixed="false"]').prop("checked", false);
        });
      },
      error: function () {
        alert("Can not find question");
      },
    });
  });

  // Auto click first question
  $("a.card-block.stretched-link").first().click();

  // Enable status edit question
  $("#edit-question-feedback").on("click", function () {
    $(this).attr("hidden", true);
    $("#save-question-feedback").attr("hidden", false);
    $("#question, #one, #two, #three, #four, #explain, .subject").attr(
      "disabled",
      false
    );
  });

  // Edit question
  $("#save-question-feedback").on("click", function (event) {
    $(this).attr("hidden", true);
    $("#edit-question-feedback").attr("hidden", false);
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
          $("#choose-question .modified-question-text").text(
            $("#question").val()
          );
        }
      },
      error: function () {
        alert("Can not update topic");
      },
    });
  });

  // Delete all feedback of choose question
  $(document).on("click", "a.delete-all-feedback", function (event) {
    event.preventDefault();
    $.ajax({
      type: "DELETE",
      url: $(this).attr("link"),
      dataType: "json",
      data: { fixed: true },
      success: function (result) {
        if (result.status == 200) {
          location.href = window.location.href;
        }
      },
      error: function () {
        alert("Has error, please check again.");
      },
    });
  });

  // Fixed feedback
  $(document).on("change", ".fixed-toggle-btn", function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: $(this).attr("link"),
      dataType: "json",
      data: { fixed: true },
      success: function (result) {
        if (result.status == 200) {
          $('a.card-block.stretched-link[id="choose-question"]').click();
        }
      },
      error: function () {
        alert("Has error, please check again.");
      },
    });
  });

  // Delete feedback
  $(document).on("click", "a.delete-feedback", function (event) {
    event.preventDefault();
    $.ajax({
      type: "DELETE",
      url: $(this).attr("link"),
      dataType: "json",
      success: function (result) {
        if (result.status == 200) {
          const numFeedback = $(
            'a.card-block.stretched-link[id="choose-question"]'
          )
            .find(".modified-question-feedback")
            .text()
            .split(" ")[0];
          if (parseInt(numFeedback) - 1 === 0) {
            location.href = window.location.href;
          } else {
            $('a.card-block.stretched-link[id="choose-question"]')
              .find(".modified-question-feedback")
              .text((numFeedback - 1).toString() + " feedbacks");
            $('a.card-block.stretched-link[id="choose-question"]').click();
          }
        }
      },
      error: function () {
        alert("Has error, please check again.");
      },
    });
  });

  $("#feedbacks").addClass("active");
});
