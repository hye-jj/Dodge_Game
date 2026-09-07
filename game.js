// ==============================
// 1. Canvas 설정
// ==============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 게임 화면 크기
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

console.log("게임 시작!");
console.log("Canvas 크기:", WIDTH, HEIGHT);


// ==============================
// 2. Player
// ==============================
// player가 객체(object)
const player = {
    x: WIDTH / 2 - 25,
    y: HEIGHT - 70,

    width: 50,
    height: 50,

    speed: 6
};


// 플레이어 그리기
function drawPlayer() {
    ctx.fillStyle = "dodgerblue";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}



// ==============================
// 3. 키보드 입력
// ==============================

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;

    // Game Over 상태에서 R을 누르면 재시작
    if (event.key === "r" || event.key === "R") {
        if (gameOver) {
            restartGame();
        }
    }
});


document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});



// ==============================
// 4. Player 이동
// ==============================

function updatePlayer() {

    // 왼쪽 이동
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    // 오른쪽 이동
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }


    // 화면 밖으로 나가지 못하도록 제한

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > WIDTH) {
        player.x = WIDTH - player.width;
    }
}



// ==============================
// 5. Enemy
// ==============================

const enemies = [];


// 새로운 적 생성
function createEnemy() {

    const size = 30;
    // random > 랜덤한 위치에서 생성
    // 난이도
    const difficulty = 1 + score / 100;
    
    const enemy = {
        x: Math.random() * (WIDTH - size),
        y: -size,
        width: size,
        height: size,
        speed: (3 + Math.random() * 2) * difficulty
    };

    enemies.push(enemy);
}


// 적 그리기
function drawEnemies() {

    ctx.fillStyle = "crimson";

    for (const enemy of enemies) {

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );
    }
}



// ==============================
// 6. Enemy 이동
// ==============================

function updateEnemies() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        const enemy = enemies[i];

        // 아래로 이동
        enemy.y += enemy.speed;


        // 화면 아래로 벗어나면 제거
        if (enemy.y > HEIGHT) {
            enemies.splice(i, 1);
        }
    }
}



// ==============================
// 7. 충돌 판정
// ==============================

function checkCollision(player, enemy) {

    return (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    );
}


// 모든 적과 충돌 검사
function checkAllCollisions() {

    for (const enemy of enemies) {

        if (checkCollision(player, enemy)) {

            gameOver = true;

            document.getElementById("gameOver").textContent =
                "GAME OVER!  R 키를 눌러 재시작";
        }
    }
}



// ==============================
// 8. 점수
// ==============================

let score = 0;
let lastScoreTime = 0;


function updateScore(timestamp) {

    // 100ms마다 점수 증가
    if (timestamp - lastScoreTime > 100) {

        score++;

        document.getElementById("score").textContent = score;

        lastScoreTime = timestamp;
    }
}


// ==============================
// 9. Enemy 생성 관리
// ==============================

let lastEnemyTime = 0;

function spawnEnemies(timestamp) {

    // 처음에는 약 0.8초마다 적 생성
    if (timestamp - lastEnemyTime > 800) {

        createEnemy();

        lastEnemyTime = timestamp;
    }
}


// ==============================
// 10. Game Loop
// ==============================

let gameOver = false;


function gameLoop(timestamp) {

    // 화면 지우기
    ctx.clearRect(0, 0, WIDTH, HEIGHT);


    // Game Over가 아니라면 게임 진행
    if (!gameOver) {

        // Player
        updatePlayer();

        // Enemy
        spawnEnemies(timestamp);
        updateEnemies();

        // 충돌
        checkAllCollisions();

        // 점수
        updateScore(timestamp);
    }


    // 화면 그리기

    drawPlayer();
    drawEnemies();


    // 다음 프레임 실행
    requestAnimationFrame(gameLoop);
}


// 게임 시작
requestAnimationFrame(gameLoop);



// ==============================
// 11. 게임 재시작
// ==============================

function restartGame() {

    // 게임 상태 초기화
    gameOver = false;

    // 점수 초기화
    score = 0;

    lastScoreTime = 0;

    // 적 모두 삭제
    enemies.length = 0;

    // Player 위치 초기화
    player.x = WIDTH / 2 - player.width / 2;

    // Game Over 메시지 제거
    document.getElementById("gameOver").textContent = "";

    // 점수 화면 초기화
    document.getElementById("score").textContent = "0";
}
