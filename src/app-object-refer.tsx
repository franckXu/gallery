import React from "react";

type TFirend = { name: string; phone: string; id: string; nickNames: string[] };

const genMockData = () => {
  return ["franck", "Tom", "Eric"].map((item, i) => {
    return {
      name: item,
      phone: 123 * (i + 1) + "",
      id: Math.random()
        .toString(36)
        .substring(3),
      nickNames: [1, 2, 3].map(j => item + j)
    };
  });
};

type TFieldProps = {
  value: string;
  label: string;
  nickNames: string[];
  onClick(): void;
};
const Field: React.SFC<TFieldProps> = props => {
  console.log("Field render", props);
  return (
    <li onClick={props.onClick}>
      <p>
        <strong>{props.label}</strong> <span>{props.value}</span>
      </p>
      <p>nickName: {props.nickNames.join(",")}</p>
    </li>
  );
};

const FieldMemo = React.memo(Field, (pP: TFieldProps, nP: TFieldProps) => {
  console.log(pP, nP);
  return (
    pP.value === nP.value &&
    pP.label === nP.label &&
    pP.nickNames.toString() === nP.nickNames.toString()
  );
});

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

const List: React.SFC<{
  firends: TFirend[];
  onItemClick(id: string): void;
}> = props => {
  console.log("render List", props);
  return (
    <ul>
      {props.firends.map((item, i) => {
        return (
          <FieldMemo
            key={i}
            value={item.phone}
            label={item.name}
            nickNames={item.nickNames}
            onClick={() => props.onItemClick(item.id)}
          />
        );
      })}
    </ul>
  );
};

const ListMemo = React.memo(List);

const EditForm: React.SFC<
  TFirend & {
    onNameChange(v: string): void;
    onPhoneChange(v: string): void;
    onNickNameChange(idx: number, v: string): void;
  }
> = props => {
  return (
    <div>
      <div>
        <InputItem
          {...{
            value: props.name,
            label: "name",
            onChange(val) {
              props.onNameChange(val);
            }
          }}
        />
      </div>
      <div>
        <InputItem
          {...{
            value: props.phone,
            label: "phone",
            onChange(val) {
              props.onPhoneChange(val);
            }
          }}
        />
      </div>

      <div>
        {props.nickNames.map((item, i) => {
          return (
            <InputItem
              key={i}
              {...{
                value: item,
                label: "",
                onChange(val) {
                  props.onNickNameChange(i, val);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  console.log("App render");

  const [firends, setFirends] = React.useState<TFirend[]>([]);
  const [curFirendId, setCurFirendId] = React.useState<string>("");

  React.useEffect(() => {
    setFirends(genMockData());
  }, []);

  const onItemClick = (val: string) => {
    setCurFirendId(val);
  };

  return (
    <div>
      <ListMemo firends={firends} onItemClick={onItemClick} />
      {curFirendId && (
        <EditForm
          {...firends.find(item => item.id === curFirendId)!}
          onNameChange={v => {
            console.log("0", firends);
            const newFirends = firends.map(item => {
              if (item.id === curFirendId) item.name = v;
              return item;
            });
            console.log("1", newFirends);
            setFirends(newFirends);
          }}
          onPhoneChange={v => {
            firends.forEach(item => {
              if (item.id === curFirendId) item.phone = v;
            });
          }}
          onNickNameChange={(idx, v) => {
            const newFirends = firends.map(item => {
              if (item.id === curFirendId) item.nickNames =  item.nickNames.map((nickName,j)=> j === idx ? v : nickName );
              return item;
            });
            setFirends(newFirends);
          }}
        />
      )}
    </div>
  );
};

export default App;
