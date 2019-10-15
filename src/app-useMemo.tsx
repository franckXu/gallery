import React from "react";

type TFirend = { name: string; phone: string };

const genMockData = () => {
  return ["franck", "Tom", "Eric"].map((item, i) => {
    return { name: item, phone: 123 * (i + 1) + "" };
  });
};

const Field: React.SFC<{ value: string; label: string }> = props => {
  console.log("Field render", props);
  return (
    <li>
      {props.label}:{props.value}
    </li>
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

const List: React.SFC<{ firends: TFirend[]; name: string }> = props => {
  console.log("render List", props);

  return (
    <ul>
      {props.firends.map((item, i) => {
        console.log(item, i);
        return <FieldMemo key={i} value={item.phone} label={item.name} />;
      })}
    </ul>
  );
};

const ListMemo = React.memo(List);

const App: React.FC = () => {
  console.log("App render");

  const [phone, setPhone] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [firends, setFirends] = React.useState<TFirend[]>([]);

  const onNameChange = React.useCallback((val: string) => {
    setName(val);
  }, []);

  React.useEffect(() => {
    setFirends(genMockData());
  }, []);

  const firendsMemo = React.useMemo(()=>{
    return firends.filter(
      item => item.name.toLowerCase().search(name.toLowerCase()) > -1
    )
  },[name,firends])

  return (
    <div>
      <InputItemMemo value={phone} label="phone" onChange={setPhone} />
      <InputItemMemo value={name} label="name" onChange={onNameChange} />
      <hr />
      <ListMemo
        firends={firendsMemo}
        name={name}
      />
    </div>
  );
};

export default App;
