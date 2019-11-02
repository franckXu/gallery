import React from "react";

// const data = [{
//   name : 'fanck'},{name : '胡歌'
// }]

const Field: React.SFC<{ value: string; label: string }> = props => {
  // console.log('render Field',props)
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
  onBlur?(val: string): void;
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
        onBlur={e => props.onBlur && props.onBlur(e.currentTarget.value)}
      />
    </div>
  );
};

const InputItemMemo = React.memo(InputItem);

const App: React.FC = () => {
  console.log("App render");
  const [name, setName] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");
  const [sex, setSex] = React.useState<string>("");

  const onNameChange = React.useCallback((val: string) => {
    setName(val);
  }, []);

  const onNameBlur = React.useCallback((val: string) => {
    // console.log('onNameBlur sex:',sex);
    if (sex === "0" && val.search("Mr") !== 0) {
      return alert("please input Mr");
    }

    if (sex === "1" && val.search("Ms") !== 0) {
      return alert("please input Ms");
    }
  }, []); // <---------------^_^

  const onAgeChange = React.useCallback((val: string) => {
    setAge(val);
  }, []);

  const onSexChange = React.useCallback((val: string) => {
    setSex(val);
  }, []);

  return (
    <div>
      <InputItemMemo value={sex} label="sex" onChange={onSexChange} />
      <InputItemMemo
        value={name}
        label="name"
        onChange={onNameChange}
        onBlur={onNameBlur}
      />
      <InputItemMemo value={age} label="age" onChange={onAgeChange} />
      <hr />
      <FieldMemo value={name} label="name" />
      <FieldMemo value={age} label="age" />
    </div>
  );
};

export default App;
