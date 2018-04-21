//@charset "utf-8";

function Layernative(item){
    var _$ = typeof $ === 'function' && $.constructor === Function ? $ : false;
    var _body = query('body')[0];

    var alertBox,
        cover,
        tt,
        content,
        container,
        btnarea;
    function render() {
        alertBox = document.createElement('div');
        alertBox.className = 'layer';
        var _html = 
            '<div class="layer_cover">&nbsp;</div>' +
            '<div class="layer_container">' +
                '<div class="layer_tt">&nbsp;</div>' +
                '<div class="layer_content">&nbsp;</div>' +
                '<div class="layer_btnarea">&nbsp;</div>' +
            '</div>';
        alertBox.innerHTML += _html;
        _body.appendChild(alertBox);

        cover = query('.layer_cover', alertBox)[0];
        addEvent(alertBox, 'touchmove', function(e) {
            var _event = e || event;
            _event.preventDefault();
        });
        tt = query('.layer_tt', alertBox)[0];
        content = query('.layer_content', alertBox)[0];
        container = query('.layer_container', alertBox)[0];
        btnarea = query('.layer_btnarea', alertBox)[0];
    }

    function addEffect(effect, time) {
        if (_$) {
            $.extend($.fn, {
                layerEffectIn: function(time, callback) {
                    if (effect === 'fade') {
                        $(this).fadeIn(time, callback);
                    } else {
                        $(this).show();
                    }
                    return this;
                },
                LayerEffectOut: function(time, callback) {
                    if (effect === 'fade') {
                        $(this).fadeOut(time, callback);
                    } else {
                        $(this).hide();
                    }
                    return this;
                }
            });
        }
    }

    function query(e, fa) {
        if (_$) {
            if (!fa) {
                return $(e);
            } else {
                return $(e, fa);
            }
        } else {
            var _fa = fa;
            if (!fa) {
                _fa = document;
            }
            return _fa.querySelectorAll(e);
        }
    }

    function addEvent(el, event, fun) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, fun);
        } else if (el.addEventListener) {
            el.addEventListener(event, fun, false);
        }
    }

    if (!_$) {
        window.$ = function(el) {
            var obj = {
                el: typeof el !== 'object' ? query(el) : el.constructor === NodeList ? el : [el],
                fade: function(status, time, callback) {
                    var _status = 'none';
                    if (status === 'in') {
                        _status = 'block';
                    }
                    this.css('display', _status);
                    if (callback && time) {
                        setTimeout(callback, time);
                    }
                    return this;
                },
                show: function(time, callback) {
                    this.fade('in', time, callback);
                    return this;
                },
                hide: function(time, callback) {
                    this.fade('out', time, callback);
                    return this;
                },
                css: function(name, value) {
                    if (value) {
                        this.domsEvent(function() {
                            this.style[name] = value;
                        });
                    } else {
                        return getComputedStyle(this.el[0], null).getPropertyValue(name);
                    }
                    return this;
                },
                attr: function(name, value) {
                    if (value) {
                        this.domsEvent(function() {
                            this.setAttribute(name, value);
                        });
                    } else {
                        return this.el[0].getAttribute(name);
                    }
                    return this;
                },
                domsEvent: function(fun) {
                    for (var i = 0; i < this.el.length; i++) {
                        fun.call(this.el[i]);
                    }
                }
            };
            obj.layerEffectIn = obj.show;
            obj.LayerEffectOut = obj.hide;

            return obj;
        };

        window.$.constructor = 'layernative';
    }

    var obj = {
        // 点击背景cover区域弹框是否会消失
        coverHidden: false,
        // 动画时间
        time: 25e1,
        // 动画效果
        effect: 'fade',
        // 当只有一个按钮时的按钮的class
        singleBtnClass: 'layer_btn-red',
        init: function(item) {
            if (item) {
                for (var i in item) {
                    this[i] = item[i];
                }
            }
            addEffect(this.effect, this.time);
            render();
        },
        alert: function(title, word, btn, style) {
            var _this = this;

            tt.innerHTML = title ? title : '';
            content.innerHTML = word ? word : '';
            

            if ( !btn ) {
                btn = [1];
            }
            btnarea.innerHTML = '';

            var _btnLen = btn.length;
            for ( var i = 0; i < _btnLen; i++ ) {
                var _word = btn[i].word ? btn[i].word : 'ok~',
                    _btn = document.createElement('div'),
                    _callback = btn[i].callback;

                    _btn.className = 'layer_btn';
                if (_btnLen === 1 && _this.singleBtnClass) {
                    _btn.className += ' ' + _this.singleBtnClass;
                }
                _btn.innerHTML = _word;
                addBtnFun(_btn, _callback, btn[i].callbackHidden);
            }

            _this.show(style);
            
            if (_this.coverHidden) {
                addEvent(cover, 'click', function() {
                    _this.hide();
                });
            }
           
            function addBtnFun($btn, callback, callbackHidden) {
                addEvent($btn, 'click', function() {
                    if (callback) {
                        callback();
                        if ( callbackHidden ) {
                            _this.hide();
                        }
                    } else {
                        _this.hide();
                    }
                });
                btnarea.appendChild($btn);
            }
        },
        show: function(style) {
            this.addStyle(style);

            $(container).layerEffectIn(this.time);
            $(cover).layerEffectIn(this.time);
        },
        hide: function() {
            $(container).LayerEffectOut(this.time, function(){
                content.innerHTML = '';
                tt.innerHTML = '';
            });
            $(cover).LayerEffectOut(this.time);
        },
        clearStyle: function() {
            var _style = $(container).attr('style'),
                _reg = /display:(\s)?.+?($|;)/;
                
            if (_reg.test(_style)) {
                _style = _style.match(_reg)[0];
                $(container).attr('style', _style);
            }
            alertBox.className = 'layer';
        },
        addStyle: function(style) {
            this.clearStyle();

            if (!style) {
                return;
            }

            if (typeof style === 'object') {
                for (var i in style) {
                    $(container).css(i, style[i]);
                }
            } else if (typeof style === 'string') {
                alertBox.className = 'layer ' + style;
            }
        }
    };
    obj.init(item);

    return obj;
}