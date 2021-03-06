(function() {
  define(["jquery"], function($) {
    var Sticky;
    return Sticky = (function() {
      function Sticky(elem, offsetTop, offsetBottom) {
        var scroll, that;
        this.elem = elem;
        this.offsetTop = offsetTop;
        this.offsetBottom = offsetBottom;
        that = this;
        if (this.offsetTop == null) {
          this.offsetTop = 0;
        }
        this.offsetTop = +this.offsetTop;
        if (this.width == null) {
          this.width = 0;
        }
        this.state = '';
        this.init();
        this.position = {};
        this.topPossible = true;
        this.getPosition();
        scroll = (function(_this) {
          return function() {
            _this.getPosition();
            return _this.checkHeight();
          };
        })(this);
        scroll();
        $(window).scroll(scroll);
        $(window).resize(scroll);
      }

      Sticky.prototype.init = function() {
        this.width = this.elem.outerWidth();
        if (this.elem.parent().outerHeight() === this.elem.parent().parent().height()) {
          this.state = 'disable';
          return;
        }
        this.elem.parent().parent().css({
          position: "relative"
        });
        this.elem.parent().css({
          position: "absolute",
          top: 0,
          bottom: 0
        });
        return this.elem.css({
          width: this.width + "px"
        });
      };

      Sticky.prototype.getPosition = function() {
        this.position.top = this.elem.offset().top - $(document).scrollTop();
        this.position.bottom = $(window).innerHeight() - (this.elem.offset().top - $(document).scrollTop() + this.elem.outerHeight());
        this.position.reachedBottom = (this.elem.parent().offset().top + this.elem.parent().innerHeight()) <= (this.elem.offset().top + this.elem.outerHeight());
        return this.topPossible = !($(window).innerHeight() < this.elem.outerHeight() + this.offsetTop);
      };

      Sticky.prototype.stickTop = function() {
        this.state = "top";
        return this.elem.css({
          position: "fixed",
          top: this.offsetTop,
          bottom: "auto",
          width: this.width + "px"
        });
      };

      Sticky.prototype.stick = function() {
        this.state = "bottom";
        return this.elem.css({
          position: "fixed",
          bottom: this.offsetBottom + "px",
          marginBottom: 0,
          top: "auto",
          width: this.width + "px"
        });
      };

      Sticky.prototype.checkHeight = function() {
        if (this.state === 'disable') {
          return;
        }
        if (this.position.bottom <= this.offsetBottom && this.state !== "bottom") {
          this.stick();
        } else if (this.position.reachedBottom && this.state !== "finish") {
          this.finish();
        } else if (this.position.top >= this.offsetTop && this.state !== "top" && this.state === "finish") {
          this.stickTop();
        } else if (this.position.top <= this.offsetTop && this.state !== "top" && this.state !== "finish" && this.topPossible) {
          this.stickTop();
        } else if (!this.topPossible && this.position.bottom >= this.offsetBottom && this.state !== "bottom" && this.state !== "finish") {
          this.stick();
        }
        if (this.elem.parent().offset().top - this.elem.offset().top > 0 && this.state !== "none") {
          return this.unstick();
        }
      };

      Sticky.prototype.unstick = function() {
        this.state = "none";
        this.elem.removeAttr("style");
        return this.elem.css({
          width: this.width + "px"
        });
      };

      Sticky.prototype.finish = function() {
        this.state = "finish";
        return this.elem.css({
          position: "absolute",
          bottom: this.offsetBottom + "px",
          marginBottom: 0,
          top: "auto",
          width: this.width + "px"
        });
      };

      return Sticky;

    })();
  });

}).call(this);
