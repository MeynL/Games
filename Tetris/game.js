// 场景大小
var action = null;
var gameBox = eval("[" + Array(24).join("[" + Array(10).join('0,') + "0],") + "0]");
var speed = 200;
var bgc = '#fff'; // 背景颜色
var blockc = '#C61120'; // 方块颜色
var obstacleC = '#4ABE87'; // 障碍颜色
var lc = '#f97'; // 框颜色
var blockL = 20; // 方块大小

var then = Date.now();
var downing = false;
var rotate = false;
var over = false;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.width = blockL * 10;
canvas.height = blockL * 20;
canvas.style.margin = '0 auto';
canvas.style.display = 'block';
canvas.style.border = '1px solid #000';
canvas.style.borderTop = '1px';

document.body.appendChild(canvas);

ctx.fillStyle = blockc;
// ctx.moveTo(blockL * 10, 0);
// ctx.lineTo(blockL * 10, blockL * 20);
// ctx.lineTo(0, blockL * 20);
// ctx.stroke();

document.body.addEventListener('keydown', function(e) {
    if (downing == true) return;
    if (rotate == true) return;
    if (e.keyCode == 39) {
        blockMove('right');
    }
    if (e.keyCode == 37) {
        blockMove('left');
    }
    if (e.keyCode == 40) {
        blockMove('down');
    }
    if (e.keyCode == 38) {
        rotate = true;
        blockMove('up');
    }
}, false);

// 方块旋转
var rotateBlock = function() {
    if (block.type == 'square') return rotate = false;

    var _blockShape = {
        'J': {
            len: 4,
            1: [
                [-1, 1],
                [-1, 1],
                [0, 0],
                [2, 0]
            ],
            2: [
                [1, -1],
                [0, -2],
                [-1, -1],
                [-2, 0]
            ],
            3: [
                [-1, 1],
                [1, 1],
                [2, 0],
                [2, 0]
            ],
            4: [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 0]
            ]
        },
        'L': {
            len: 4,
            1: [
                [2, 1],
                [1, 0],
                [0, -1],
                [-1, 0]
            ],
            2: [
                [-1, 1],
                [0, 0],
                [1, -1],
                [0, -2]
            ],
            3: [
                [-1, 0],
                [0, 1],
                [1, 2],
                [2, 1]
            ],
            4: [
                [0, -2],
                [-1, -1],
                [-2, 0],
                [-1, 1]
            ]
        },
        'line': {
            len: 2,
            1: [
                [0, 0],
                [-1, -1],
                [-2, -2],
                [-3, -3]
            ],
            2: [
                [0, 0],
                [1, 1],
                [2, 2],
                [3, 3]
            ]
        },
        's': {
            len: 2,
            1: [
                [-1, 2],
                [0, 1],
                [-1, 0],
                [0, -1]
            ],
            2: [
                [1, -2],
                [0, -1],
                [1, 0],
                [0, 1]
            ]
        },
        'z': {
            len: 2,
            1: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [-2, 1]
            ],
            2: [
                [-1, 0],
                [0, -1],
                [1, 0],
                [2, -1]
            ]
        },
        'T': {
            len: 4,
            1: [
                [0, 1],
                [0, -1],
                [-1, 0],
                [-2, 1]
            ],
            2: [
                [0, 0],
                [2, 0],
                [1, -1],
                [0, -2]
            ],
            3: [
                [0, 0],
                [0, 2],
                [1, 1],
                [2, 0]
            ],
            4: [
                [0, -1],
                [-2, -1],
                [-1, 0],
                [0, 1]
            ]
        }
    }

    var thisShape = _blockShape[block.type][block.row];

    if (
        gameBox[block.bd[0][1] + thisShape[0][1]][block.bd[0][0] + thisShape[0][0]] != 1 &&
        gameBox[block.bd[1][1] + thisShape[1][1]][block.bd[1][0] + thisShape[1][0]] != 1 &&
        gameBox[block.bd[2][1] + thisShape[2][1]][block.bd[2][0] + thisShape[2][0]] != 1 &&
        gameBox[block.bd[3][1] + thisShape[3][1]][block.bd[3][0] + thisShape[3][0]] != 1
    ) {
        var _temp = [
            [block.bd[0][0] + thisShape[0][0], block.bd[0][1] + thisShape[0][1]],
            [block.bd[1][0] + thisShape[1][0], block.bd[1][1] + thisShape[1][1]],
            [block.bd[2][0] + thisShape[2][0], block.bd[2][1] + thisShape[2][1]],
            [block.bd[3][0] + thisShape[3][0], block.bd[3][1] + thisShape[3][1]]
        ]
        var _move = 0;
        for (var i = 0; i < _temp.length; i++) {
            if (_temp[i][0] < 0) _move = _temp[i][0];
            if (_temp[i][0] > 9) _move = _temp[i][0] - 9;
        }
        if (
            gameBox[_temp[0][1]][_temp[0][0] - _move] != 1 &&
            gameBox[_temp[1][1]][_temp[1][0] - _move] != 1 &&
            gameBox[_temp[2][1]][_temp[2][0] - _move] != 1 &&
            gameBox[_temp[3][1]][_temp[3][0] - _move] != 1
        ) {
            block.bd[0] = [_temp[0][0] - _move, _temp[0][1]];
            block.bd[1] = [_temp[1][0] - _move, _temp[1][1]];
            block.bd[2] = [_temp[2][0] - _move, _temp[2][1]];
            block.bd[3] = [_temp[3][0] - _move, _temp[3][1]];
        }
        block.row = (block.row) % _blockShape[block.type].len + 1;
    }

    rotate = false;
}

