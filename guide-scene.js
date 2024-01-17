class GuideScene extends Phaser.Scene {
  constructor() {
    super('GuideScene');
  }

  preload() {}

  create() {
    // add bg
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.background.depth = -1;

    // add text
    this.guideText = this.add
      .text(
        width / 2,
        200,
        [
          'Chúng ta cần phải hoàn thành 3 cấp độ bao gồm: dễ, trung bình, khó.',
          'Bắt đầu hành trình của mình.',
          '1. Người nông dân bắt đầu vượt qua thử thách tại Cánh đồng ký tự',
          '2. Tiếp tục đến với thử thách tại Vườn hoa quả',
          '3. Cuối cùng, cũng là thử thách khó nhất đó là Thung lũng câu đố',
          'Khi hoàn thành tất cả các cấp độ',
          'Người nông dân sẽ tìm được đường trở về nông trại của mình.'
        ],
        {
          fontSize: 28,
          fontFamily: 'Arial',
          color: '#000',
        }
      )
      .setOrigin(0.5, 0.25);

    this.guideText.setStroke('#fff', 20);

    this.backBtn = new Button(this, {
      text: `Quay lại`,
      x: width / 2,
      y: height - 90,
      textColor: '#000',
      btnColor: 0xf2f494,
      onClick: () => {
        this.scene.start('LoadingScene');
      },
      width: 250,
    });
  }

  update() {
    console.log('update');
  }
}
