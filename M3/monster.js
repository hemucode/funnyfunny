window.monsterDependenciesLoaded = true;

if (typeof addMonster === 'undefined' || !addMonster) {
  var USE_DEFAULT_MONSTER = false;
  var LEFT_KEY = 37;
  var UP_KEY = 38;
  var RIGHT_KEY = 39;
  var DOWN_KEY = 40;
  var DOWN_KEY = 40;

  var MAX_MONSTER = 100;

  var kFloorHeight = USE_DEFAULT_MONSTER ? 10 : 2;
  $("<div id='codehemu-monster-floor'><div/>").addClass("floor").appendTo($("body"));
  function getScrollParent(element, includeHidden) {
    if (element == null) {
      return null;
    }
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === "fixed") return element;
    for (var parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (style.position === "fixed" || overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }

    return document.body;
  }

  function is_collideable(index,elem) {
    if (["VIDEO", "IMG", "INPUT"].indexOf($(this).prop("tagName")) != -1) {
      return true;
    }
    if (["HTML"].indexOf($(this).prop("tagName")) != -1) {
      return false;
    }
    if ($(this).hasClass("codehemu-monster-hitbox")) {
      return true;
    }


    var immediatelyContainedText = $(this).contents().not($(this).children()).filter(function() {
        return this.nodeType === 3; 
      }).text().replace(/\s+/g, '');
    return immediatelyContainedText != "";
  }


  function setSleepMonster($monster) {
    if (USE_DEFAULT_MONSTER) {
      $monster.children(".codehemu-monster-hitbox").children(".codehemu-monster-text").html("&#" + (128513 + 34) + ";");
    } else {
      $monster.children(".codehemu-monster-hitbox").children("img").attr("src", chrome.runtime.getURL('monster/1f634.png'));
    }
  }

  function randomizeMonster($monster){
    if (USE_DEFAULT_MONSTER) {
      $monster.children(".codehemu-monster-hitbox").children(".codehemu-monster-text").html("&#" + (128513 + Math.floor(Math.random() * (128567 - 128513))) + ";");
    } else {
      $monster.children(".codehemu-monster-hitbox").children("img").attr("src", chrome.runtime.getURL('monster/1f6' + ("0" + Math.floor((Math.random() * 68))).slice(-2) + '.png'));
    }
  }

  function initializeMonster($monster){
    $monster.html("");
    $monster.append($("<div/>").addClass("codehemu-monster-hitbox"));
    if (USE_DEFAULT_MONSTER) {
      $monster.children(".codehemu-monster-hitbox").append($("<div/>").addClass("codehemu-monster-text"));
    } else {
      $monster.children(".codehemu-monster-hitbox").append($("<img>"));
    }
    randomizeMonster($monster);

    $monster.css("left", $(window).scrollLeft() + Math.floor(window.innerWidth/2));
    $monster.css("top", $(window).scrollTop() + Math.floor(window.innerHeight/2));
  }
  var rightMargin = USE_DEFAULT_MONSTER ? 20 : 10;
  function enforcePositionContraints($monster, x, y) {
    var window_top = $(window).scrollTop();
    var window_left = $(window).scrollLeft();

    var window_bottom = window_top + (document.doctype.name == "html" ? $(window).height() : window.innerHeight);
    var window_right = window_left + (document.doctype.name == "html" ? $(window).width() : window.innerWidth);
    var jump_allowed = false;
    if (y < window_top) {
        y = window_top;
    } else if (y + $monster.outerHeight() > window_bottom - kFloorHeight) {

      y = window_bottom - $monster.outerHeight() - kFloorHeight;
      jump_allowed = true
    }
    if (x < window_left/* + $monster.outerWidth()*/) {
      x = window_left/* + $monster.outerWidth()*/;

    } else if (x + $monster.outerWidth() > window_right - rightMargin) {
      x = window_right - $monster.outerWidth() - rightMargin;
    }
    return {"y":y, "x":x, "jump_allowed":jump_allowed}
  }


  function findPetBox() {
    for (var monster_index = 0; monster_index < MAX_MONSTER; monster_index++) {
      if ($("#codehemu-monster-box-" + monster_index).length == 0) {
        return monster_index;
      }
    }
    return -1;
  }

  function addMonster(){

    var $monster = getMonster(MAX_MONSTER);
    if ($monster === null) return;
    var $chrome_pet_box = $monster.parent();

    initializeMonster($monster);

    var vx = Math.floor(10 * Math.random());
    var vy = -10;
    var smooth_accumulator = 0.0
    var keydowns     = {LEFT_KEY:false, UP_KEY:false, RIGHT_KEY:false, DOWN_KEY:false}
    var jump_allowed = false

    var ignored_parent_tags = ["IMG", "TEXTAREA", "BR", "VIDEO", "INPUT", "path", "svg", "g", "IFRAME"];
    var last_immediate_parent = null;
    var hyperactive = true;


    function getMonster() {
      monster_index = findPetBox();
      if (monster_index == -1) return null;
      var pet_box_id = "codehemu-monster-box-" + monster_index;
      var $chrome_pet_box = $("<div/>")
        .attr("id", pet_box_id)
        .addClass("codehemu-monster-box")
        .appendTo(document.body);

      var monster_id = "monster-" + monster_index;
      var $monster = $("<div/>")
        .attr("id", monster_id)
        .addClass("monster")
        .appendTo($chrome_pet_box);

      $monster.draggable({
        stack: ".monster",
        scroll: false,
        stop : function(event, ui) {
                 vx = 0;
                 vy = 0;
                 jump_allowed = false;
                 hyperactive = true;
               }
      });

      return $monster;
    }

    function randomlyChangeKeydownsAndAppearance() {
      for (var key = LEFT_KEY; key < DOWN_KEY; key++) {
        var rand = Math.random();

        var threshold = 0.02;
        if (key == UP_KEY) {
          threshold = keydowns[UP_KEY] ? 0.05 : 0.012
        }
        if (rand < threshold) {
          keydowns[key] = !keydowns[key];
          if (rand < 0.003) {
            if (hyperactive) {
              randomizeMonster($monster);
            }
          }
        }
        if (!hyperactive && Math.random() > 0.94) {
          keydowns[key] = false;
        }
      }
      if (hyperactive && Math.random() > 0.994 && vy == 0 && vx == 0) {
        hyperactive = false;
      } else if (!hyperactive && Math.random() > 0.9994) {
        hyperactive = true;
        randomizeMonster($monster);
      }
    }

    var childType = USE_DEFAULT_MONSTER ? ".codehemu-monster-text" : "img";
    function renderKeydowns() {
      var transform = ""
      if (keydowns[RIGHT_KEY] && !keydowns[LEFT_KEY]) {
        transform = "rotate(30deg)";
      } else if (keydowns[LEFT_KEY] && !keydowns[RIGHT_KEY]) {
        transform = "rotate(-30deg)";
      } else {
        transforme = "none";
      }
      $monster.children().children(childType).css("-webkit-transform", transform);
    }

    function updateVelocityAndJumpstateFromKeydowns(ratio) {

      if (keydowns[RIGHT_KEY] && !keydowns[LEFT_KEY]) {
        vx = 4;
      } else if (keydowns[LEFT_KEY] && !keydowns[RIGHT_KEY]) {
        vx = -4;
      } else {
        if (vx > 0) {
          vx = Math.max(vx - 1, 0);
        } else if (vx < 0) {
          vx = Math.min(vx + 1, 0);
        }
      }

      if (keydowns[UP_KEY] && jump_allowed && hyperactive) {
        vy = -10;
        jump_allowed = false;
      }



      if ($monster.is('.ui-draggable-dragging')) {
      } else {

        if (hyperactive) {
          vy += 0.8 * ratio;
        } else {
          vy = 0;
        }

        if (vy > 9) {
          vy = 9;
        }
        if (vy < -9) {
          vy = -9;
        }
        if (vx > 9) {
          vx = 9;
        }
        if (vx < -9) {
          vx = -9;
        }
      }
    }

    var base_offset = 1;
    function updateScrollParent(new_x, new_y) {
      var base_x = new_x - $(window).scrollLeft() + $monster.width()/2;
      var base_y = new_y - $(window).scrollTop() + $monster.height() + base_offset;
      var elem = document.elementFromPoint(base_x, base_y);
      if (base_y > window.innerHeight - kFloorHeight) {
        elem = document.getElementById("codehemu-monster-floor")
      }

      var saved_offset = $monster.offset();

      if (elem != last_immediate_parent) {
        last_immediate_parent = elem;
        if ($.contains($monster.get(0), elem)) {
          elem = document.body;
          base_offset += 1;
        }
        if (elem != null) {
          elem = getScrollParent(elem, false);
        }
        if (elem != $chrome_pet_box.parent()[0] && elem != null && ignored_parent_tags.indexOf($(elem).prop("tagName")) == -1) {
          $chrome_pet_box.appendTo(elem);
          var modified_y = $monster.offset().top;
          var modified_x = $monster.offset().left;

          $monster.offset(saved_offset);
          actual_y = $monster.offset().top;
          actual_x = $monster.offset().left;
          if (~~actual_y != ~~saved_offset.top || ~~actual_x != ~~saved_offset.left) {
            console.log("Bad teleport");
            console.log(elem);
            console.log(saved_offset.left + "->" + actual_x + " ," + saved_offset.top + "->" + actual_y);
          }
        }
      }
    }

    function elementsOfInterest() {
      var new_y = $monster.offset().top;
      var new_x = $monster.offset().left;

      var pet_width = $monster.outerWidth();
      var pet_height = $monster.outerHeight();
      var elementsOfInterest = [];
      for (var x_index = 0; x_index < 2; x_index++) {
        for (var y_index = 0; y_index < 2; y_index++) {
          var probe_x = new_x - $(window).scrollLeft() - 1 + x_index * (pet_width + 2);
          var probe_y = new_y - $(window).scrollTop() + y_index * (pet_height) - x_index;
          var collision = document.elementFromPoint(probe_x, probe_y);
          if (collision != null && elementsOfInterest.indexOf(collision) == -1) {
            elementsOfInterest.push(collision);
          };
        }
      }
      return $(elementsOfInterest);
    }

    var signs   = [    -1,      1,    -1,     1];
    var targets = ["left", "left", "top", "top"];
    // Side Effects: Modifies jump_allowed,
    function getPush(index, domElement) {
      var pet_width = $monster.outerWidth();
      var pet_height = $monster.outerHeight();
      var $this = $(domElement);
      var position = $this.offset();
      var new_position = {left: parseInt(position.left, 10),
                          top:  parseInt( position.top, 10)};
      var new_size = {width: parseInt($this.outerWidth(), 10),
                      height: parseInt($this.outerHeight(),10)};


      var violations = [];


      var pet_offset = $monster.offset()
      var pet_left = parseInt(pet_offset.left, 10);
      var pet_top = parseInt(pet_offset.top, 10);

      violations.push(pet_left + pet_width - new_position.left);
      violations.push((new_position.left + new_size.width) - pet_left);
      violations.push(pet_top + pet_height - new_position.top);
      violations.push((new_position.top + new_size.height) - pet_top);

      var smallest_violation = 0;
      var worst_violation = 0;
      var best_index = -1;
      for (var i = 0; i < 4; i++) {
        if (best_index == -1 || violations[i] < smallest_violation) {
          smallest_violation = violations[i];
          best_index = i;
        }
      }

      response = {"left" : 0, "top" : 0, overlapped : (smallest_violation >= 0)};

      if (smallest_violation >= 0) {
        if (best_index == 2) {
          jump_allowed = true;
        }
        response[targets[best_index]] = signs[best_index] * /*1*/smallest_violation/2;
      }

      return response;
    }

    function handleCollisionResults(collision_results) {
      var sum = collision_results.reduce(function(a, b){
        return {"overlapped" : a["overlapped"] + b["overlapped"],
                "left"       : a["left"]       + b["left"],
                "top"        : a["top"]        + b["top"]};
      }, {"left" : 0, "top" : 0, "overlapped" : 0});
      if (sum["overlapped"]) {
        for (const prop in sum) {
          if (prop == "overlapped") continue;
          var mean = (1.0 * sum[prop]) / sum["overlapped"];
          var original = parseInt($monster.css(prop), 10);
          var modified = original + mean;
          $monster.css(prop, ~~modified + 'px');
        }

      } else if (!hyperactive) {
        hyperactive = true;
        randomizeMonster($monster);
      }
    }

    var time = Date.now();
    function timestep() {
      var new_time = Date.now();
      var dt = (new_time - time) / 30.0;
      if (dt <= 0) return;
      time = new_time;
      randomlyChangeKeydownsAndAppearance();
      renderKeydowns();
      updateVelocityAndJumpstateFromKeydowns(dt);


      var y = $monster.offset().top;
      var x = $monster.offset().left;

      var new_state_info = enforcePositionContraints($monster, x + vx * dt, y + vy * dt);
      jump_allowed = jump_allowed || new_state_info["jump_allowed"];
      var new_y = new_state_info["y"];
      var new_x = new_state_info["x"];
      vx = (new_x - x) / dt;
      vy = (new_y - y) / dt;

      if (!$monster.is('.ui-draggable-dragging')) {
        $monster.offset({left:new_x, top:new_y});

        
        if (hyperactive || Math.random() > 0.95) {
          updateScrollParent(new_x, new_y);

          // Projecting step.
          var overlapped = false;
          var collision_results = elementsOfInterest()
            .not("iframe, :hidden, .codehemu-monster-hitbox")
            .not($monster.children())
            .not($monster.children().children())
            .filter(is_collideable)
            .map(getPush)
            .get();
          handleCollisionResults(collision_results);
        }
      }
      var final_y = $monster.offset().top;
      var final_x = $monster.offset().left;
      vx = (final_x - x) / dt;
      vy = (final_y - y) / dt;
    }

    $monster.get(0).animation_task = timestep;

    if (!window.timestep) {
      window.timestep = function() {
        $(".monster").map(function(index, elem){
          elem.animation_task();
        })
        window.requestAnimationFrame(window.timestep);
      }
      window.timestep();
    }
    if ($(".codehemu-monster-quit").length == 0) {
      $("<button/>")
        .attr("id", "codehemu-monster-quit-button")
        .addClass("codehemu-monster-quit")
        .click(function(){
          $(".codehemu-monster-box").remove();
          $(".codehemu-monster-quit").remove();
          $(".codehemu-monster-plus").remove();
          $(".codehemu-monster-min").remove();
        })
        .appendTo(document.body);

      $("<button/>")
        .attr("id", "codehemu-monster-plus-button")
        .addClass("codehemu-monster-plus")
        .click(function(){
          width = document.querySelectorAll(".monster img")[0].width;
          new_width = width + 2;
          monster = document.querySelectorAll(".monster img");
          for (allMonster of monster) {
            allMonster.style.width = new_width+"px";
            allMonster.style.height = new_width+"px";

          }
        })
        .appendTo(document.body);


      $("<button/>")
        .attr("id", "codehemu-monster-min-button")
        .addClass("codehemu-monster-min")
        .click(function(){
          width = document.querySelectorAll(".monster img")[0].width;
          new_width = width - 2;
          monster = document.querySelectorAll(".monster img");
          for (allMonster of monster) {
            allMonster.style.width = new_width+"px";
            allMonster.style.height = new_width+"px";

          }
        })
        .appendTo(document.body);  

    }

  }
}
addMonster();