import React from "react";

const Field: React.SFC<{ value: string; label: string }> = props => {
  console.log('render Field',props)
  return (
    <div>
      {props.label}:{props.value}
    </div>
  );
};

const InputItem: React.SFC<{ value: string; label: string,onChange(val:string):void }> = props => {
  return (
    <div>
      <label htmlFor={props.label}>{props.label}:</label>
      <input id={props.label} type="text" value={props.value} onChange={e=>props.onChange(e.currentTarget.value)} />
    </div>
  );
};


const App: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");

  return (
    <div>
      <InputItem value={name} label="name" onChange={val=>setName(val)} />
      <InputItem value={age} label="age" onChange={val=>setAge(val)} />
      <hr />
      <Field value={name} label="name" />
      <Field value={age} label="age" />
    </div>
  );
};

export default App;
