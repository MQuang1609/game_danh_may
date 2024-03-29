const reduceStep = 2;
const numberOfQuestions = 20;

class Level1Scene extends Phaser.Scene {
  handIndex = null;
  character = null;
  correct = 0;
  wrong = 0;
  texts = {};
  ended = false;
  score = 0;
  playTime = 0;

  constructor() {
    super('Level1Scene');
  }

  drawResultModal() {
    this.modalResult = {
      container: this.add
        .rectangle(width / 2, height / 2, 400, 350, 0xf2f494)
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      text: this.add
        .text(
          width / 2,
          height / 2 - 30,
          [
            `CHÚC MỪNG BẠN`,
            `Số câu đúng: ${this.correct}`,
            `Số câu sai: ${this.wrong}`,
            `Điểm: ${this.score}`,
            `Tổng Thời gian: ${calculateTime(this.playTime)}`,
          ],
          {
            fontFamily: 'Arial',
            color: '#000',
            fontSize: 32,
            fontWeight: 'bold',
          }
        )
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      nextButton: new Button(this, {
        text: `Cấp độ tiếp theo`,
        x: width / 2,
        y: height / 2 + 110,
        textColor: '#fff',
        btnColor: 0x6666ff,
        onClick: () => {
          this.scene.start('PreLevel2Scene');
        },
        width: 350,
      }),
    };

    this.modalResult.text.align = 'center';
  }

  drawBoard() {
    this.board = this.add
      .rectangle(width / 2, height / 2, 300, 300, 0xffffff)
      .setOrigin(0.5, 0.5);
  }

  drawTexts() {
    if (!Object.keys(this.texts).length) {
      this.texts.correctLabel = this.add.text(width - 200, 20, 'Đúng:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#cc0315',
      });

      this.texts.correctValue = this.add.text(
        width - 125,
        20,
        `${this.correct}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#cc0315',
        }
      );

      this.texts.wrongLabel = this.add.text(width - 200, 45, 'Sai:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#cc0315',
      });

      this.texts.wrongValue = this.add.text(width - 135, 45, `${this.wrong}`, {
        fontSize: 24,
        fontWeight: 700,
        color: '#cc0315',
      });

      this.texts.score = this.add.text(
        width - 200,
        70,
        `Score: ${this.score}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#cc0315',
        }
      );

      return;
    }

    this.texts.correctValue.text = `${this.correct}`;
    this.texts.wrongValue.text = `${this.wrong}`;
    this.texts.score.text = `Score: ${this.score}`;
  }

  drawCharacter() {
    const characterList = hands[this.handIndex];
    const index = Math.floor(Math.random() * characterList.length);
    this.character = characterList[index];

    if (this.characterText) {
      this.characterText.destroy(true);
      this.characterText = null;
    }

    this.characterText = this.add
      .text(width / 2, height / 2, this.character, {
        fontSize: 100,
        fontWeight: 700,
        fontFamily: 'Itim',
        color: '#000',
      })
      .setOrigin(0.5, 0.5);
  }

  generateCharacter() {
    const newIndex = Math.floor(Math.random() * 8);
    this.handIndex = newIndex;
    this.drawHandImage();
    this.drawCharacter();
    this.drawTexts();
    this.progressBar && (this.progressBar.width = 400);
  }
  
  drawHandImage() {
    if (this.handImage) {
      this.handImage.destroy(true);
      this.handImage = null;
    }
    const url = this.handIndex ? `hands_${this.handIndex}` : `hands`;
    this.handImage = this.add.image(width / 2, height, url).setOrigin(0.5, 1);
  }
  gameOver() {
    this.ended = true;
    this.drawResultModal();
  }

  updateProgressBar() {
    if (this.ended) return;

    if (!this.progressBar) {
      this.clock = this.add.image(20, 20, 'clock').setOrigin(0, 0);
      this.progressBar = this.add
        .rectangle(100, 40, 400, 30, 0x6666ff)
        .setOrigin(0, 0);

      return;
    }

    if (this.progressBar.width === 0) {
      this.progressBar.width = 400;
      this.wrong++;
      if (this.correct + this.wrong < numberOfQuestions) {
        this.generateCharacter();
      } else {
        this.drawTexts();
        this.gameOver();
      }
    } else {
      this.progressBar.width -= reduceStep;
    }
  }

  addKeyboardListener() {
    this.input.keyboard.on('keydown', (event) => {
      this.keyboardSound.play();
      if (this.ended) return;

      if (event.key?.toUpperCase() === this.character) {
        this.correct++;
        this.correctSound.play();
        this.score += this.progressBar?.width
          ? Math.round(this.progressBar?.width / 10)
          : 0;
      } else {
        this.wrong++;
        this.wrongSound.play();
      }

      this.generateCharacter();
      if (this.correct + this.wrong === numberOfQuestions) {
        this.gameOver();
      }
    });
  }

  updateTime(delta) {
    if (this.ended) return;
    this.playTime += delta;
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'bg01').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    // add sounds
    this.correctSound = this.sound.add('correct-sound');
    this.wrongSound = this.sound.add('wrong-sound');
    this.keyboardSound = this.sound.add('keyboard-sound');

    this.drawBoard();
    this.updateProgressBar();
    this.generateCharacter();
    this.addKeyboardListener();
  }

  update(_, delta) {
    this.updateProgressBar();
    this.updateTime(delta);
  }
}
