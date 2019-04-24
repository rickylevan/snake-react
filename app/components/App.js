var React = require('react');

var numShades = 150;
var numBlocks = 30;

function greyString(c) {
  return 'rgb(' + c + ',' + c + ',' + c + ')'
}

function blueString(c) {
    return 'rgb(' + 0 + ',' + c/2 + ',' + c + ')'
}

function getGreyGrid(numBlocks) {
    var squareShades = [];
    for (var i = 0; i < numBlocks; i++) {
      var next = new Array(numBlocks)
      for (var j = 0; j < numBlocks; j++) {
        next.push(Math.floor(Math.random()*256));
      }
      squareShades.push(next);
    }
    return squareShades;
}

function blockInSnake(i, j, snake) {
  for (var p = 0; p < snake.length; p++) {
    if ((snake[p][0] == i) && (snake[p][1] == j)) {
      return true;
    }
  }
  return false;
}

function choosePill(snake) {
outerLoop:
  while (true) {
    var x = Math.floor(Math.random() * numBlocks);
    var y = Math.floor(Math.random() * numBlocks);

    for (var i = 0; i < snake.length; i++) {
      if (snake[i][0] == x && snake[i][1] == y) {
        continue outerLoop
      }
    }

    return [x,y];
  }
}

function selfIntersect(snake) {
  for (var i = 0; i < snake.length; i++) {
    for (var j = i+1; j < snake.length; j++) {
      if (snake[i][0] == snake[j][0] &&
        snake[i][1] == snake[j][1]) {
        return true;
      }
    }
  }
  return false;
}


class App extends React.Component {
  constructor(props) {
    super(props);

    var initSnake = [[2, 0], [1, 0], [0, 0]];

    this.state = {
      selectedLanguage: 'All',
      grid: getGreyGrid(numBlocks),
      snake: initSnake,
      pill: choosePill(initSnake),
      fail: false,
      dir: "ArrowRight",
    };

    this.tick = this.tick.bind(this);
    this.handleKey = this.handleKey.bind(this);

    // refs for the win to autofocus the game, instead of having to click
    // into the div for enable keystrokes
    this.myRef = React.createRef();
    this.applyFocus = this.applyFocus.bind(this);
  }


  componentDidMount() {
    this.timer = setInterval(this.tick, 75);
    this.applyFocus();
  }

  applyFocus() {
    this.myRef.current.focus();
  }

  tick() {
    // do nothing if we've already lost
    if (this.state.fail) {
      return;
    }
    var oldx = this.state.snake[0][0];
    var oldy = this.state.snake[0][1];

    // alas, (old + 1) % numBlocks fails cuz JS '%' is messed up
    if (this.state.dir == "ArrowDown") {
      // more mirror-flip, sawry
      oldy++;
      if (oldy == numBlocks) {
        oldy = 0;
      }
    } else if (this.state.dir == "ArrowUp") {
      oldy--;
      if (oldy == -1) {
        oldy = numBlocks-1;
      }
    } else if (this.state.dir == "ArrowRight") {
      oldx++;
      if (oldx == numBlocks) {
        oldx = 0;
      }
    } else {
      oldx--;
      if (oldx == -1) {
        oldx = numBlocks-1;

      }
    }

    var next = [oldx, oldy];
    var cloneSnake = [...this.state.snake];

      this.setState( () => {


        if (selfIntersect([next].concat(cloneSnake))) {
          return {
            fail: true,
            snake: [next].concat(cloneSnake),
          }

        }



        // if head of snake intersects pill
        if (next[0] == this.state.pill[0] && next[1] == this.state.pill[1]) {
          var nextSnake = [next].concat(cloneSnake);
          return {
            snake: nextSnake,
            pill: choosePill(nextSnake),
          }
        } else {
          cloneSnake.pop();
          return {
            snake: [next].concat(cloneSnake),
          }
        }
      });
  }

  handleKey(key) {
    key.persist(); // money line, otherwise null
    this.setState(function() {
      return {
        dir: key.nativeEvent.key,
      }
    });
  }

  render() {
    return (
      <div style={{outline:50}} ref={this.myRef} 
        tabIndex={-1} onKeyDown={this.handleKey} autoFocus="true">    
       <div> 
            {this.state.grid.map((row, i) => {
              return (<div ikey={i} key={i} style={{display: 'flex'}}> 
                {row.map((val, j) => {
                  return <div jkey={j} key={j} style={
                    {'height': '20px', 'width': '20px', background: (
                      /* mirror flip here, & j off by numBlocks */
                      getBlockColor(j-numBlocks, i, val, 
                        this.state.snake, this.state.pill, this.state.fail))}}>
                </div>})}
              </div>);
            })}
        </div>
      </div>
    )
  }

}

function getBlockColor(i, j, gridVal, snake, pill, fail) {
  if (blockInSnake(i, j, snake)) {
    if (fail) {
      return 'rgb(150,30,30)';
    } else {
      return 'rgb(250,200,50)';
    }
  } else {
    if (pill[0] == i && pill[1] == j) {
      return 'rgb(255,255,255)';
    } else {
      return blueString(gridVal/2);
    }
  }

}






module.exports = App;