// 方块行为
var blockMove = function(type) {
    switch (type) {
        case 'left':
            if (
                gameBox[block.bd[0][1]][block.bd[0][0] - 1] == 0 &&
                gameBox[block.bd[1][1]][block.bd[1][0] - 1] == 0 &&
                gameBox[block.bd[2][1]][block.bd[2][0] - 1] == 0 &&
                gameBox[block.bd[3][1]][block.bd[3][0] - 1] == 0
            ) {
                block.bd[0][0]--;
                block.bd[1][0]--;
                block.bd[2][0]--;
                block.bd[3][0]--;
            }
            break;
        case 'right':
            if (
                gameBox[block.bd[0][1]][block.bd[0][0] + 1] == 0 &&
                gameBox[block.bd[1][1]][block.bd[1][0] + 1] == 0 &&
                gameBox[block.bd[2][1]][block.bd[2][0] + 1] == 0 &&
                gameBox[block.bd[3][1]][block.bd[3][0] + 1] == 0
            ) {
                block.bd[0][0]++;
                block.bd[1][0]++;
                block.bd[2][0]++;
                block.bd[3][0]++;
            }
            break;
        case 'down':
            downing = true;
            break;
        case 'up':
            rotateBlock();
            break;
    }
};

// 主体渲染
var drawCont = function() {
    ctx.fillStyle = obstacleC;
    for (var i = 3; i < gameBox.length; i++) {
        for (var j = 0; j < gameBox[i].length; j++) {
            if (gameBox[i][j] == 1) {
                ctx.fillRect((j) * blockL, (i - 4) * blockL, blockL - 1, blockL - 1);
            };
        }
    }
};

// 当前方块渲染
var drawBlock = function() {
    if (block == undefined) return;
    ctx.fillStyle = blockc;
    for (var i = 0; i < block.bd.length; i++) {
        ctx.fillRect((block.bd[i][0]) * blockL, (block.bd[i][1] - 4) * blockL, blockL - 1, blockL - 1);
    }
    ctx.fillStyle = bgc;
    // ctx.fillRect(0, 0, blockL * 10, blockL * 2); // 隐藏未到显示主体的方块部位
}

