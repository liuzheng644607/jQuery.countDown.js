;
(function($, window, document, undefined) {
    // author:asher
    // Email:liu-yaner@foxmail.com
    // github:https://github.com/liuzheng644607/
    //构造函数
    var CountDown = function(ele, opts) {
            this.$element = ele;
            this.defaults = {
                start: new Date("2014/09/24 19:30:00").getTime(),
                end: new Date("2014/09/25 0:00:00").getTime(),
                template: "",
                // funtion
                evtbefore: null,
                evtactive: null,
                evtafter: null
            };
            this.options = $.extend({}, this.defaults, opts);
        }
        //countdown的方法
    CountDown.prototype = {
        init: function() {
            var now = new Date().getTime();
            //秒杀结束
            if (now > this.options.end) {
                if (this.options.evtafter) {
                    var f = function() {};
                    this.options.evtafter.apply(f, arguments);
                };
                return this.$element;
            };
            //秒杀中
            if (now > this.options.start) {
                if (this.options.evtactive) {
                    var f = function() {};
                    this.options.evtactive.apply(f, arguments);
                };
                return this.$element;
            };
            // 秒杀之前
            if (this.options.evtbefore) {
                var f = function() {};
                this.options.evtbefore.apply(f, arguments);
            };
            //秒杀之前显示倒计时
            var timer = window.setInterval(function() {
                showCountDown(this.options, timer);
            }, 1000);
            var that = this;

            function showCountDown(opts, tid) {
                now = new Date().getTime();
                var interval = that.options.start - now;
                var interval_second = parseInt(interval / 1000);
                var day = Math.floor(interval_second / (60 * 60 * 24));
                var hour = Math.floor((interval_second - day * 24 * 60 * 60) / 3600);
                var minute = Math.floor((interval_second - day * 24 * 60 * 60 - hour * 3600) / 60);
                var second = Math.floor(interval_second - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
                that.privite_data = {
                    days: (day < 10 ? '0' + day : day),
                    hours: (hour < 10 ? '0' + hour : hour),
                    minutes: (minute < 10 ? '0' + minute : minute),
                    seconds: (second < 10 ? '0' + second : second)
                };
                that.$element.html(that.parseTemp(that.options.template, that.privite_data));
                if (now >= that.options.start - 1000) {
                    clearInterval(tid);
                    if (that.options.evtactive) {
                        var fn = function() {};
                        that.options.evtactive.apply(fn, arguments);
                    };
                };
            }
            return that.$element;
        },
        privite_data: {
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00",
        },
        parseTemp: function(str, data) {
            return str.replace(/\\?\{\{\#([^{}]+)\}\}/g, function(match, key) {
                return (data[key] === undefined) ? '' : data[key];
            });
        }
    }
    //在插件中使用
    $.fn.countdown = function(options) {
        var count = new CountDown(this, options);
        return count.init();
    }
})(jQuery, window, document)