(function() {

    var cellSize = 20;
    var worldSize = 20; // width and height of world
    var lifeArray = [];
    var aliveCount = 0;

    var generationColors = [
        '#2E5242',
        '#257351',
        '#1C8F5D',
        '#0EAE68',
        '#01DA7C',
        '#009c58'
    ]

    var allowResize = true;
    var viewport = { width: 0, height: 0 };

    var magicNumber = 1.195; // used to initialise life state

    var svgns = 'http://www.w3.org/2000/svg';

    var canvas = null;

    function getIterator(size) {
        var itr = [];
        for (var i=0; i < size; i++) {
            itr.push(i);
        }
        return itr;
    }

    function getRandomState() {
        var alive =Math.floor(Math.random() * magicNumber);
        return {
            generation: 0,
            alive: alive
        };
    }

    function initCanvas() {
        canvas = document.createElementNS(svgns, 'svg');
        canvas.setAttributeNS(null, 'id', 'life-canvas');
        canvas.setAttributeNS(null, 'width', cellSize*worldSize);
        canvas.setAttributeNS(null, 'height', cellSize*worldSize);
    }

    function getLifeArray() {
        var itr = getIterator(worldSize);
        return itr.map(function(i) {
            return itr.map(function(i) {
                return getRandomState();
            });
        });
    }

    function liveOrDie(x, y, aliveNeighbours, currentLifeArray) {
        var currentGeneration = lifeArray[x][y].generation;
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
            lifeArray[x][y].alive = 0;
            lifeArray[x][y].generation = 0;
        } else if (aliveNeighbours === 2 || aliveNeighbours === 3) {
            lifeArray[x][y].alive = 1;
            lifeArray[x][y].generation++;
            lifeArray[x][y].generation++;
        } else if (aliveNeighbours === 3 && !currentLifeArray[x][y]) {
            lifeArray[x][y].alive = 1;
            lifeArray[x][y].generation++;
        } else {
            // lifeArray[x][y] = 0;
        }
    }

    function countAliveNeighbours(x, y) {
        var xItr = [x];
        var yItr = [y];
        var aliveNeighbours = 0;
        var currentLifeArray = _.clone(lifeArray);

        var startX = x === 0 ? x : x - 1;
        var startY = y === 0 ? y : y - 1;
        var endX = x === worldSize-1 ? x : x + 1;
        var endY = y === worldSize-1 ? y : y + 1;

        for (var checkX=startX; checkX < endX+1; checkX++) {
            for (var checkY=startY; checkY < endY+1; checkY++) {
                if (x !== checkX && y !== checkY && currentLifeArray[checkX][checkY].alive) {
                    aliveNeighbours++;
                }
            }
        }

        liveOrDie(x, y, aliveNeighbours, currentLifeArray);
    }

    function setAttr(target, key, val) {
        target.setAttributeNS(null, key, val);
    }

    function cell(size, x, y, color) {
        var cell = document.createElementNS(svgns, 'rect');
        setAttr(cell, 'x', x);
        setAttr(cell, 'y', y);
        setAttr(cell, 'width', size);
        setAttr(cell, 'height', size);
        setAttr(cell, 'fill', color);
        canvas.appendChild(cell);
    }

    function getCellColor(x, y) {
        var isAlive = lifeArray[x][y].alive;
        var generation = lifeArray[x][y].generation;
        if (isAlive) {
            return generation <= generationColors.length ? generationColors[generation] : '#009c58';
        }
        return '#000';
    }

    function evolve(x, y) {
        var color = getCellColor(x, y);
        cell(cellSize, x*cellSize, y*cellSize, color);
        if (lifeArray[x][y].alive) {
            aliveCount++;
        }
    }

    function drawLife() {
        aliveCount = 0;
        lifeArray.forEach(function(i, y) {
            lifeArray.forEach(function(i, x) {
                evolve(x, y);
            })
        });
        setAliveCount();
    };

    function setAliveCount() {
        var maxPopulationWidth = cellSize * worldSize;
        var populationMeter = Math.ceil((aliveCount / maxPopulationWidth * 100) * 10);
        if (populationMeter >= maxPopulationWidth) {
            populationMeter = maxPopulationWidth;
        }
        $('.population').css('width', populationMeter);
        $('.alive .count').html(aliveCount);
    }

    function evolution() {
        var itr = getIterator(worldSize);
        itr.forEach(function(i, x) {
            itr.forEach(function(i, y) {
                countAliveNeighbours(x, y);
            })
        });
        drawLife();
    }

    function initLife() {
        lifeArray = getLifeArray();
        initCanvas();
        drawLife();

        $('.life').css('width', (cellSize*worldSize)+'px');

        if (canvas) {
            $('svg').remove();
        }

        $('.life').append(canvas);
    }

    function getHeightWidth() {
        viewport.height = $(window).height() - 120;
        viewport.width = $(window).width() - 120;
        var newWorldSize = Math.floor((viewport.height < viewport.width ? viewport.height : viewport.width) / cellSize);
        if (newWorldSize !== worldSize) {
            worldSize = newWorldSize;
        }
    }

    function run() {
        evolution();
        setTimeout(run, 500);
    }

    function initAll() {
        getHeightWidth();
        initLife();
    }

    $(function() {
        $('.resetButton').click(initAll);

        initAll();
        run();

        $(window).resize(initAll);
    })

})();
