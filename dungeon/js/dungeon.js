(function(){

    var size = 80;

    var movement = size / 2;

    var boundary = {
        top: size,
        left: size,
        bottom: 0,
        right: 0
    }

    var me = $('#me');

    var facing = 'down';

    function initMeSize() {
        me.css('height', (size) + 'px');
        me.css('width', (size) + 'px');
    }

    function initBoundaries() {
        var level = $('#level');
        var height = level.height();
        var width = level.width();

        boundary.bottom = height - (height % size) - size;
        boundary.right = width - (width % size) - size;

        console.log('boundary', boundary);
    }

    function moveMe(x, y, key) {
        facing = key;

        var current = me.position();

        var newLeft = current.left + x;
        var newTop = current.top + y;

        // BOUNDARY CHECK - START
        if (key === 'left' && current.left < boundary.left) {
            return;
        }

        if (key === 'up' && current.top < boundary.top) {
            return;
        }

        if (key === 'right' && current.left > boundary.right) {
            return;
        }
        if (key === 'down' && current.top > boundary.bottom) {
            return;
        }
        // BOUNDARY CHECK - END

        me.css('left', (newLeft) + 'px');
        me.css('top', (newTop) + 'px');
        me.attr('class', '');
        me.addClass(facing);

        var positionStr = (newLeft) + 'px, ' + (newTop) + 'px';
        $('#overlay').html(positionStr);
    }

    var keyCodeMap = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    var keyHandler = {
        left: function() { // left
            // console.log('left');
            moveMe(movement*-1, 0, 'left');
        },
        up: function() { // up
            // console.log('up');
            moveMe(0, movement*-1, 'up');
        },
        right: function() { // right
            // console.log('right');
            moveMe(movement, 0, 'right');
        },
        down: function() { // down
            // console.log('down');
            moveMe(0, movement, 'down');
        }
    }

    function keypress(event) {
        var key = keyCodeMap[event.keyCode];
        handler = keyHandler[key];
        handler && handler();
    }

    window.addEventListener("keydown", keypress, false);

    initBoundaries();
    initMeSize();

})();
