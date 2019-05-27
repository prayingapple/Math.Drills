var app = new Vue({
  el: '#app',
  data: {
    maxNum: 5, // 問題数
    pointsPerQuestion: 10, // 一問正解すると得られる点数
    score: 0, // 得点
    goodOrBad: 'good', // 成績によって画像を出しわけるフラグ
    wasPushed: false, // ボタンを一回だけ押せるように制御するフラグ
    resultDisplay: 'none', // 最初は結果を表示しない
    lists: [] // 問題のリスト
  },
  mounted: function () {
    // ページを読み込んだら問題数に応じた問題リストを作成する
    for (i = 0; i < this.maxNum; i++) {
      this.lists.splice(i, 0, 
        {
          numberOne: Math.floor(Math.random() * 10), 
          numberTwo: Math.floor(Math.random() * 10),
          maruBatsu: ''
        }
      )
    }
  },
  methods: {
    rightOrWrong: function (event) {
      // ボタンが押されたら成績を計算する
      for (i = 0; i < this.maxNum; i++) {
        var correctAnswer = this.lists[i].numberOne + this.lists[i].numberTwo
        var myAnswer = document.getElementById('a' + i).value;
        if (correctAnswer === parseInt(myAnswer)) {
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
