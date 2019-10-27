import React from "react";
import "./app.render-time.commit-time.scss";

const R: React.SFC<{ data: string[] }> = props => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {props.data.map((item, i) => (
        <span
          key={item}
          style={{
            color: ["#02f", "#f4a", "#0bb"][Math.floor(Math.random() * 3)]
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const RC: React.SFC<{ data: string[] }> = props => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {props.data.map((item, i) => (
        <span key={item} className={`color-${Math.floor(Math.random() * 3)}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

const C: React.SFC<{ data: string[] }> = props => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {props.data.map((item, i) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
};

const genData = () => {
  return [...Array(5000)].map(() =>
    Math.random()
      .toString(36)
      .substring(3)
  );
};

const App: React.FC = () => {
  const [data, setData] = React.useState<string[]>(genData());

  return (
    <>
      <RC data={data} />
      <hr />
      <R data={data} />
      <hr />
      <C data={data} />
      <button
        onClick={() => setData(genData)}
        style={{ position: "fixed", top: "0px", left: "0px" }}
      >
        change
      </button>
    </>
  );
};

export default App;
