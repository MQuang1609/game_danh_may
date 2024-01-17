const questions = [
  {
    id: 1,
    texts: [
      'Bộ phận máy tính có chức năng đưa thông tin vào?',
    ],
    answer: 'Ban phim',
  },
  {
    id: 2,
    texts: [
      'Khi gõ xong, các ngón tay của em',
      'phải đặt ở hàng phím nào?',
    ],
    answer: 'Co so',
  },
  {
    id: 3,
    texts: 
    [
      'Ngồi đúng tư thế khi làm việc với máy tính',
      'sẽ giúp em tránh?',
    ],
    answer: 'Can thi',
  },
  {
    id: 4,
    texts: 
    ['Trẻ em không nên làm việc với máy tính', 
    'quá bao nhiêu phút?',
    ],
    answer: 'Ba muoi',
  },
  {
    id: 5,
    texts: ['Khi thực hiện gõ bàn phím các ngón tay cần phải?'],
    answer: 'Go nhe dut khoat',
  },
  {
    id: 6,
    texts: ['Ngồi đúng tư thế làm việc với máy tính giúp em?'],
    answer: 'Bao ve suc khoe',
  },
  {
    id: 7,
    texts: ['Cần thực hiện các quy tắc về điện để tránh?'],
    answer: 'Bi dien giat',
  },
];

const level3ReduceStep = 0.5;

class Level3Scene extends Phaser.Scene {
  questionIndex = 0;
  characterIndex = 0;
  correct = 0;
  wrong = 0;
  texts = {};
  ended = false;
  score = 0;
  answerInputs = [];
  playTime = 0;

  constructor() {
    super('Level3Scene');
  }

