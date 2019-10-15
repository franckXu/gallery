import React from "react";

const Field: React.SFC<{ value: string; label: string }> = props => {
  return (
    <div>
      {props.label}:{props.value}
    </div>
  );
};

const FieldMemo = React.memo(Field);

const InputItem: React.SFC<{
  value: string;
  label: string;
  onChange(val: string): void;
}> = props => {
  console.log("InputItem render", props);
  return (
    <div>
      <label htmlFor={props.label}>{props.label}:</label>
      <input
        id={props.label}
        type="text"
        value={props.value}
        onChange={e => props.onChange(e.currentTarget.value)}
      />
    </div>
  );
};

const InputItemMemo = React.memo(InputItem);

const App: React.FC = () => {
  console.log("App render");
  const [name, setName] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");

  return (
    <div>
      <InputItemMemo value={name} label="name" onChange={setName} /> {/* react保证useState hook中的setState是不变的 */}
      <InputItemMemo value={age} label="age" onChange={setAge} />
      <hr />
      <FieldMemo value={name} label="name" />
      <FieldMemo value={age} label="age" />
    </div>
  );
};

export default App;
