
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

{
	var codeContent = query('.code');
	for (var i = 0; i < codeContent.length; i++) {
		codeContent[i].innerHTML = fomate(codeContent[i].innerHTML);
	}

}

{
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
			case 9: 
				_event.preventDefault();
				cursor.setCursortPosition('    ');
				tab++;
				break;
			case 13:
				_event.preventDefault();
				if (ctrl) {
					run();
				} else {
					cursor.setCursortPosition('\n');
					for (var i = 0; i < tab; i++) {
						cursor.setCursortPosition('    ');
					}
				}
				break;
			case 16:
				shift = true;
				_shift = setTimeout(clearShift, 5e2);
				break;
			case 17:
				ctrl = true;
				_ctrl = setTimeout(clearCtrl, 5e2);
				break;
			case 219:
				if (shift) 
				tab++;
				break;
			case 221:
				if (shift) 
				tab--;
				break;
		}

		if (keyCode !== 17) {
			clearTimeout(_ctrl);
			clearCtrl();
		}
		if (keyCode !== 16) {
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

	function run() {
		var _content = query('.content')[0].innerHTML.replace(/console\.log/g, 'query(".console")[0].append');
		query('.myscript')[0].innerHTML = _content;
	}

}



function query(e, fa) {
	var _fa = document;
	if (fa) {
		_fa = fa;
	}
	return _fa.querySelectorAll(e);
}
function fomate(e) {
	var _tab = 0;
	e = e.replace(/	/g, '');
	var _trueContent = '';
	for (var i = 0; i < e.length; i++) {
		var _addContent = '';
		switch (e[i]) {
			case '{':
				_tab++;
				if (e[i+1] != '}') {
					_addContent += '\n' + addTab(_tab);
				}
				break;
			case '}':
				_tab--;
				if (e[i+1] != ';') {
					_addContent += '\n' + addTab(_tab);
				}
				break;
			case ';':
				_addContent = '\n';
				break;
		}
		_trueContent += e[i] + _addContent;
	}

	
	return _trueContent;

	function addTab(tab) {
		var _space = '';
		for (var i = tab - 1; i >= 0; i--) {
			_space += '    ';
		}
		return _space;
	}
}