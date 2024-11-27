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
  createElement("p", null, "1th fact: Numbers are everywhere..")
);

const App = () =>{

  const [fact, setFact] = useState("Tap a number, discover a fact!");

  async function  handleClick(event){
    try{
      const response = await fetch(`http://numbersapi.com/${event.target.dataset.value}/math`);
      const factText = await response.text();
      setFact(factText);
    } catch(error){
      console.log(error);
    }
  }

  const numbers = [...Array(101).keys()].map(number =>{
    return createElement(
    "div",
    {
      className: `number ${number === 0 ? "zero" : getNatureOfnumber(number)}`,
      onClick: handleClick,
      'data-value': number,
    },
    number);
  });

  return createElement("div", {className: "app"},
    Header,
    createElement("p", {className: "fact"}, fact),
    createElement("div", {className: "numbers-container"}, ...numbers)
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(createElement(App));
