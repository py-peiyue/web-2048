'use strict';
/*
 * "use strict" 是使用严格模式
 * 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
 * 消除代码运行的一些不安全之处，保证代码运行的安全；
 * 提高编译器效率，增加运行速度；
 * 为未来新版本的Javascript做好铺垫。
 * "严格模式"体现了Javascript更合理、更安全、更严谨的发展方向，
 * 包括IE 10在内的主流浏览器，都已经支持它，许多大项目已经开始全面拥抱它。
 * 另一方面，同样的代码，在"严格模式"中，可能会有不一样的运行结果;
 * 一些在"正常模式"下可以运行的语句，在"严格模式"下将不能运行。
 * 掌握这些内容，有助于更细致深入地理解Javascript，让你变成一个更好的程序员。
 */

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    } return target;
};

var game = null;//创建游戏变量
var scoreId;
scoreId = document.getElementById('score');
var bestId = document.getElementById('best');
var addId = document.getElementById('add');

var endId = document.getElementById('end');

var size = 4;

var nextId = 1;

var score = 0;

var bestScore =0;
function initGame() {
    game = Array(size * size).fill(null); 
}

function updateDOM(before, after) {
    var newElements = getNewElementsDOM(before, after);
    var existingElements = getExistingElementsDOM(before, after);
    var mergedTiles = getMergedTiles(after);
    removeElements(mergedTiles);
    drawGame(newElements, true);
    drawGame(existingElements);
}

function removeElements(mergedTiles) {
    for (var _iterator = mergedTiles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var tile = _ref;

        var _loop = function _loop() {
            if (_isArray2) {
                if (_i2 >= _iterator2.length) return 'break';
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) return 'break';
                _ref2 = _i2.value;
            }

            var id = _ref2;

            var currentElm = document.getElementById(id);
            positionTile(tile, currentElm);
            currentElm.classList.add('tile--shrink');
            setTimeout(function () {
                currentElm.remove();
            }, 100);
        };

        for (var _iterator2 = tile.mergedIds, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            var _ret = _loop();

            if (_ret === 'break') break;
        }
    }
}

function getMergedTiles(after) {
    return after.filter(function (tile) {
        return tile && tile.mergedIds;
    });
}

function getNewElementsDOM(before, after) {
    var beforeIds = before.filter(function (tile) {
        return tile;
    }).map(function (tile) {
        return tile.id;
    });
    var newElements = after.filter(function (tile) {
        return tile && beforeIds.indexOf(tile.id) === -1;
    });
    return newElements;
}

function getExistingElementsDOM(before, after) {
    var beforeIds = before.filter(function (tile) {
        return tile;
    }).map(function (tile) {
        return tile.id;
    });
    var existingElements = after.filter(function (tile) {
        return tile && beforeIds.indexOf(tile.id) !== -1;
    });
    return existingElements;
}

function drawBackground() {
    var tileContainer = document.getElementById('tile-container');
    tileContainer.innerHTML = '';
    for (var i = 0; i < game.length; i++) {
        var tile = game[i];
        var tileDiv = document.createElement('div');
        var x = i % size;
        var y = Math.floor(i / size);
        tileDiv.style.top = y * 100 + 'px';
        tileDiv.style.left = x * 100 + 'px';

        tileDiv.classList.add("background");
        tileContainer.appendChild(tileDiv);
    }
}

function positionTile(tile, elm) {
    var x = tile.index % size;
    var y = Math.floor(tile.index / size);
    elm.style.top = y * 100 + 'px';
    elm.style.left = x * 100 + 'px';
}

function drawGame(tiles, isNew) {
    var tileContainer = document.getElementById('tile-container');
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile) {
            if (isNew) {
                (function () {
                    var tileDiv = document.createElement('div');
                    positionTile(tile, tileDiv);
                    tileDiv.classList.add('tile', 'tile--' + tile.value);
                    tileDiv.id = tile.id;
                    setTimeout(function () {
                        tileDiv.classList.add("tile--pop");
                    }, tile.mergedIds ? 1 : 150);
                    tileDiv.innerHTML = '<p>' + tile.value + '</p>';
                    tileContainer.appendChild(tileDiv);
                })();
            } else {
                var currentElement = document.getElementById(tile.id);
                positionTile(tile, currentElement);
            }
        }
    }
}

