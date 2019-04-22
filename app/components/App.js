var React = require('react');

var numShades = 150;
var numBlocks = 30;

function greyString(c) {
  return 'rgb(' + c + ',' + c + ',' + c + ')'
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


class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      selectedLanguage: 'All',
      grid: getGreyGrid(numBlocks),
      idx: 0,
      idy: 0,
      dir: "ArrowRight",
    };

    this.tick = this.tick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }


  componentDidMount() {
    this.timer = setInterval(this.tick, 100);
  }


  tick() {
      this.setState( () => {
        var oldx = this.state.idx;
        var oldy = this.state.idy;

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

        return {
          idx: oldx,
          idy: oldy,
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
      <div style={{outline: 0}} tabIndex={-1} onKeyDown={this.handleKey}>    
       <div> 
            {this.state.grid.map((row, i) => {
              return (<div key={i} style={{display: 'flex'}}> 
                {row.map((val, j) => {
                  return <div key={j} style={
                    {'height': '20px', 'width': '20px', background: (
                      /* mirror flip here */
                      (i == this.state.idy) && 
                      /* j strangely too high by numBlocks */
                      ((j-numBlocks) == this.state.idx)) ? 
                        'rgb(256,100,50)' : greyString(val/2)}}> 
                </div>})}
              </div>);
            })}
        </div>
      </div>
    )
  }

}


module.exports = App;