// 消除
var eliminate = function() {

    var _flag = false;
    var _clearLine = function(num) {
        for (var i = num; i > 0; i--) {
            if (i != 0) gameBox[i] = gameBox[i - 1];
        }
        gameBox[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    for (var i = 0; i < gameBox.length; i++) {
        _flag = false;
        for (var j = 0; j < gameBox[i].length; j++) {
            if (gameBox[i][j] == 0) _flag = true;
        }
        if (_flag == false) {
            _clearLine(i);
        }
    }

}

// 随机方块
var randomBlock = function() {
    var _Btype = parseInt(Math.random() * 7 + 1);
    var _block = {};
    switch (_Btype) {
        case 1:
            _block = {
                type: 'line',
                row: 1,
                bd: [
                    [3, 3],
                    [4, 3],
                    [5, 3],
                    [6, 3]
                ]
            }
            break;
        case 2:
            _block = {
                type: 's',
                row: 1,
                bd: [
                    [5, 2],
                    [4, 2],
                    [4, 3],
                    [3, 3]
                ]
            }
            break;
        case 3:
            _block = {
                type: 'z',
                row: 1,
                bd: [
                    [3, 2],
                    [4, 2],
                    [4, 3],
                    [5, 3]
                ]
            }
            break;
        case 4:
            _block = {
                type: 'T',
                row: 1,
                bd: [
                    [4, 2],
                    [3, 3],
                    [4, 3],
                    [5, 3]
                ]
            }
            break;
        case 5:
            _block = {
                type: 'J',
                row: 1,
                bd: [
                    [5, 1],
                    [5, 2],
                    [5, 3],
                    [4, 3]
                ]
            }
            break;
        case 6:
            _block = {
                type: 'square',
                bd: [
                    [4, 2],
                    [4, 3],
                    [5, 2],
                    [5, 3]
                ]
            }
            break;
        case 7:
            _block = {
                type: 'L',
                row: 1,
                bd: [
                    [4, 1],
                    [4, 2],
                    [4, 3],
                    [5, 3]
                ]
            }
            break;
    }
    if (
        gameBox[_block.bd[0][1]][_block.bd[0][0]] == 1 ||
        gameBox[_block.bd[1][1]][_block.bd[1][0]] == 1 ||
        gameBox[_block.bd[2][1]][_block.bd[2][0]] == 1 ||
        gameBox[_block.bd[3][1]][_block.bd[3][0]] == 1
    ) {
        over = true;
    }
    return _block;
}

// 方块下落
var update = function(time) {
    if (time < speed) return false;
    if (rotate == true) return false;
    if (block == undefined) return;
    if (
        gameBox[block.bd[0][1] + 1] &&
        gameBox[block.bd[1][1] + 1] &&
        gameBox[block.bd[2][1] + 1] &&
        gameBox[block.bd[3][1] + 1]
    ) {
        if (
            gameBox[block.bd[0][1] + 1][block.bd[0][0]] == 0 &&
            gameBox[block.bd[1][1] + 1][block.bd[1][0]] == 0 &&
            gameBox[block.bd[2][1] + 1][block.bd[2][0]] == 0 &&
            gameBox[block.bd[3][1] + 1][block.bd[3][0]] == 0
        ) {
            block.bd[0][1]++;
            block.bd[1][1]++;
            block.bd[2][1]++;
            block.bd[3][1]++;
            return true;
        }
    }
    gameBox[block.bd[0][1]][block.bd[0][0]] = 1;
    gameBox[block.bd[1][1]][block.bd[1][0]] = 1;
    gameBox[block.bd[2][1]][block.bd[2][0]] = 1;
    gameBox[block.bd[3][1]][block.bd[3][0]] = 1;
    block = randomBlock();
    downing = false;
    eliminate();
    return true;
}

// 换帧
var clear = function() {
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, blockL * 10 - 1, blockL * 20 - 1);
}

// 主体
var main = function() {

    if (over) return console.log('game over'); // 游戏结束
    var now = Date.now();
    var delta = now - then;
    if (downing) {
        update(speed);
    } else if (update(delta)) {
        then = now;
    };
    clear();
    drawBlock();
    drawCont();

    action = requestAnimationFrame(main);
}

var block = randomBlock(); // 当前方块
main();

var reset = function() {

    cancelAnimationFrame(action);

    gameBox = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 头三行不显示
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    then = Date.now();
    downing = false;
    rotate = false;
    over = false;

    block = randomBlock(); // 当前方块
    main();
}
