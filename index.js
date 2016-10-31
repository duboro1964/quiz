<<<<<<< HEAD
/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font       = 'Kaushan Script, cursive'
var yellow     = 'hsla(52,35%,63%,1)'
var white      = 'hsla(120,24%,96%,1)'
var violet     = 'hsla(329,25%,45%,1)'
var lightBrown = 'hsla(29,21%,67%,1)'
var darkBrown  = 'hsla(13,19%,45%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Kaushan+Script']
var font = yo`<link href=${links[0]} rel='stylesheet' type='text/css'>`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Stav #1:
E-bicikli su sjajan izum!
`,
`
Stav #2:
Njihove baterije kratko traju.
`,
`
Stav #3:
E-bicikli su skupi?
`,
`
Stav #4:
E-bicikli su idealno prevozno sredstvo u gradu.
`,
`
Stav #5:
Bicikl je za rekreaciju i ne bi trebalo da ima dodatni pogon.
`,
`
Stav #6:
E-bicikli su idealni za osobe hendikepirane u kretanju.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .question {
      font-size: 2em;
      color: ${white};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${white};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${lightBrown};
      cursor: pointer;
    }
    .instruction {
      color: ${violet};
      font-size: 1em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${white};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .back {
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      color: ${white};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${yellow};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Dobrodo�li na moj kviz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Kakvo je va�e mi�ljenje<br>
          (1 - ne sla�em se uop�te, 6 - sasvim se sla�em)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Uporedite va�e odgovore
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Kliknite da bi ste videli grafikon
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-54e38.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-54e38.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Stav #1", "Stav #2", "Stav #3",
          "Stav #4", "Stav #5", "Stav #6"
        ],
        datasets: [
          {
            label: "Moji stavovi",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Va�i stavovi",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
=======
/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font       = 'Kaushan Script, cursive'
var yellow     = 'hsla(52,35%,63%,1)'
var white      = 'hsla(120,24%,96%,1)'
var violet     = 'hsla(329,25%,45%,1)'
var lightBrown = 'hsla(29,21%,67%,1)'
var darkBrown  = 'hsla(13,19%,45%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Kaushan+Script']
var font = yo`<link href=${links[0]} rel='stylesheet' type='text/css'>`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Stav #1:
E-bicikli su sjajan izum!
`,
`
Stav #2:
Njihove baterije kratko traju.
`,
`
Stav #3:
E-bicikli su skupi?
`,
`
Stav #4:
E-bicikli su idealno prevozno sredstvo u gradu.
`,
`
Stav #5:
Bicikl je za rekreaciju i ne bi trebalo da ima dodatni pogon.
`,
`
Stav #6:
E-bicikli su idealni za osobe hendikepirane u kretanju.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .question {
      font-size: 2em;
      color: ${white};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${white};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${lightBrown};
      cursor: pointer;
    }
    .instruction {
      color: ${violet};
      font-size: 1em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${white};
      text-align: center;
      font-family: 'Kaushan Script', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .back {
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      color: ${white};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${yellow};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Dobrodo�li na moj kviz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Kakvo je va�e mi�ljenje<br>
          (1 - ne sla�em se uop�te, 6 - sasvim se sla�em)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Uporedite va�e odgovore
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Kliknite da bi ste videli grafikon
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-54e38.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-54e38.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Stav #1", "Stav #2", "Stav #3",
          "Stav #4", "Stav #5", "Stav #6"
        ],
        datasets: [
          {
            label: "Moji stavovi",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Va�i stavovi",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
>>>>>>> origin/master