function gameOver() {
    if (game.filter(function (number) {
            return number === null;
        }).length === 0) {
        var sameNeighbors = game.find(function (tile, i) {
            var isRightSame = game[i + 1] && (i + 1) % 4 !== 0 ? tile.value === game[i + 1].value : false;
            var isDownSame = game[i + 4] ? tile.value === game[i + 4].value : false;
            if (isRightSame || isDownSame) {
                return true;
            }
            return false;
        });
        return !sameNeighbors;
    }
}

function generateNewNumber() {
    // 0.9 probability of 2, 0.1 probability of 4
    var p = Math.random() * 100;
    return p <= 90 ? 2 : 4;
}

function addRandomNumber() {
    // Adds either a 2 or a 4 to an empty position in the game array
    var emptyCells = game.map(function (_, index) {
        return index;
    }).filter(function (index) {
        return game[index] === null;
    });
    if (emptyCells.length === 0) {
        return;
    }
    var newPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    var newObj = {
        id: nextId++,
        index: newPos,
        value: generateNewNumber()
    };
    game.splice(newPos, 1, newObj);
}

function getIndexForPoint(x, y) {
    return y * size + x;
}

function reflectGrid(grid) {
    var reflectedGame = Array(size * size).fill(0);
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            var index1 = getIndexForPoint(col, row);
            var index2 = getIndexForPoint(size - col - 1, row);
            reflectedGame[index1] = grid[index2];
        }
    }
    return reflectedGame;
}

function rotateLeft90Deg(grid) {
    var rotatedGame = Array(size * size).fill(0);
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            var index1 = getIndexForPoint(col, row);
            var index2 = getIndexForPoint(size - 1 - row, col);
            rotatedGame[index1] = grid[index2];
        }
    }
    return rotatedGame;
}

function rotateRight90Deg(grid) {
    var rotatedGame = Array(size * size).fill(0);
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            var index1 = getIndexForPoint(col, row);
            var index2 = getIndexForPoint(row, size - 1 - col);
            rotatedGame[index1] = grid[index2];
        }
    }
    return rotatedGame;
}

/*
For any cell whose neighbor to the right is empty, move that cell
to the right. For any cell whose neighbor to the right is equal
to the same value, combine the values together (e.g. 2+2 = 4)
*/
function shiftGameRight(gameGrid) {
    // reflect game grid
    var reflectedGame = reflectGrid(gameGrid);
    // shift left
    reflectedGame = shiftGameLeft(reflectedGame);
    // reflect back
    return reflectGrid(reflectedGame);
}

function shiftGameLeft(gameGrid) {
    var newGameState = [];
    var totalAdd = 0;
    // for rows
    for (var i = 0; i < size; i++) {
        // for columns
        var firstPos = 4 * i;
        var lastPos = size + 4 * i;
        var currentRow = gameGrid.slice(firstPos, lastPos);
        var filteredRow = currentRow.filter(function (row) {
            return row;
        });
        for (var _iterator3 = filteredRow, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
            }

            var row = _ref3;

            delete row.mergedIds;
        }

        for (var j = 0; j < filteredRow.length - 1; j++) {
            if (filteredRow[j].value === filteredRow[j + 1].value) {
                var sum = filteredRow[j].value * 2;
                filteredRow[j] = {
                    id: nextId++,
                    mergedIds: [filteredRow[j].id, filteredRow[j + 1].id],
                    value: sum
                };
                filteredRow.splice(j + 1, 1);
                score += sum;
                totalAdd += sum;
            }
        }
        while (filteredRow.length < size) {
            filteredRow.push(null);
        };
        newGameState = [].concat(newGameState, filteredRow);
    }

    if (totalAdd > 0) {
        scoreId.innerHTML = score;
        addId.innerHTML = '+' + totalAdd;
        addId.classList.add('active');
        setTimeout(function () {
            addId.classList.remove("active");
        }, 800);
    }
    if(bestScore<score) {
        bestScore=score;
        bestId.innerHTML = score;
    }
    return newGameState;
}

function shiftGameUp(gameGrid) {
    var rotatedGame = rotateLeft90Deg(gameGrid);
    rotatedGame = shiftGameLeft(rotatedGame);
    return rotateRight90Deg(rotatedGame);
}

