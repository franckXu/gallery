import React from "react";

const Field: React.SFC<{ value: string; label: string }> = props => {
  console.log("<Field /> render", props);
  return (
    <div>
      {props.label}:{props.value}
    </div>
  );
};

const FieldMemo = React.memo(Field);

type TInputItemProps = {
  value: string;
  label: string;
  onChange(val: string): void;
};

const InputItem: React.SFC<TInputItemProps> = props => {
  console.log("<InputItem /> render", props);
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

const InputItemMemo = React.memo(
  InputItem,
  (prevProps: TInputItemProps, nextProps: TInputItemProps) => {
    return (
      prevProps.value === nextProps.value && prevProps.label === nextProps.label
      // && prevProps.onChange === nextProps.onChange
    );
  }
);

const App: React.FC = () => {
  console.log("App render");
  const [name, setName] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");

  return (
    <div>
      <InputItem
        value={name}
        label="name"
        onChange={(val: string) => {
          setName(val);
        }}
      />
      <InputItem
        value={age}
        label="age"
        onChange={(val: string) => {
          setAge(val);
        }}
      />
      <hr />
      <Field value={name} label="name" />
      <Field value={age} label="age" />
    </div>
  );
};

export default App;
