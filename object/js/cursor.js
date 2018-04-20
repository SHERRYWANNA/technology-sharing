function Cursor(el) {
    var $el = el,
        position = 0,
        contentHeight = 0;

    // init
    contentHeight = parseInt(getComputedStyle($el, null).getPropertyValue('height'));

    var obj = {
        getCursortPosition: function () {
            if (window.getSelection) {
                var _sel = window.getSelection();
                var _range = _sel.getRangeAt(0);
                position = _range.startOffset;
                return _range.startOffset;
            }
        },
        setCursortPosition: function (text) {
            if (window.getSelection) {
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
                var _curPosition = query('span.curPosition', $el)[0],
                    _top = _curPosition.offsetTop;

                if (_top - 53 > contentHeight) {
                    $el.scrollTop = _top - contentHeight;
                }
                $el.removeChild(_curPosition);
            }
        }
    };
    return obj;
}