function shiftGameDown(gameGrid) {
    var rotatedGame = rotateRight90Deg(gameGrid);
    rotatedGame = shiftGameLeft(rotatedGame);
    return rotateLeft90Deg(rotatedGame);
}

var buttons = document.querySelectorAll(".js-restart-button");
var length = buttons.length;
for (var i = 0; i < length; i++) {
    if (document.addEventListener) {
        buttons[i].addEventListener("click", function () {
            newGameStart();
        });
    } else {
        buttons[i].attachEvent("onclick", function () {
            newGameStart();
        });
    };
};
var buttons_h = document.querySelectorAll(".js-help-button");
var length_h = buttons_h.length;
for (var i = 0; i < length_h; i++) {

    if (document.addEventListener) {
        buttons_h[i].addEventListener("click", function () {
            alert(
                "开始时随机出现两个数字出现的数字仅可能为2或4\n" +
                "上下左右四个方向键控制棋盘内的数字上下左右移动\n" +
                "玩家选择的方向上若有相同的数字则合并，\n" +
                "每次移动可以同时合并，但不可以连续合并 \n" +
                "合并所得的所有新生成数字相加即为该步的有效得分\n" +
                "玩家选择的方向上的行或列前方有空格则出现位移\n" +
                "每移动一步棋盘的空位(无数字处)随机出现一个数字(2或4)\n" +
                "棋盘被数字填满，无法进行有效移动，判负，游戏结束\n" +
                "棋盘上出现2048，判胜，游戏结束"
                );
        });
    } else {
        buttons_h[i].attachEvent("onclick", function () {
            alert("开始时棋盘内随机出现两个数字，出现的数字仅可能为2或4\n" +
                "　　玩家可以选择上下左右四个方向，若棋盘内的数字出现位移或合并，视为有效移动\n" +
                "　　玩家选择的方向上若有相同的数字则合并，每次有效移动可以同时合并，但不可以连续合并\n" +
                "　　合并所得的所有新生成数字想加即为该步的有效得分\n" +
                "　　玩家选择的方向行或列前方有空格则出现位移\n" +
                "　　每有效移动一步，棋盘的空位(无数字处)随机出现一个数字(依然可能为2或4)\n" +
                "　　棋盘被数字填满，无法进行有效移动，判负，游戏结束\n" +
                "　　棋盘上出现2048，判胜，游戏结束");
        });
    };
}
document.addEventListener("keydown", handleKeypress);
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    var prevGame = [].concat(game);
    if (!xDown || !yDown) {
        return;
    }
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            game = shiftGameLeft(game);
        } else {
            game = shiftGameRight(game);
        }
    } else {
        if (yDiff > 0) {
            game = shiftGameUp(game);
        } else {
            game = shiftGameDown(game);
        }
    }
    game = game.map(function (tile, index) {
        if (tile) {
            return _extends({}, tile, {
                index: index
            });
        } else {
            return null;
        }
    });
    addRandomNumber();
    updateDOM(prevGame, game);
    if (gameOver()) {
        setTimeout(function () {
            endId.classList.add('active');
        }, 800);
        return;
    }
    xDown = null;
    yDown = null;
};

function handleKeypress(evt) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    var whichKey = event.which;

    var prevGame = [].concat(game);

    if (!modifiers) {
        event.preventDefault();
        switch (whichKey) {
            case 37:
                game = shiftGameLeft(game);
                break;
            case 38:
                game = shiftGameUp(game);
                break;
            case 39:
                game = shiftGameRight(game);
                break;
            case 40:
                game = shiftGameDown(game);
                break;
        }
        game = game.map(function (tile, index) {
            if (tile) {
                return _extends({}, tile, {
                    index: index
                });
            } else {
                return null;
            }
        });
        addRandomNumber();
        updateDOM(prevGame, game);
        if (gameOver()) {
            setTimeout(function () {
                endId.classList.add('active');
            }, 800);
            return;
        }
    }
}

function newGameStart() {
    document.getElementById('tile-container').innerHTML = '';
    endId.classList.remove('active');
    score = 0;
    scoreId.innerHTML = score;
    initGame();
    drawBackground();
    var previousGame = [].concat(game);
    addRandomNumber();
    addRandomNumber();
    updateDOM(previousGame, game);
}

newGameStart();