  drawResultModal() {
    this.modalResult = {
      container: this.add
        .rectangle(width / 2, height / 2, 400, 250, 0xf2f494)
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
            `Thời gian: ${calculateTime(this.playTime)}`,
          ],
          {
            fontFamily: 'Arial',
            color: '#000',
            fontSize: 30,
            fontWeight: 'bold',
          }
        )
        .setOrigin(0.5, 0.5)
        .setDepth(2),
      nextButton: new Button(this, {
        text: `CHƠI LẠI`,
        x: width / 2,
        y: height / 2 + 80,
        textColor: '#fff',
        btnColor: 0x6666ff,
        onClick: () => {
          this.scene.start('LoadingScene');
        },
        width: 250,
      }),
    };

    this.modalResult.text.align = 'center';
  }

  drawTexts() {
    if (!Object.keys(this.texts).length) {
      this.texts.correctLabel = this.add.text(width - 200, 20, 'Đúng:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#000000',
      });

      this.texts.correctValue = this.add.text(
        width - 125,
        20,
        `${this.correct}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#000000',
        }
      );

      this.texts.wrongLabel = this.add.text(width - 200, 45, 'Sai:', {
        fontSize: 24,
        fontWeight: 700,
        color: '#000000',
      });

      this.texts.wrongValue = this.add.text(width - 135, 45, `${this.wrong}`, {
        fontSize: 24,
        fontWeight: 700,
        color: '#000000',
      });

      this.texts.score = this.add.text(
        width - 200,
        70,
        `Score: ${this.score}`,
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#000000',
        }
      );

      return;
    }

    this.texts.correctValue.text = `${this.correct}`;
    this.texts.wrongValue.text = `${this.wrong}`;
    this.texts.score.text = `Score: ${this.score}`;
  }

  drawQuestion() {
    if (this.questionText) {
      this.questionText.destroy(true);
      this.questionText = null;
    }

    if (this.questionContainer) {
      this.questionContainer.destroy(true);
      this.questionContainer = null;
    }

    this.questionText = this.add
      .text(width / 2, height / 2 - 50, this.question.texts, {
        fontSize: 32,
        fontWeight: 700,
        color: '#000',
      })
      .setOrigin(0.5, 0.5)
      .setDepth(1);

    this.questionContainer = this.add
      .rectangle(
        width / 2,
        height / 2 - 50,
        this.questionText.width + 100,
        this.questionText.height + 50,
        0xffffff
      )
      .setOrigin(0.5, 0.5);
  }

  drawAnswer() {
    if (this.answerTexts) {
      this.answerTexts.map((answerText) => {
        answerText.destroy(true);
      });
      this.answerTexts = [];
    }

    if (this.answerContainer) {
      this.answerContainer.destroy(true);
      this.answerContainer = null;
    }

    const answerCharacters = this.question.answer.split('');
    let x = width / 2 - Math.floor(answerCharacters.length / 2) * 20;
    this.answerTexts = answerCharacters.map((character) => {
      const answerCharacter = this.add
        .text(x, height - 100, character, {
          fontSize: 32,
          fontWeight: 700,
          color: '#ddd',
        })
        .setOrigin(0.5, 0.5)
        .setDepth(1);

      x += 20;
      return answerCharacter;
    });

    this.answerContainer = this.add
      .rectangle(
        width / 2,
        height - 100,
        this.answerTexts.at(-1).x -
          this.answerTexts[0].x +
          this.answerTexts[0].width / 2 +
          this.answerTexts.at(-1).width / 2 +
          100,
        this.answerTexts[0].height + 50,
        0xffffff
      )
      .setOrigin(0.5, 0.5);
  }

  generateQuestion() {
    this.question = questions[this.questionIndex];
    this.characterIndex = 0;
    this.answerInputs = [];
    this.progressBar && (this.progressBar.width = 400);

    this.drawQuestion();
    this.drawAnswer();
    this.drawTexts();
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
      this.wrong++;
      if (this.questionIndex < questions.length - 1) {
        this.progressBar.width = 400;
        this.questionIndex++;
        this.generateQuestion();
      } else {
        this.drawTexts();
        this.gameOver();
      }
    } else {
      this.progressBar.width -= level3ReduceStep;
    }
  }

  highlight() {
    this.answerTexts = this.answerTexts.map((item, index) => {
      const text = item.text;
      const x = item.x;
      const y = item.y;

      item.destroy(true);

      const answerInputCharacter = this.answerInputs[index];
      let color = '#ddd';
      if (answerInputCharacter) {
        if (
          toLowerCaseNonAccentVietnamese(answerInputCharacter) ===
          toLowerCaseNonAccentVietnamese(text)
        ) {
          color = '#0f0';
        } else {
          color = '#f00';
        }
      }

      return this.add
        .text(x, y, text, {
          fontSize: 32,
          fontWeight: 700,
          color,
        })
        .setOrigin(0.5, 0.5)
        .setDepth(2);
    });
  }

  checkAnswer() {
    const valid = this.answerTexts.every((item, index) => {
      return (
        toLowerCaseNonAccentVietnamese(item.text) ===
        toLowerCaseNonAccentVietnamese(this.answerInputs[index] || '')
      );
    });

    if (valid) {
      this.correctSound.play();
      this.correct++;
      this.score += Math.floor(this.progressBar.width);
    } else {
      this.wrongSound.play();
      this.wrong++;
    }

    this.drawTexts();
    if (this.questionIndex < questions.length - 1) {
      this.questionIndex++;
      this.generateQuestion();
    } else {
      this.gameOver();
    }
  }

  addKeyboardListener() {
    this.input.keyboard.on('keydown', (event) => {
      this.keyboardSound.play();
      if (this.ended) return;
      if (
        ![...characters, 'BACKSPACE', ' ', 'ENTER'].includes(
          event.key?.toUpperCase()
        )
      )
        return;

      if (event.key === 'Backspace') {
        this.answerInputs.pop();
      } else if (event.key === 'Enter') {
        this.checkAnswer();
      } else {
        this.answerInputs.push(event.key);
      }

      this.highlight();
    });
  }

  updateTime(delta) {
    if (this.ended) return;
    this.playTime += delta;
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'bg3').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    // add sounds
    this.correctSound = this.sound.add('correct-sound');
    this.wrongSound = this.sound.add('wrong-sound');
    this.keyboardSound = this.sound.add('keyboard-sound');

    // this.drawBoard();
    this.updateProgressBar();
    this.generateQuestion();
    this.addKeyboardListener();
  }

  update(_, delta) {
    this.updateProgressBar();
    this.updateTime(delta);
  }
}
