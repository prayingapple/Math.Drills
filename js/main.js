var app = new Vue({
  el: '#app',
  data: {
    maxNum: 5, // 問題数
    maxOperand: 99, // 出題する数の最大値（0〜99のように複数桁を許可）
    pointsPerQuestion: 10, // 一問正解すると得られる点数
    score: 0, // 得点
    goodOrBad: 'good', // 成績によって画像を出しわけるフラグ
    wasPushed: false, // ボタンを一回だけ押せるように制御するフラグ
    resultDisplay: 'none', // 最初は結果を表示しない
    lists: [] // 問題のリスト
  },
  mounted: function () {
    // ページを読み込んだら問題数に応じた問題リストを作成する
    for (var i = 0; i < this.maxNum; i++) {
      var operation = Math.random() < 0.5 ? '+' : '-';
      var numberOne = Math.floor(Math.random() * (this.maxOperand + 1));
      var numberTwo = Math.floor(Math.random() * (this.maxOperand + 1));

      // 引き算のときは答えがマイナスにならないように大きい方を前にする
      if (operation === '-' && numberOne < numberTwo) {
        var tmp = numberOne;
        numberOne = numberTwo;
        numberTwo = tmp;
      }

      this.lists.splice(i, 0,
        {
          id: i,
          numberOne: numberOne,
          numberTwo: numberTwo,
          operator: operation,
          maruBatsu: ''
        }
      )
    }
  },
  methods: {
    rightOrWrong: function (event) {
      // ボタンが押されたら成績を計算する
      for (var i = 0; i < this.maxNum; i++) {
        var question = this.lists[i];
        var correctAnswer;

        if (question.operator === '+') {
          correctAnswer = question.numberOne + question.numberTwo;
        } else {
          correctAnswer = question.numberOne - question.numberTwo;
        }

        var myAnswer = document.getElementById('a' + i).value;
        if (correctAnswer === parseInt(myAnswer, 10)) {
          this.lists[i].maruBatsu = 'O';
          this.score += this.pointsPerQuestion
        } else {
          this.lists[i].maruBatsu = 'X';
        }
      }

      // 80%以上の正解率だったら「よくできました」画像を表示する
      if (this.score < (this.pointsPerQuestion * this.maxNum * 0.8)) {
        this.goodOrBad = 'bad'
      }

      // ボタンをインアクティブに変更
      this.wasPushed = true;

      // 結果欄を表示
      this.resultDisplay = 'block';
    }
  }
})
