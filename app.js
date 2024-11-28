const {createElement, useState} = React;

function getNatureOfnumber(number){
  if(isPrime(number)) return "prime";
  if(number % 2 === 0) return "even";
  else return "odd";
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

const  Header = createElement("header", {className: "header"},
  createElement("h1", null, "Numbers Facts"),
  createElement("p", null, `1th fact: "Numbers are everywhere"`)
);

let previousValue = null;

const App = () =>{

  const [range, setRange] = useState(0) // 0 : 0 - 100 , 1: 100 - 200...
  const [fact, setFact] = useState("Tap a number, discover a fact!");

  async function  handleClick(event){
    try{
      const value = event.target.dataset.value;
      const response = await fetch(`http://numbersapi.com/${value}/math`);
      const factText = await response.text();

      if(previousValue){
        document.querySelector(`[data-value="${previousValue}"]`).classList.remove("active");
      }

      document.querySelector(`[data-value="${value}"]`).classList.add("active");
      previousValue = value;
      setFact(factText);
      
    } catch(error){
      console.log(error);
    }
  }

  const numbers = [...Array(101).keys()].map(number =>{
    const numberValue = number >= 0 ? number + (range + 1) * 100 : number - range * 100; 
    
    return createElement(
    "div",
    {
      className: `number ${numberValue === 0 ? "zero" : getNatureOfnumber(numberValue)}`,
      onClick: handleClick,
      'data-value': numberValue,
    },
    numberValue);
  });

  function handleBrowseClick(change){
    setRange(prev => prev + change);
    if(previousValue){
      document.querySelector(".number.active").classList.remove("active");
      previousValue = null; // when range changes the previous selected value is not an element of the current range
                           // reset to null  fix returing null in querySelector [data-value="{previousValue}"]
    }
  }

  return createElement("div", {className: "app"},
    Header,
    createElement("p", {className: "fact"}, fact),
    createElement("div", {className: "numbers-container"}, ...numbers),
    createElement("div", {className: "browse-ranges"}, 
      createElement("button", {className: "browse-btn", onClick:() => handleBrowseClick(-1)}, `${(range - 1) * 100} to ${range * 100}`),
      createElement("button", {className: "browse-btn", onClick:() => handleBrowseClick(1)}, `${range  * 100} to ${( range + 1) * 100}`)
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(createElement(App));
