var Code = {
    $codeArea: query('.code'),
    $body: document.body,
    $console: query('.console_content')[0],
    run: function(el) {
        var _content = util.removeTag(el.innerHTML);
        _content = util.translateHTMLContent(_content.replace(/console\.log\((.+?)\);/g, 'Code.outputFormate("$1=");Code.outputFormate($1);'));

        this.$console.innerHTML = "";
        this.$body.removeChild(query('.myscript')[0]);
        var _myScript = document.createElement('script');
        _myScript.className = 'myscript';
        _myScript.innerHTML = '{' + _content + '}';
        this.$body.appendChild(_myScript);
    },
    clear: function() {
        this.$console.innerHTML = '';
    },
    outputFormate: function(w) {
        var _this = this;
        if (typeof w !== 'string') {
            w = eval(w);
        }
        if (typeof w === 'number') {
            w = w.toString();
        }
        _this.$console.innerHTML += util.codeFormat(objectFormat(w)) + '\n';
        function objectFormat(e) {
            var _output = '';
            if (util.isObject(e)) {
                _output += '{';
                var totalKey = Object.keys(e).length;
                for (var i in e) {
                    if (util.isObject(e[i]) || util.isArray(e[i])) {
                        _output += i + ': ' + objectFormat(e[i]);
                    } else {
                        _output += i + ': ' + e[i];
                    }
                    if (--totalKey) {
                        _output += ',';
                    } else {
                        _output += '}';
                    }
                }
            } else if (util.isArray(e)) {
                _output += '[' + e.join(' ') + ']';
            } else {
                _output = e; 
            }
            return _output;
        }
    },
    codeAreaFormate: function() {
        addEvent(this.$codeArea, function(el) {
            el.innerHTML = util.codeFormat(el.innerHTML);
        });
    }
    
};

var ConsolePast = {
    $el: query('.content')[0],
    cursor: new Cursor(query('.content')[0]),
    pastedEvent: function() {
        var _this = this;
        this.$el.addEventListener('paste', function (data) {
            var _data = data || event;
            var clipboardData, pastedData;
            _data.stopPropagation();
            _data.preventDefault();
            clipboardData = _data.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');
            if (util.isNotEmpty(pastedData)) {
                var _text = util.removeTag(pastedData);
                _this.cursor.setCursortPosition(_text);
            }
        });
    }
};

var Nav = {
    $block: query('.block'),
    $navli: query('.nav a'),
    blockFlag: [],
    current: 0,
    init: function() {
        this.winHeight = window.innerHeight;
        this.clearblockFlag();
        this.blockFlag[0] = 1;
    },
    scrollListener: function() {
        var _this = this;
        _this.init();
        var _body = document.documentElement || document.body;
        window.addEventListener('scroll', function() {
            var _scroll = _body.scrollTop,
                _next = _this.current+1 == _this.$block.length ? _this.current : _this.current+1,
                _pre = _this.current-1 < 0 ? _this.current : _this.current-1;

            if (_scroll >= _this.$block[_next].offsetTop && !_this.blockFlag[_next]) {
                _this.navSelect(_next);
            } else if (_this.$block[_pre].offsetTop >= _scroll && !_this.blockFlag[_pre]) {
                _this.navSelect(_pre);
            }
        });
        return _this;
    },
    clearblockFlag: function() {
        for (var i = 0; i < this.$block.length; i++) {
            this.blockFlag[i] = 0;
        }
    },
    addEvent: function() {
        var _this = this;
        addEvent(this.$navli, function($el, i) {
            _this.navSelect(i);
        }, 'click');
    },
    navSelect: function(i) {
        this.clearblockFlag();
        this.blockFlag[i] = 1;
        this.addNavStyle(this.$navli[i]);
        this.current = i;
    },
    addNavStyle: function(el) {
        addEvent(this.$navli, function($el) {
            $el.className = '';
        });
        el.className = 'active';
    }
};

Nav.scrollListener().addEvent();
Code.codeAreaFormate();

addEvent(query('.run'), function() {
    var _pre = this.previousSibling;
    if (_pre.nodeType === 3 && _pre.nodeName === '#text') {
        _pre = _pre.previousSibling;
    }
    Code.run(_pre);
}, 'click');

var key = {
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    comma:188,
    bracket_braces_l: 219,
    bracket_braces_r: 221
};

ConsolePast.pastedEvent();
var consoleInput = Cursor(query('.content')[0]);
var tab = 0,
    ctrl = false,
    shift = false;
query('.content')[0].addEventListener('keydown', function(e){
    var _event = e || event,
        keyCode = _event.keyCode;

    var _ctrl = 0,
        _shift = 0;
    switch(keyCode) {
        case key.tab: 
            _event.preventDefault();
            consoleInput.setCursortPosition('    ');
            tab++;
            break;
        case key.enter:
            _event.preventDefault();
            if (ctrl) {
                Code.run(this);
            } else {
                consoleInput.setCursortPosition('\n');
                for (var i = 0; i < tab; i++) {
                    consoleInput.setCursortPosition('    ');
                }
            }
            break;
        case key.shift:
            shift = true;
            _shift = setTimeout(clearShift, 5e2);
            break;
        case key.ctrl:
            ctrl = true;
            _ctrl = setTimeout(clearCtrl, 5e2);
            break;
        case key.bracket_braces_l:
            if (shift) 
            tab++;
            break;
        case key.bracket_braces_r:
            if (shift) 
            tab--;
            break;
    }

    if (keyCode !== key.ctrl) {
        clearTimeout(_ctrl);
        clearCtrl();
    }
    if (keyCode !== key.shift) {
        clearTimeout(_shift);
        clearShift();
    }

    function clearCtrl() {
        ctrl = false;
    }
    function clearShift() {
        shift = false;
    }
});




function query(e, fa) {
    var _fa = document;
    if (fa) {
        _fa = fa;
    }
    return _fa.querySelectorAll(e);
}

function addEvent(els, fun, event) {
    for (var i = 0; i < els.length; i++) {
        if (event) {
            addEventFun(i);
        } else {
            fun(els[i], i);
        }
    }
    function addEventFun(n) {
        els[n].addEventListener(event, function(e) {
            var _event = e || event;
            fun.call(this, _event, n);
        });
    }
}
