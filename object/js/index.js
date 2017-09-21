var cursor = {
    $el: query('.content')[0],
    position: 0,
    contentHeight: 0,
    init: function () {
        this.contentHeight = parseInt(getComputedStyle(this.$el, null).getPropertyValue('height'));
    },
    getCursortPosition: function () {
        if (window.getSelection) {
            var _sel = window.getSelection();
            var _range = _sel.getRangeAt(0);
            this.position = _range.startOffset;
            return _range.startOffset;
        }
    },
    setCursortPosition: function (text) {
        if (window.getSelection) {
            var _div = this.$el;
            var _sel = window.getSelection(),
                _range = _sel.getRangeAt(0),
                _length = 1;
            if (text == '\r\n' && _range.endOffset == _range.startOffset && !_div.innerHTML.substr(-1).match(/[\r|\n]/)) {
                text = '\r\n\r\n';
            }
            var i = _range.createContextualFragment(text);
            var s = i.lastChild;
            var curPosition = _range.createContextualFragment('<span class="curPosition"></span>');
            _range.insertNode(curPosition);
            _range.insertNode(i);
            _range.setStartAfter(s);
            _range.setEndAfter(s);
            _sel.removeAllRanges();
            _sel.addRange(_range);
            var _curPosition = query('span.curPosition', _div)[0],
            	_top = _curPosition.offsetTop;

            if (_top - 53 > this.contentHeight) {
                _div.scrollTop = _top - this.contentHeight;
            }
            _div.removeChild(_curPosition);
        }
    }
};

var Code = {
	run: function(el) {
		var _content = el.innerHTML;
		_content = _content.replace(/console\.log\((.+?)\)/g, "Code.outputFormate('$1');Code.outputFormate($1)");

		query(".console_content")[0].innerHTML = "";
		query('body')[0].removeChild(query('.myscript')[0]);
		var _myScript = document.createElement('script');
		_myScript.className = 'myscript';
		_myScript.innerHTML = _content;
		query('body')[0].appendChild(_myScript);
	},
	outputFormate: function(w) {
		var _this = this;
		query(".console_content")[0].innerHTML += _this.formate(objectFormat(w)) + '\n';
		function objectFormat(e) {
			var _output = '';
			if (_this.isObject(e)) {
				_output += '{';
				var totalKey = Object.keys(e).length;
				for (var i in e) {
					if (_this.isObject(e[i])) {
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
			} else {
				_output = e; 
			}
			return _output;
		}
	},
	isObject: function(e) {
		return (typeof e === 'object' && e.constructor === Object);
	},
	formate: function(e) {
		e = e.replace(/[	|\n]/g, '');

		var _tab = 0;
		var _trueContent = '';
		var _parenthesesNum = 0;

		for (var i = 0; i < e.length; i++) {
			var _addContent = '';
			switch (e[i]) {
				case '{':
					_tab++;
					_addContent += e[i];
					if (e[i+1] && e[i+1] != '}') {
						_addContent +=  '\n' + this.addTab(_tab);
					}
					break;
				case '}':
					_tab--;
					if (e[i-1] && e[i-1] != ';' && e[i-1] != '{') {
						_addContent += '\n' + this.addTab(_tab);
					}
					_addContent += e[i];
					if (e[i+1] && !isEndCharacter(e[i+1])) {
						_addContent += '\n' + this.addTab(_tab);
					}
					break;
				case ';':
					_addContent += e[i];
					if (e[i+1]) {
						_addContent += '\n' + this.addTab(_tab);
					}
					break;
				case ',':
					_addContent += e[i];
					// if (e[i+1] && e[i+1] != '{' && e[i+1] != '"' && e[i+1] != "'") {
					if (!_parenthesesNum) {
						_addContent += '\n' + this.addTab(_tab);
					}
					break;
				case '(': 
					_addContent += e[i];
					_parenthesesNum++;
					break;
				case ')':
					_addContent += e[i];
					_parenthesesNum--;
					break;
				default:
					_addContent += e[i];
					break;

			}
			_trueContent +=  _addContent;
		}

		return _trueContent;

		function isEndCharacter(e) {
			var endCharacter = ['}', ']', ';', ',', ')'];
			return util.isInArray(e, endCharacter);
		}
	},
	addTab: function(tab) {
		var _space = '';
		for (var i = tab - 1; i >= 0; i--) {
			_space += '    ';
		}
		return _space;
	}
};

var util = {
	isInArray: function (e, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (e === arr[i]) {
				return true;
			}
		}
		return false;
	}
};






addEvent(query('.code'), function(el) {
	el.innerHTML = Code.formate(el.innerHTML);
});


addEvent(query('.run'), function() {
	var _pre = this.previousSibling;
	if (_pre.nodeType === 3 && _pre.nodeName === '#text') {
		_pre = _pre.previousSibling;
	}
	Code.run(_pre);
}, 'click');

addEvent(query('.nav a'), function() {
	addEvent(query('.nav a'), function(el) {
		el.className = '';
	});
	this.className = 'active';
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
cursor.init();
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
			cursor.setCursortPosition('    ');
			tab++;
			break;
		case key.enter:
			_event.preventDefault();
			if (ctrl) {
				run(this);
			} else {
				cursor.setCursortPosition('\n');
				for (var i = 0; i < tab; i++) {
					cursor.setCursortPosition('    ');
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

var $anchor = query('li a');







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
			els[i].addEventListener(event, fun);
		} else {
			fun(els[i]);
		}
		
	}
}